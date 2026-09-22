/**
 * API ROUTES
 * All course platform API endpoints
 */
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { razorpay } from '../services/razorpay.js';
import { supabase } from '../services/database.js';
import { grantDriveAccess } from '../services/drive.js';
import { sendConfirmationEmail, sendAdminNotification } from '../services/email.js';

const router = Router();

// ── POST /api/create-order ─────────────────────────────────────────────────
// Creates a Razorpay order and saves a pending enrollment record
router.post('/create-order', async (req, res) => {
  const { name, email, phone } = req.body;

  // ── Validate inputs ──
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Valid name is required.' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const cleanName = name.trim().slice(0, 100);
  const cleanEmail = email.trim().toLowerCase().slice(0, 200);
  const cleanPhone = phone ? phone.trim().slice(0, 20) : null;

  const enrollmentId = uuidv4();
  const priceInPaise = parseInt(process.env.COURSE_PRICE_PAISE || '499900', 10);

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: priceInPaise,
      currency: 'INR',
      receipt: `enroll_${enrollmentId.slice(0, 8)}`,
      notes: {
        enrollment_id: enrollmentId,
        student_email: cleanEmail,
        student_name: cleanName,
      },
    });

    // Save enrollment record to DB
    const { error: dbError } = await supabase
      .from('enrollments')
      .insert({
        id: enrollmentId,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        razorpay_order_id: order.id,
        payment_status: 'pending',
        drive_access_granted: false,
        email_sent: false,
      });

    if (dbError) {
      console.error('DB insert error:', dbError);
      return res.status(500).json({ error: 'Could not create enrollment. Please try again.' });
    }

    return res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      key_id: process.env.RAZORPAY_KEY_ID,
      enrollment_id: enrollmentId,
    });

  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ error: 'Payment gateway error. Please try again.' });
  }
});

// ── POST /api/verify-payment ───────────────────────────────────────────────
// Verifies Razorpay payment signature, then provisions Drive access
router.post('/verify-payment', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, enrollment_id } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification parameters.' });
  }

  // ── HMAC-SHA256 signature verification ──
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const signaturesMatch = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(razorpay_signature, 'hex')
  );

  if (!signaturesMatch) {
    console.warn('⚠️  Signature mismatch for order:', razorpay_order_id);
    return res.status(401).json({ error: 'Payment verification failed. Contact support.' });
  }

  // ── Fetch enrollment record ──
  let enrollment;
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (error || !data) {
      console.error('Enrollment not found for order:', razorpay_order_id);
      return res.status(404).json({ error: 'Enrollment record not found.' });
    }
    enrollment = data;
  } catch (err) {
    console.error('DB fetch error:', err);
    return res.status(500).json({ error: 'Database error during verification.' });
  }

  // Idempotency check — don't double-process
  if (enrollment.payment_status === 'paid') {
    return res.json({ success: true, already_processed: true });
  }

  // ── Mark as paid ──
  await supabase
    .from('enrollments')
    .update({
      payment_status: 'paid',
      razorpay_payment_id,
      razorpay_signature,
      updated_at: new Date().toISOString(),
    })
    .eq('id', enrollment.id);

  // ── Provision Drive access (async — don't block the response) ──
  res.json({ success: true, enrollment_id: enrollment.id });

  // Run fulfillment after response is sent
  fulfillEnrollment(enrollment).catch(err => {
    console.error('Fulfillment error (post-verify):', err);
  });
});

// ── GET /api/payment-status ────────────────────────────────────────────────
// Returns current enrollment status (for polling)
router.get('/payment-status', async (req, res) => {
  const { id, email } = req.query;

  if (!id && !email) {
    return res.status(400).json({ error: 'id or email required.' });
  }

  try {
    let query = supabase.from('enrollments').select(
      'id, payment_status, drive_access_granted, email, created_at'
    );

    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('email', email.toLowerCase());
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({ found: false });
    }

    return res.json({
      found: true,
      id: data.id,
      email: data.email,
      payment_status: data.payment_status,
      drive_access_granted: data.drive_access_granted,
      created_at: data.created_at,
    });
  } catch (err) {
    console.error('Status check error:', err);
    return res.status(500).json({ error: 'Status check failed.' });
  }
});

// ── GET /api/check-access ──────────────────────────────────────────────────
// Self-service access check by email (for help page)
router.get('/check-access', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required.' });

  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('payment_status, drive_access_granted')
      .eq('email', email.toLowerCase().trim())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return res.json({ found: false });
    }

    return res.json({
      found: true,
      payment_status: data.payment_status,
      drive_access_granted: data.drive_access_granted,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Lookup failed.' });
  }
});

// ── POST /api/update-email ─────────────────────────────────────────────────
// Student self-service: request email correction
router.post('/update-email', async (req, res) => {
  const { old_email, new_email, phone } = req.body;

  if (!old_email || !new_email) {
    return res.status(400).json({ error: 'Both old and new email are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(new_email)) {
    return res.status(400).json({ error: 'Invalid new email address.' });
  }

  try {
    // Find the enrollment
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('email', old_email.toLowerCase().trim())
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !enrollment) {
      return res.status(404).json({ error: 'No paid enrollment found for that email.' });
    }

    // Log the request (admin will handle it manually or you can automate)
    await supabase.from('email_corrections').insert({
      enrollment_id: enrollment.id,
      old_email: old_email.toLowerCase().trim(),
      new_email: new_email.toLowerCase().trim(),
      phone: phone || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    }).catch(() => {}); // Non-blocking if table doesn't exist yet

    // Notify admin via email
    await sendAdminNotification({
      subject: 'Email Correction Request',
      body: `Student ${enrollment.name} (${old_email}) wants to change Drive access to: ${new_email}. Phone: ${phone || 'not provided'}.`,
    }).catch(() => {});

    return res.json({ success: true });
  } catch (err) {
    console.error('Email update error:', err);
    return res.status(500).json({ error: 'Request failed. Please contact WhatsApp support.' });
  }
});

// ── INTERNAL: Fulfillment ──────────────────────────────────────────────────
// Called after payment verification to grant Drive access + send email
async function fulfillEnrollment(enrollment, isRetry = false) {
  console.log(`📦 Fulfilling enrollment ${enrollment.id} for ${enrollment.email} (retry: ${isRetry})`);

  // 1. Grant Google Drive access
  let driveSuccess = false;
  try {
    await grantDriveAccess(enrollment.email);
    driveSuccess = true;

    await supabase
      .from('enrollments')
      .update({
        drive_access_granted: true,
        drive_access_granted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', enrollment.id);

    console.log(`✅ Drive access granted to ${enrollment.email}`);
  } catch (err) {
    console.error(`❌ Drive access failed for ${enrollment.email}:`, err);
  }

  // 2. Send confirmation email (even if Drive failed — let them know we're on it)
  try {
    await sendConfirmationEmail({
      to: enrollment.email,
      name: enrollment.name,
      driveSuccess,
    });

    await supabase
      .from('enrollments')
      .update({ email_sent: true, email_sent_at: new Date().toISOString() })
      .eq('id', enrollment.id);

    console.log(`📧 Confirmation email sent to ${enrollment.email}`);
  } catch (err) {
    console.error(`❌ Email failed for ${enrollment.email}:`, err);
  }

  // 3. If Drive failed, retry up to 3 more times with exponential backoff
  if (!driveSuccess && !isRetry) {
    const delays = [30000, 60000, 120000]; // 30s, 1m, 2m
    for (const delay of delays) {
      await new Promise(r => setTimeout(r, delay));
      try {
        console.log(`🔁 Retrying Drive access for ${enrollment.email}…`);
        await grantDriveAccess(enrollment.email);
        await supabase
          .from('enrollments')
          .update({
            drive_access_granted: true,
            drive_access_granted_at: new Date().toISOString(),
          })
          .eq('id', enrollment.id);
        console.log(`✅ Drive access granted on retry for ${enrollment.email}`);
        break;
      } catch (retryErr) {
        console.error(`❌ Retry failed for ${enrollment.email}:`, retryErr);
      }
    }
  }

  // 4. Notify admin of new sale
  await sendAdminNotification({
    subject: `New Enrollment: ${enrollment.name}`,
    body: `Name: ${enrollment.name}\nEmail: ${enrollment.email}\nPhone: ${enrollment.phone || 'N/A'}\nOrder: ${enrollment.razorpay_order_id}\nDrive Access: ${driveSuccess ? 'GRANTED' : 'FAILED — NEEDS MANUAL ACTION'}`,
  }).catch(() => {});
}

export { fulfillEnrollment };
export default router;
