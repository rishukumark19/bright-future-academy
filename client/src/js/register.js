/**
 * REGISTRATION PAGE — JS
 * Handles form validation, calls /api/create-order, then redirects to Razorpay
 */
import { COURSE, API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  populatePage();
  setupForm();
});

function populatePage() {
  document.getElementById('nav-brand').textContent = COURSE.brand;
  document.getElementById('reg-heading').textContent = `Register for ${COURSE.name}`;
  document.getElementById('summary-name').textContent = COURSE.name;
  document.getElementById('summary-sub').textContent = COURSE.subtitle;
  document.getElementById('summary-price').textContent = COURSE.price.display;
  document.getElementById('support-link').href = COURSE.support.whatsappUrl;
  document.getElementById('footer-support').href = `mailto:${COURSE.support.email}`;

  if (COURSE.price.hasDiscount) {
    const d = document.getElementById('summary-discount');
    d.textContent = COURSE.price.discountPercent + ' Off';
    d.classList.remove('hidden');
  }

  // Inclusions
  const list = document.getElementById('summary-inclusions');
  list.innerHTML = COURSE.inclusions.map(inc => `
    <li class="check-item">
      <span class="material-symbols-outlined text-primary-container text-[18px] shrink-0 mt-0.5">verified</span>
      <span>${inc.label}</span>
    </li>
  `).join('');
}

function setupForm() {
  const form = document.getElementById('registration-form');
  form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  // ── VALIDATION ──────────────────────────────────────────
  let valid = true;

  if (!name || name.length < 2) {
    showFieldError('name-error');
    document.getElementById('fullName').classList.add('border-error');
    valid = false;
  } else {
    hideFieldError('name-error');
    document.getElementById('fullName').classList.remove('border-error');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError('email-error');
    document.getElementById('email').classList.add('border-error');
    valid = false;
  } else {
    hideFieldError('email-error');
    document.getElementById('email').classList.remove('border-error');
  }

  if (!valid) {
    showFormError('Please check the fields above and try again.');
    return;
  }
  hideFormError();

  // ── SAVE TO SESSION STORAGE ──────────────────────────────
  sessionStorage.setItem('enrollment', JSON.stringify({ name, email, phone }));

  // ── CALL BACKEND ─────────────────────────────────────────
  setLoadingState(true);

  try {
    const res = await fetch(API_BASE_URL + '/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Server error: ${res.status}`);
    }

    const { order_id, amount, key_id, enrollment_id } = await res.json();

    // Save for checkout page
    sessionStorage.setItem('razorpay', JSON.stringify({ order_id, amount, key_id, enrollment_id }));

    // Redirect to checkout review page
    window.location.href = `./checkout.html?id=${enrollment_id}`;

  } catch (err) {
    console.error('Order creation failed:', err);
    showFormError('Something went wrong — please try again. If the issue persists, contact support.');
    setLoadingState(false);
  }
}

function setLoadingState(loading) {
  const btn = document.getElementById('submit-btn');
  const text = document.getElementById('submit-text');
  const icon = document.getElementById('submit-icon');

  if (loading) {
    btn.disabled = true;
    btn.classList.add('opacity-70', 'cursor-not-allowed');
    text.textContent = 'Creating Your Order…';
    icon.textContent = 'hourglass_top';
  } else {
    btn.disabled = false;
    btn.classList.remove('opacity-70', 'cursor-not-allowed');
    text.textContent = 'Continue to Payment';
    icon.textContent = 'arrow_forward';
  }
}

function showFieldError(id) {
  document.getElementById(id)?.classList.remove('hidden');
}

function hideFieldError(id) {
  document.getElementById(id)?.classList.add('hidden');
}

function showFormError(msg) {
  const banner = document.getElementById('form-error');
  const text = document.getElementById('form-error-text');
  text.textContent = msg;
  banner.classList.remove('hidden');
  banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideFormError() {
  document.getElementById('form-error').classList.add('hidden');
}
