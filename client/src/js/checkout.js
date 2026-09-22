/**
 * CHECKOUT PAGE — JS
 * Reads session storage, populates UI, launches Razorpay, handles callbacks
 */
import { COURSE, API_BASE_URL } from './config.js';

let razorpayData = null;
let enrollmentData = null;

document.addEventListener('DOMContentLoaded', () => {
  loadSessionData();
  populatePage();
});

function loadSessionData() {
  try {
    razorpayData = JSON.parse(sessionStorage.getItem('razorpay') || '{}');
    enrollmentData = JSON.parse(sessionStorage.getItem('enrollment') || '{}');
  } catch {
    razorpayData = {};
    enrollmentData = {};
  }

  // If no order data, redirect back to registration
  if (!razorpayData.order_id) {
    window.location.href = './register.html';
  }
}

function populatePage() {
  document.getElementById('nav-brand').textContent = COURSE.brand;
  document.getElementById('checkout-course-name').textContent = COURSE.name;
  document.getElementById('checkout-price').textContent = COURSE.price.display;
  document.getElementById('launch-price').textContent = COURSE.price.display;

  document.getElementById('detail-name').textContent = enrollmentData.name || '—';
  document.getElementById('detail-email').textContent = enrollmentData.email || '—';
  document.getElementById('detail-phone').textContent = enrollmentData.phone || 'Not provided';
  document.getElementById('drive-email-preview').textContent = enrollmentData.email || 'your Gmail';

  if (razorpayData.enrollment_id) {
    document.getElementById('order-token').textContent = `ORDER: ${razorpayData.enrollment_id.slice(0, 8).toUpperCase()}`;
  }

  if (COURSE.price.hasEmi) {
    document.getElementById('checkout-emi').style.display = '';
  }
}

// Exposed globally for the button onclick
window.launchRazorpay = function() {
  if (!razorpayData.key_id || !razorpayData.order_id) {
    showPaymentError('Order data missing. Please go back and try again.');
    return;
  }

  const options = {
    key: razorpayData.key_id,
    amount: razorpayData.amount,
    currency: 'INR',
    name: COURSE.brand,
    description: COURSE.name,
    order_id: razorpayData.order_id,
    prefill: {
      name: enrollmentData.name || '',
      email: enrollmentData.email || '',
      contact: enrollmentData.phone || '',
    },
    theme: {
      color: '#00f090',
    },
    modal: {
      ondismiss: function() {
        // User closed the Razorpay modal
        sessionStorage.setItem('payment_cancelled', 'true');
        window.location.href = `./cancelled.html?id=${razorpayData.enrollment_id}`;
      },
    },
    handler: async function(response) {
      // Payment completed — verify server-side
      await verifyPayment(response);
    },
  };

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
      const reason = response.error?.description || 'Payment could not be processed.';
      sessionStorage.setItem('payment_failure_reason', reason);
      window.location.href = `./failed.html?id=${razorpayData.enrollment_id}`;
    });
    rzp.open();
  } catch (err) {
    console.error('Razorpay init error:', err);
    showPaymentError('Failed to open payment gateway. Please refresh and try again.');
  }
};

async function verifyPayment(response) {
  setLaunchButtonLoading(true);

  try {
    const res = await fetch(API_BASE_URL + '/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        enrollment_id: razorpayData.enrollment_id,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Verification failed');
    }

    // Redirect to status/success page
    window.location.href = `./status.html?id=${razorpayData.enrollment_id}`;

  } catch (err) {
    console.error('Verification error:', err);
    window.location.href = `./status.html?id=${razorpayData.enrollment_id}&verify_error=1`;
  }
}

function setLaunchButtonLoading(loading) {
  const btn = document.getElementById('launch-payment-btn');
  const text = document.getElementById('launch-btn-text');
  if (loading) {
    btn.disabled = true;
    btn.classList.add('opacity-70', 'cursor-not-allowed');
    text.textContent = 'Verifying Payment…';
  }
}

function showPaymentError(msg) {
  const banner = document.getElementById('payment-error');
  document.getElementById('payment-error-text').textContent = msg;
  banner.classList.remove('hidden');
}
