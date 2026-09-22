import { COURSE } from './config.js';

document.getElementById('nav-brand').textContent = COURSE.brand;
document.getElementById('whatsapp-help').href = COURSE.support.whatsappUrl;

// Show failure reason if stored
const reason = sessionStorage.getItem('payment_failure_reason');
if (reason) {
  document.getElementById('failure-reason').textContent = reason;
  sessionStorage.removeItem('payment_failure_reason');
}

// Retry — go back to checkout (which re-opens Razorpay)
window.retryPayment = function() {
  const rzp = sessionStorage.getItem('razorpay');
  if (rzp) {
    window.location.href = '/checkout';
  } else {
    window.location.href = '/register';
  }
};
