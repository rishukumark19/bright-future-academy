/**
 * SUCCESS PAGE — JS
 * Fires confetti, loads enrollment details, populates page
 */
import { COURSE } from './config.js';
import confetti from 'canvas-confetti';

const params = new URLSearchParams(window.location.search);
const enrollmentId = params.get('id');

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('nav-brand').textContent = COURSE.brand;
  document.getElementById('success-course').textContent = COURSE.name;
  document.getElementById('drive-link').href = COURSE.drive.folderUrl;
  document.getElementById('whatsapp-support').href = COURSE.support.whatsappUrl;

  if (enrollmentId) {
    document.getElementById('order-ref').textContent = `#${enrollmentId.slice(0, 8).toUpperCase()}`;
    await loadEnrollmentDetails();
  }

  // Confetti 🎉
  fireConfetti();
});

async function loadEnrollmentDetails() {
  try {
    const res = await fetch(`/api/payment-status?id=${enrollmentId}`);
    if (!res.ok) return;
    const data = await res.json();

    if (data.email) {
      document.getElementById('access-email').textContent = data.email;
      document.getElementById('success-sub').textContent =
        `Your Google Drive course vault has been shared to ${data.email}. Click below to open it now.`;
    }
  } catch {
    // Non-blocking — page works without this
  }
}

function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });

  // First burst
  myConfetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00f090', '#58ffa5', '#4edea3', '#def1ff', '#b4ffcb'],
  });

  // Second burst with delay
  setTimeout(() => {
    myConfetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#00f090', '#58ffa5', '#4edea3'],
    });
    myConfetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#00f090', '#58ffa5', '#4edea3'],
    });
  }, 600);
}
