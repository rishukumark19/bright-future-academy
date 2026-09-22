/**
 * STATUS PAGE — JS
 * Polls /api/payment-status every 3s, redirects based on outcome
 */
import { COURSE } from './config.js';

const params = new URLSearchParams(window.location.search);
const enrollmentId = params.get('id');
const verifyError = params.get('verify_error');

let pollCount = 0;
const MAX_POLLS = 20; // ~60 seconds
let progress = 10;

document.getElementById('whatsapp-help').href = COURSE.support.whatsappUrl;

if (!enrollmentId) {
  window.location.href = '/';
} else {
  document.getElementById('order-ref').textContent = `Order: ${enrollmentId.slice(0, 8).toUpperCase()}`;
  if (verifyError) {
    updateStep('Verification error — rechecking with server…');
  }
  startPolling();
}

function startPolling() {
  poll();
  const interval = setInterval(async () => {
    pollCount++;
    if (pollCount >= MAX_POLLS) {
      clearInterval(interval);
      handleTimeout();
      return;
    }
    const done = await poll();
    if (done) clearInterval(interval);
  }, 3000);
}

async function poll() {
  try {
    progress = Math.min(progress + 5, 85);
    updateProgress(progress);

    const res = await fetch(`/api/payment-status?id=${enrollmentId}`);
    if (!res.ok) return false;

    const data = await res.json();
    const { payment_status, drive_access_granted } = data;

    updateStep(`Status: ${payment_status?.toUpperCase() || 'CHECKING'}…`);

    if (payment_status === 'paid' && drive_access_granted) {
      updateProgress(100);
      updateStep('Access Granted ✓');
      setTimeout(() => {
        window.location.href = `/success?id=${enrollmentId}`;
      }, 600);
      return true;
    }

    if (payment_status === 'paid' && !drive_access_granted) {
      updateStep('Payment confirmed — provisioning Drive access…');
      // Keep polling — Drive may still be processing
      return false;
    }

    if (payment_status === 'failed') {
      window.location.href = `/failed?id=${enrollmentId}`;
      return true;
    }

    if (payment_status === 'cancelled') {
      window.location.href = `/cancelled?id=${enrollmentId}`;
      return true;
    }

    return false;
  } catch (err) {
    console.error('Poll error:', err);
    return false;
  }
}

function handleTimeout() {
  // After 60s, if Drive access not yet granted but payment is likely done
  window.location.href = `/access-pending?id=${enrollmentId}`;
}

function updateProgress(pct) {
  document.getElementById('progress-bar').style.width = `${pct}%`;
}

function updateStep(text) {
  document.getElementById('status-step').textContent = text;
}
