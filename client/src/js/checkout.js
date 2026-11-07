/**
 * CHECKOUT PAGE — SMART CHECKOUT JS
 * Handles package selection, coupon calculation, order creation, and Razorpay modal launch
 */
import { API_BASE_URL } from './config.js';
import confetti from 'canvas-confetti';

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
let appliedCouponCode = 'TOP10';
let discountPercent = 10; // TOP10 default (10%)
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
  const discountLabelEl = document.getElementById('summary-discount-label');
  const discountEl = document.getElementById('summary-discount');
  const totalEl = document.getElementById('summary-total');
  const payBtnText = document.getElementById('pay-button-text');

  if (titleEl) titleEl.textContent = selectedPackage.title;
  if (metaEl) metaEl.textContent = selectedPackage.meta;
  if (mrpEl) mrpEl.textContent = `₹${mrp}`;
  if (baseEl) baseEl.textContent = `₹${basePrice}`;

  if (discountLabelEl) {
    discountLabelEl.textContent = couponApplied 
      ? `Coupon ${appliedCouponCode} (${discountPercent}% Off):` 
      : 'Coupon Discount:';
  }

  if (discountEl) {
    discountEl.textContent = couponApplied ? `-₹${discountAmount}` : '₹0';
    if (couponApplied) {
      discountEl.className = 'font-bold text-[#20B486]';
    } else {
      discountEl.className = 'font-semibold text-[#94A3B8]';
    }
  }

  if (totalEl) totalEl.textContent = `₹${netPayable}`;

  if (payBtnText) {
    payBtnText.textContent = `Pay ₹${netPayable} & Unlock Google Drive Access`;
  }

  // Update Left Column Coupon UI state
  const inputContainer = document.getElementById('coupon-input-container');
  const appliedContainer = document.getElementById('coupon-applied-container');
  const appliedCodeBadge = document.getElementById('applied-code-badge');
  const appliedDesc = document.getElementById('applied-coupon-description');
  const savingsPill = document.getElementById('coupon-savings-pill');

  if (couponApplied) {
    if (inputContainer) inputContainer.classList.add('hidden');
    if (appliedContainer) appliedContainer.classList.remove('hidden');
    if (appliedCodeBadge) appliedCodeBadge.textContent = appliedCouponCode;
    if (appliedDesc) {
      appliedDesc.textContent = `Extra ${discountPercent}% Discount applied — You save ₹${discountAmount}!`;
    }
    if (savingsPill) {
      savingsPill.textContent = `${discountPercent}% OFF ACTIVE`;
      savingsPill.className = 'text-[11px] font-extrabold text-[#0F5132] bg-[#E8F7F0] px-2.5 py-0.5 rounded-full border border-[#20B486]/30';
    }
  } else {
    if (appliedContainer) appliedContainer.classList.add('hidden');
    if (inputContainer) inputContainer.classList.remove('hidden');
    if (savingsPill) {
      savingsPill.textContent = 'NO COUPON APPLIED';
      savingsPill.className = 'text-[11px] font-bold text-[#64748B] bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200';
    }
  }
}

/**
 * Fires celebratory micro-confetti when a coupon is successfully applied
 */
function triggerCelebrationAnimation() {
  try {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#20B486', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'],
      ticks: 200,
      gravity: 1.1,
      disableForReducedMotion: true
    });
  } catch (err) {
    console.warn('Confetti trigger skipped:', err);
  }
}

/**
 * Coupon input, apply animation & remove handler
 */
function initCouponSystem() {
  const applyBtn = document.getElementById('apply-coupon-btn');
  const couponInput = document.getElementById('coupon-input');
  const removeBtn = document.getElementById('remove-coupon-btn');
  const quickApplyBtn = document.getElementById('quick-apply-top10');
  const messageEl = document.getElementById('coupon-message');
  const appliedContainer = document.getElementById('coupon-applied-container');
  const discountEl = document.getElementById('summary-discount');

  // Helper to show message
  function showMessage(html, type = 'success') {
    if (!messageEl) return;
    messageEl.innerHTML = html;
    messageEl.classList.remove('hidden');
    if (type === 'success') {
      messageEl.className = 'text-xs text-[#20B486] font-bold mt-2 flex items-center gap-1.5 transition-all';
    } else if (type === 'error') {
      messageEl.className = 'text-xs text-red-500 font-bold mt-2 flex items-center gap-1.5 transition-all';
    } else {
      messageEl.className = 'text-xs text-gray-500 font-medium mt-2 flex items-center gap-1.5 transition-all';
    }

    // Auto-clear message after 5 seconds
    setTimeout(() => {
      if (messageEl) messageEl.classList.add('hidden');
    }, 5000);
  }

  // Core function to validate and apply code
  function applyCode(rawCode, isUserAction = false) {
    const code = rawCode.trim().toUpperCase();

    // Valid discount coupon codes
    if (code === 'TOP10' || code === 'BRIGHT10' || code === 'EARLY10' || code === 'STUDY10') {
      discountPercent = 10;
      appliedCouponCode = code;
      couponApplied = true;

      // Update UI
      updateSummaryUI();

      // Trigger celebratory animations on user action
      if (isUserAction) {
        triggerCelebrationAnimation();

        // Add pop card animation class
        if (appliedContainer) {
          appliedContainer.classList.remove('coupon-pop-card');
          void appliedContainer.offsetWidth; // trigger reflow
          appliedContainer.classList.add('coupon-pop-card');
        }

        // Add discount glow animation
        if (discountEl) {
          discountEl.classList.remove('discount-highlight-pulse');
          void discountEl.offsetWidth;
          discountEl.classList.add('discount-highlight-pulse');
        }

        showMessage(`<span class="material-symbols-outlined text-[16px]">celebration</span><span>🎉 Code ${code} applied! Extra 10% discount added.</span>`, 'success');
      }

      if (couponInput) couponInput.value = '';

    } else if (code === 'TOP20' || code === 'SUPER20') {
      discountPercent = 20;
      appliedCouponCode = code;
      couponApplied = true;

      updateSummaryUI();

      if (isUserAction) {
        triggerCelebrationAnimation();
        showMessage(`<span class="material-symbols-outlined text-[16px]">celebration</span><span>🚀 Mega Code ${code} applied! Extra 20% discount added.</span>`, 'success');
      }

      if (couponInput) couponInput.value = '';

    } else if (code === '') {
      if (couponInput) {
        couponInput.classList.add('coupon-shake');
        setTimeout(() => couponInput.classList.remove('coupon-shake'), 450);
        couponInput.focus();
      }
      showMessage(`<span class="material-symbols-outlined text-[15px]">info</span><span>Please enter a coupon code (e.g. TOP10)</span>`, 'error');

    } else {
      // Invalid code entered
      if (couponInput) {
        couponInput.classList.add('coupon-shake');
        setTimeout(() => couponInput.classList.remove('coupon-shake'), 450);
        couponInput.focus();
      }
      showMessage(`<span class="material-symbols-outlined text-[15px]">error</span><span>Invalid coupon code "${code}". Try code <strong>TOP10</strong> for 10% off!</span>`, 'error');
    }
  }

  // Remove coupon handler
  function removeCode() {
    couponApplied = false;
    const previousCode = appliedCouponCode;
    appliedCouponCode = '';
    discountPercent = 0;

    updateSummaryUI();

    showMessage(`<span class="material-symbols-outlined text-[15px]">check</span><span>Coupon ${previousCode} removed. Total price reverted.</span>`, 'info');

    if (couponInput) {
      couponInput.focus();
    }
  }

  // Bind Click Event on Apply Button
  if (applyBtn && couponInput) {
    applyBtn.addEventListener('click', () => {
      applyCode(couponInput.value, true);
    });

    couponInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCode(couponInput.value, true);
      }
    });
  }

  // Bind Quick Apply Suggestion Button
  if (quickApplyBtn) {
    quickApplyBtn.addEventListener('click', () => {
      applyCode('TOP10', true);
    });
  }

  // Bind Remove Coupon Button
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      removeCode();
    });
  }
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
        coupon_code: couponApplied ? appliedCouponCode : null
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
