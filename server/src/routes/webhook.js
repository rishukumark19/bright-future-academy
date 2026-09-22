/**
 * RAZORPAY WEBHOOK HANDLER
 * Backup confirmation — fires when Razorpay sends server-side event
 * (handles case where frontend handler never fires, e.g. browser closed)
 */
import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../services/database.js';
import { fulfillEnrollment } from './api.js';

const router = Router();

router.post('/', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body; // raw Buffer (set in index.js)

  if (!signature || !rawBody) {
    return res.status(400).json({ error: 'Missing webhook data' });
  }

  // ── Verify webhook signature ──
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (!crypto.timingSafeEqual(
    Buffer.from(expectedSig, 'hex'),
    Buffer.from(signature, 'hex')
  )) {
    console.warn('⚠️  Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Parse body now that it's verified
  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  console.log(`📥 Webhook event: ${event.event}`);

  // ── Handle payment.captured ──
  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity;
    if (!payment) return res.json({ ok: true });

    const orderId = payment.order_id;

    try {
      // Fetch enrollment
      const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('razorpay_order_id', orderId)
        .single();

      if (error || !enrollment) {
        console.warn('Webhook: enrollment not found for order', orderId);
        return res.json({ ok: true });
      }

      // Idempotency — skip if already fulfilled
      if (enrollment.payment_status === 'paid' && enrollment.drive_access_granted) {
        console.log('Webhook: already fulfilled, skipping');
        return res.json({ ok: true });
      }

      // Mark as paid if not already
      if (enrollment.payment_status !== 'paid') {
        await supabase
          .from('enrollments')
          .update({
            payment_status: 'paid',
            razorpay_payment_id: payment.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', enrollment.id);
      }

      // Fulfill (async — Razorpay expects fast 200)
      fulfillEnrollment(enrollment, true).catch(err => {
        console.error('Webhook fulfillment error:', err);
      });

    } catch (err) {
      console.error('Webhook processing error:', err);
    }
  }

  // Always return 200 quickly — Razorpay retries on non-200
  return res.status(200).json({ ok: true });
});

export default router;
