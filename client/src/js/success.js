/**
 * SUCCESS PAGE — JS
 * Fires celebratory confetti, loads enrollment details from URL and session, populates UI
 */
import { COURSE, API_BASE_URL } from './config.js';
import confetti from 'canvas-confetti';

const params = new URLSearchParams(window.location.search);
const enrollmentId = params.get('id');
const payId = params.get('pay_id');
const emailParam = params.get('email');
const pkgParam = params.get('pkg');

document.addEventListener('DOMContentLoaded', async () => {
  populateData();
  fireConfetti();
  
  if (enrollmentId) {
    await fetchBackendStatus();
  }
});

function populateData() {
  let sessionData = {};
  try {
    sessionData = JSON.parse(sessionStorage.getItem('current_enrollment') || '{}');
  } catch {
    sessionData = {};
  }

  const email = emailParam || sessionData.email || 'your registered Gmail';
  const pkgTitle = pkgParam || sessionData.package_title || 'Classes 6th to 10th Study Notes';
  const orderRef = enrollmentId ? `#${enrollmentId.slice(0, 8).toUpperCase()}` : (sessionData.order_id ? `#${sessionData.order_id.slice(-8).toUpperCase()}` : '#BFA-PAID');

  const emailEl = document.getElementById('access-email');
  const receiptEmailEl = document.getElementById('receipt-email');
  const courseEl = document.getElementById('success-course');
  const orderRefEl = document.getElementById('order-ref');
  const driveLinkEl = document.getElementById('drive-link');
  const whatsappEl = document.getElementById('whatsapp-support');

  if (emailEl) emailEl.textContent = email;
  if (receiptEmailEl) receiptEmailEl.textContent = email;
  if (courseEl) courseEl.textContent = pkgTitle;
  if (orderRefEl) orderRefEl.textContent = orderRef;

  if (driveLinkEl) {
    driveLinkEl.href = COURSE.drive?.folderUrl || 'https://drive.google.com';
  }

  if (whatsappEl) {
    whatsappEl.href = `https://wa.me/919876543210?text=${encodeURIComponent(`Hello Bright Future Academy Support! I completed payment for ${pkgTitle} (Ref: ${orderRef}). My Gmail is ${email}.`)}`;
  }
}

async function fetchBackendStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payment-status?id=${enrollmentId}`);
    if (!res.ok) return;
    const data = await res.json();

    if (data.email) {
      const emailEl = document.getElementById('access-email');
      const receiptEmailEl = document.getElementById('receipt-email');
      if (emailEl) emailEl.textContent = data.email;
      if (receiptEmailEl) receiptEmailEl.textContent = data.email;
    }
  } catch {
    // Non-blocking fallback
  }
}

function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });

  // First burst
  myConfetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#20B486', '#1A966E', '#58ddac', '#F59E0B', '#10B981'],
  });

  // Second dual bursts
  setTimeout(() => {
    myConfetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#20B486', '#58ddac', '#F59E0B'],
    });
    myConfetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#20B486', '#58ddac', '#F59E0B'],
    });
  }, 500);
}
