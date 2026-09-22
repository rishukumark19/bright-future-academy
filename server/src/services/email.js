/**
 * EMAIL SERVICE — Powered by Resend
 * Sends transactional emails for enrollment confirmation and admin alerts
 */
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || 'Course Platform <noreply@yourdomain.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
const DRIVE_FOLDER_URL = process.env.GOOGLE_DRIVE_FOLDER_URL || '#';
const COURSE_NAME = process.env.COURSE_NAME || '[COURSE NAME]';
const BRAND_NAME = process.env.BRAND_NAME || '[COURSE BRAND]';
const WHATSAPP_URL = `https://wa.me/${process.env.ADMIN_WHATSAPP || ''}`;

/**
 * Sends course access confirmation email to student
 */
export async function sendConfirmationEmail({ to, name, driveSuccess }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  Resend API key not set — email not sent');
    return;
  }

  const firstName = name.split(' ')[0];

  const html = driveSuccess
    ? `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Course Access is Ready</title>
</head>
<body style="margin:0;padding:0;background:#0f131c;font-family:Inter,sans-serif;color:#dfe2ee;">
  <div style="max-width:580px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:700;color:#dfe2ee;letter-spacing:-0.02em;">${BRAND_NAME}</span>
    </div>

    <div style="background:#1c2028;border-radius:12px;padding:32px;border:1px solid rgba(255,255,255,0.06);margin-bottom:24px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:56px;height:56px;background:rgba(0,240,144,0.1);border-radius:50%;border:2px solid #00f090;text-align:center;line-height:52px;font-size:24px;margin-bottom:16px;">✅</div>
        <h1 style="font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;color:#dfe2ee;margin:0 0 8px 0;letter-spacing:-0.02em;">
          You're in, ${firstName}! 🎉
        </h1>
        <p style="color:#bacbbc;font-size:15px;margin:0;">Your Google Drive course vault is ready.</p>
      </div>

      <div style="background:#0a0e16;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="color:#849587;font-size:11px;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0;">Drive Access Granted To</p>
        <p style="color:#00f090;font-size:15px;margin:0;font-weight:500;">${to}</p>
      </div>

      <a href="${DRIVE_FOLDER_URL}" style="display:block;background:#00f090;color:#00391e;text-decoration:none;font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:600;text-align:center;padding:16px 24px;border-radius:8px;margin-bottom:16px;">
        📂 Open Your Google Drive Vault
      </a>

      <div style="background:#262a33;border-radius:8px;padding:16px;margin-top:16px;">
        <p style="color:#849587;font-size:11px;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Access Instructions</p>
        <ol style="color:#bacbbc;font-size:13px;line-height:20px;padding-left:20px;margin:0;">
          <li>Open Google Drive → Click <strong style="color:#dfe2ee;">"Shared with me"</strong> in the sidebar</li>
          <li>Find <strong style="color:#dfe2ee;">${COURSE_NAME}</strong></li>
          <li>Right-click → <strong style="color:#dfe2ee;">"Add shortcut to Drive"</strong> for easy access</li>
        </ol>
      </div>
    </div>

    <div style="text-align:center;padding:16px 0;border-top:1px solid rgba(255,255,255,0.06);">
      <p style="color:#849587;font-size:12px;margin:0 0 8px 0;">Need help?</p>
      <a href="${WHATSAPP_URL}" style="color:#00f090;font-size:13px;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:0.06em;text-decoration:none;">Chat on WhatsApp →</a>
    </div>

  </div>
</body>
</html>`
    : `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Your Payment Was Successful</title></head>
<body style="margin:0;padding:40px 24px;background:#0f131c;font-family:Inter,sans-serif;color:#dfe2ee;">
  <div style="max-width:580px;margin:0 auto;">
    <h1 style="font-family:'Space Grotesk',sans-serif;font-size:24px;color:#dfe2ee;">Payment Confirmed, ${firstName}!</h1>
    <p>Your payment was successful. We're still setting up your Google Drive access — it will be ready within the next few minutes.</p>
    <p>We'll send another email once access is confirmed, or you can <a href="${WHATSAPP_URL}" style="color:#00f090;">contact us on WhatsApp</a> for immediate assistance.</p>
    <p style="color:#849587;font-size:12px;">— ${BRAND_NAME} Support Team</p>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: driveSuccess
      ? `🎉 Your ${COURSE_NAME} Access is Ready!`
      : `✅ Payment Confirmed — ${COURSE_NAME} Access Coming Shortly`,
    html,
  });
}

/**
 * Sends an internal notification to the admin (new sale, email corrections, etc.)
 */
export async function sendAdminNotification({ subject, body }) {
  if (!process.env.RESEND_API_KEY || !ADMIN_EMAIL) return;

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `[Course Platform] ${subject}`,
    html: `<pre style="font-family:monospace;white-space:pre-wrap;">${body}</pre>`,
    text: body,
  });
}
