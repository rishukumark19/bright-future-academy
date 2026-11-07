/**
 * CHECKOUT PAGE — SMART CHECKOUT JS
 * Handles package selection, coupon calculation, order creation, and Razorpay modal launch
 */
import { API_BASE_URL } from './config.js';

// Pre-configured package catalog with prices
const PACKAGES = {
  'class-10-science-notes': {
    id: 'class-10-science-notes',
    title: 'Class 10 — All Subjects Notes + PYQ Bank',
    meta: 'Science, Mathematics & Formula Sheets · NCERT Aligned',
    mrp: 550,
    price: 499,
  },
  'class-9-science-maths': {
    id: 'class-9-science-maths',
    title: 'Class 9 — Science & Maths Foundation Pack',
    meta: 'Comprehensive Concept Revision & Solved Numericals',
    mrp: 449,
    price: 399,
  },
  'class-8-all-in-one': {
    id: 'class-8-all-in-one',
    title: 'Class 8 — All-in-One Notes & Practice Sets',
    meta: 'Maths, Science & English Chapter Summaries',
    mrp: 330,
    price: 299,
  },
  'class-7-foundation-pack': {
    id: 'class-7-foundation-pack',
    title: 'Class 7 — Foundation Notes & Quick Revision Maps',
    meta: 'Core Revision Notes & Diagram Worksheets',
    mrp: 275,
    price: 249,
  },
  'classes-6-10-master-pass': {
    id: 'classes-6-10-master-pass',
    title: 'Classes 6th to 10th — Master Pass (All Classes)',
    meta: 'Full 500+ Study Notes, Formula Sheets & Question Banks',
    mrp: 999,
    price: 799,
  }
};

let selectedPackage = PACKAGES['class-10-science-notes'];
let discountPercent = 10; // TOP10 coupon default (10%)
let couponApplied = true;

document.addEventListener('DOMContentLoaded', () => {
  initPackageFromURL();
  initPackageSelection();
  initCouponSystem();
  initFormSubmission();
  updateSummaryUI();
});

/**
 * Reads ?package= or ?course= from URL to pre-select class
 */
function initPackageFromURL() {
  const params = new URLSearchParams(window.location.search);
  const pkgParam = params.get('package') || params.get('course') || params.get('class');
  
  if (pkgParam) {
    if (PACKAGES[pkgParam]) {
      selectedPackage = PACKAGES[pkgParam];
    } else if (pkgParam.includes('10')) {
      selectedPackage = PACKAGES['class-10-science-notes'];
    } else if (pkgParam.includes('9')) {
      selectedPackage = PACKAGES['class-9-science-maths'];
    } else if (pkgParam.includes('8')) {
      selectedPackage = PACKAGES['class-8-all-in-one'];
    } else if (pkgParam.includes('7')) {
      selectedPackage = PACKAGES['class-7-foundation-pack'];
    } else if (pkgParam.includes('master') || pkgParam.includes('combo')) {
      selectedPackage = PACKAGES['classes-6-10-master-pass'];
    }
  }

  // Pre-check the corresponding radio input
  const radio = document.querySelector(`input[name="notes-package"][value="${selectedPackage.id}"]`);
  if (radio) {
    radio.checked = true;
  }

  // Pre-fill student info if passed in URL
  const nameParam = params.get('name');
  const emailParam = params.get('email');
  const phoneParam = params.get('phone');
  if (nameParam && document.getElementById('student-name')) {
    document.getElementById('student-name').value = decodeURIComponent(nameParam);
  }
  if (emailParam && document.getElementById('student-email')) {
    document.getElementById('student-email').value = decodeURIComponent(emailParam);
  }
  if (phoneParam && document.getElementById('student-phone')) {
    document.getElementById('student-phone').value = decodeURIComponent(phoneParam);
  }
}

/**
 * Handle clicking on package options
 */
function initPackageSelection() {
  const cards = document.querySelectorAll('.package-option-card');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        const pkgId = radio.value;
        if (PACKAGES[pkgId]) {
          selectedPackage = PACKAGES[pkgId];
          updateOptionCardStyles();
          updateSummaryUI();
        }
      }
    });
  });

  updateOptionCardStyles();
}

function updateOptionCardStyles() {
  const cards = document.querySelectorAll('.package-option-card');
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.checked) {
      card.classList.add('border-2', 'border-[#20B486]', 'bg-[#F0FDF4]');
      card.classList.remove('border-[#E2E8F0]', 'bg-white');
    } else {
      card.classList.remove('border-2', 'border-[#20B486]', 'bg-[#F0FDF4]');
      card.classList.add('border-[#E2E8F0]', 'bg-white');
    }
  });
}

/**
 * Calculates discount and updates right column summary & pay button
 */
function updateSummaryUI() {
  const mrp = selectedPackage.mrp;
  const basePrice = selectedPackage.price;
  const discountAmount = couponApplied ? Math.round(basePrice * (discountPercent / 100)) : 0;
  const netPayable = basePrice - discountAmount;

  // Update Summary Card
  const titleEl = document.getElementById('summary-package-title');
  const metaEl = document.getElementById('summary-package-meta');
  const mrpEl = document.getElementById('summary-mrp');
  const baseEl = document.getElementById('summary-base-price');
  const discountEl = document.getElementById('summary-discount');
  const totalEl = document.getElementById('summary-total');
  const payBtnText = document.getElementById('pay-button-text');

  if (titleEl) titleEl.textContent = selectedPackage.title;
  if (metaEl) metaEl.textContent = selectedPackage.meta;
  if (mrpEl) mrpEl.textContent = `₹${mrp}`;
  if (baseEl) baseEl.textContent = `₹${basePrice}`;
  if (discountEl) discountEl.textContent = couponApplied ? `-₹${discountAmount}` : '₹0';
  if (totalEl) totalEl.textContent = `₹${netPayable}`;

  if (payBtnText) {
    payBtnText.textContent = `Pay ₹${netPayable} & Unlock Google Drive Access`;
  }
}

/**
 * Coupon input & apply handler
 */
function initCouponSystem() {
  const applyBtn = document.getElementById('apply-coupon-btn');
  const couponInput = document.getElementById('coupon-input');
  const messageEl = document.getElementById('coupon-message');

  if (!applyBtn || !couponInput) return;

  applyBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    if (code === 'TOP10' || code === 'BRIGHT10' || code === 'EARLY10') {
      discountPercent = 10;
      couponApplied = true;
      messageEl.innerHTML = `<span class="material-symbols-outlined text-[14px]">check_circle</span><span>Coupon ${code} active — Extra 10% Off applied!</span>`;
      messageEl.className = 'text-xs text-[#20B486] font-bold mt-1.5 flex items-center gap-1';
      updateSummaryUI();
    } else if (code === '') {
      discountPercent = 0;
      couponApplied = false;
      messageEl.innerHTML = `<span>No coupon applied.</span>`;
      messageEl.className = 'text-xs text-gray-500 font-medium mt-1.5';
      updateSummaryUI();
    } else {
      discountPercent = 0;
      couponApplied = false;
      messageEl.innerHTML = `<span class="material-symbols-outlined text-[14px]">error</span><span>Invalid coupon code. Try TOP10.</span>`;
      messageEl.className = 'text-xs text-red-500 font-bold mt-1.5 flex items-center gap-1';
      updateSummaryUI();
    }
  });
}

/**
 * Handle form submission: call /api/create-order and launch Razorpay modal
 */
function initFormSubmission() {
  const form = document.getElementById('checkout-form');
  const payBtn = document.getElementById('pay-button');
  const payBtnText = document.getElementById('pay-button-text');
  const errorBanner = document.getElementById('checkout-error-banner');
  const errorText = document.getElementById('checkout-error-text');

  if (!form || !payBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('student-name');
    const emailInput = document.getElementById('student-email');
    const phoneInput = document.getElementById('student-phone');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();

    // Validate Gmail address
    if (!email.includes('@')) {
      showError('Please enter a valid email address.');
      emailInput.focus();
      return;
    }

    // Calculate final payable in paise
    const discountAmount = couponApplied ? Math.round(selectedPackage.price * (discountPercent / 100)) : 0;
    const finalAmountRupees = selectedPackage.price - discountAmount;
    const amountPaise = finalAmountRupees * 100;

    // Loading state
    hideError();
    payBtn.disabled = true;
    payBtn.classList.add('opacity-80', 'cursor-not-allowed');
    const originalText = payBtnText.textContent;
    payBtnText.innerHTML = `<span class="inline-flex items-center gap-2"><span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Connecting Secure Gateway...</span>`;

    try {
      const orderPayload = {
        name,
        email,
        phone,
        package_id: selectedPackage.id,
        course_name: selectedPackage.title,
        amount_paise: amountPaise,
        coupon_code: couponApplied ? 'TOP10' : null
      };

      // Call Backend API to create Razorpay Order
      const res = await fetch(`${API_BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok || !data.order_id) {
        throw new Error(data.error || 'Could not initialize payment order.');
      }

      // Store in sessionStorage for backup tracking
      sessionStorage.setItem('current_enrollment', JSON.stringify({
        enrollment_id: data.enrollment_id,
        order_id: data.order_id,
        name,
        email,
        phone,
        package_title: selectedPackage.title,
        amount: finalAmountRupees
      }));

      // Launch official Razorpay Checkout SDK modal
      launchRazorpayModal({
        key_id: data.key_id,
        order_id: data.order_id,
        enrollment_id: data.enrollment_id,
        amount: data.amount,
        name,
        email,
        phone,
        package_title: selectedPackage.title
      });

    } catch (err) {
      console.error('Checkout error:', err);
      showError(err.message || 'Payment initialization failed. Please check your connection or contact WhatsApp support.');
    } finally {
      payBtn.disabled = false;
      payBtn.classList.remove('opacity-80', 'cursor-not-allowed');
      payBtnText.textContent = originalText;
    }
  });

  function showError(msg) {
    if (errorBanner && errorText) {
      errorText.textContent = msg;
      errorBanner.classList.remove('hidden');
      errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert(msg);
    }
  }

  function hideError() {
    if (errorBanner) errorBanner.classList.add('hidden');
  }
}

/**
 * Launches official Razorpay modal
 */
function launchRazorpayModal(config) {
  if (typeof Razorpay === 'undefined') {
    alert('Payment gateway is loading. Please check your internet connection and try again.');
    return;
  }

  const options = {
    key: config.key_id,
    amount: config.amount,
    currency: 'INR',
    name: 'Bright Future Academy',
    description: config.package_title,
    order_id: config.order_id,
    prefill: {
      name: config.name,
      email: config.email,
      contact: config.phone
    },
    theme: {
      color: '#20B486'
    },
    modal: {
      ondismiss: function() {
        console.log('Razorpay modal dismissed by user');
      }
    },
    handler: async function(response) {
      // Payment successful on client — verify signature on server
      await verifyPaymentSignature(response, config);
    }
  };

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
      const reason = response.error?.description || 'Payment could not be processed.';
      sessionStorage.setItem('payment_failure_reason', reason);
      window.location.href = `./failed.html?id=${config.enrollment_id}&reason=${encodeURIComponent(reason)}`;
    });
    rzp.open();
  } catch (err) {
    console.error('Razorpay modal launch error:', err);
    alert('Failed to launch payment gateway. Please retry or contact support.');
  }
}

/**
 * Server-side signature verification
 */
async function verifyPaymentSignature(paymentResponse, config) {
  // Show verifying state
  const payBtnText = document.getElementById('pay-button-text');
  if (payBtnText) {
    payBtnText.innerHTML = `<span class="inline-flex items-center gap-2"><span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Verifying Payment & Provisioning Drive...</span>`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        enrollment_id: config.enrollment_id
      })
    });

    const data = await res.json();

    if (data.status === 'paid' || data.success) {
      // Success! Redirect to Success Page
      window.location.href = `./success.html?id=${config.enrollment_id}&pay_id=${paymentResponse.razorpay_payment_id}&email=${encodeURIComponent(config.email)}&pkg=${encodeURIComponent(config.package_title)}`;
    } else {
      // Pending or webhook fallback
      window.location.href = `./status.html?id=${config.enrollment_id}&email=${encodeURIComponent(config.email)}`;
    }
  } catch (err) {
    console.error('Verification error:', err);
    // If client verification times out, webhook will process it. Forward to status.html
    window.location.href = `./status.html?id=${config.enrollment_id}&email=${encodeURIComponent(config.email)}`;
  }
}
