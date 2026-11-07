/**
 * BRIGHT FUTURE ACADEMY — CORE APP CONTROLLER
 * Manages category filters, course search, FAQ accordion, modals,
 * custom notes requests, toast feedback, Three.js 3D background,
 * GSAP timeline entrances, and Emil Kowalski micro-interactions.
 */
import { EDULE_COURSES as BFA_COURSES } from './courses-data.js';
import { initHeroScene } from './hero-scene.js';
import { initAnimations } from './animations.js';
import { initLottieEffects } from './lottie-effects.js';

document.addEventListener('DOMContentLoaded', () => {
  // Visual & Motion Elevators
  initHeroScene();
  initAnimations();
  initLottieEffects();

  // App Features & Interactivity
  initStickyNav();
  initCategoryFilters();
  initSearch();
  initMobileMenu();
  initFaqAccordion();
  initModals();
  initCustomNotesForm();
  initNewsletter();
  initQuickFilters();
});

let currentCategory = 'all';
let currentSearchTerm = '';

// ── 0. STICKY NAV LOCK ON SCROLL ──────────────────────────────────────────
function initStickyNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  function handleScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('shadow-md', 'border-b-[#CBD5E1]');
      nav.classList.remove('shadow-xs');
    } else {
      nav.classList.remove('shadow-md', 'border-b-[#CBD5E1]');
      nav.classList.add('shadow-xs');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ── 1. CATEGORY FILTERS & CAROUSEL CONTROLS ─────────────────────────────
function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('[data-filter-category]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedCat = btn.getAttribute('data-filter-category');
      currentCategory = selectedCat;

      // Update button styling (Emil Kowalski tactile pill toggle)
      filterButtons.forEach(b => {
        if (b.getAttribute('data-filter-category') === selectedCat) {
          b.className = 'filter-btn whitespace-nowrap flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#20B486] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95';
        } else {
          b.className = 'filter-btn whitespace-nowrap flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white hover:bg-[#E8F7F0] border border-[#CBD5E1] text-[#475569] font-medium text-xs sm:text-sm transition-all';
        }
      });

      applyFilters();
    });
  });

  // Tablet & Desktop chevron scroll controls
  const pillsContainer = document.getElementById('category-pills-container');
  const prevBtn = document.getElementById('category-scroll-prev');
  const nextBtn = document.getElementById('category-scroll-next');

  if (pillsContainer && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      pillsContainer.scrollBy({ left: -220, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      pillsContainer.scrollBy({ left: 220, behavior: 'smooth' });
    });
  }
}

// ── 2. SEARCH INPUT ───────────────────────────────────────────────────────
function initSearch() {
  const searchInput = document.getElementById('course-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  const searchForm = document.getElementById('course-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });
  }
}

function applyFilters() {
  const courseCards = document.querySelectorAll('[data-course-card]');
  let visibleCount = 0;

  courseCards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
    const cardInstructor = (card.getAttribute('data-instructor') || '').toLowerCase();

    const matchesCategory = currentCategory === 'all' || cardCat === currentCategory;
    const matchesSearch = !currentSearchTerm || 
      cardTitle.includes(currentSearchTerm) || 
      cardInstructor.includes(currentSearchTerm);

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const emptyMsg = document.getElementById('no-courses-found');
  if (emptyMsg) {
    emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

// ── 3. QUICK CLASS JUMP LINKS ─────────────────────────────────────────────
function initQuickFilters() {
  const quickFilterBtns = document.querySelectorAll('[data-quick-filter]');
  quickFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetCat = btn.getAttribute('data-quick-filter');
      const categoryBtn = document.querySelector(`[data-filter-category="${targetCat}"]`);
      if (categoryBtn) {
        categoryBtn.click();
      }
      const notesSection = document.getElementById('notes');
      if (notesSection) {
        notesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ── 4. MOBILE NAVIGATION DRAWER ───────────────────────────────────────────
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    backdrop?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    backdrop?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ── 5. FAQ ACCORDION (EMIL KOWALSKI FLUID ACCORDION) ──────────────────────
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all other items for a clean accordion experience
      faqItems.forEach(otherItem => {
        const otherContent = otherItem.querySelector('.faq-content');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherContent && otherContent !== content) {
          otherContent.classList.add('hidden');
          otherItem.classList.remove('border-[#20B486]', 'shadow-sm');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isOpen) {
        content.classList.add('hidden');
        item.classList.remove('border-[#20B486]', 'shadow-sm');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        content.classList.remove('hidden');
        item.classList.add('border-[#20B486]', 'shadow-sm');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// ── 6. INTERACTIVE MODALS & TOAST NOTIFICATIONS ───────────────────────────
function initModals() {
  // Sample Modal elements
  const sampleModal = document.getElementById('sample-preview-modal');
  const closeSampleBtn = document.getElementById('close-sample-modal');
  const sampleForm = document.getElementById('sample-download-form');
  const sampleClassSelect = document.getElementById('sample-class-select');
  const sampleHighlight = document.getElementById('sample-modal-highlight');

  // Triggers for Sample Modal
  const sampleTriggers = [
    document.getElementById('nav-sample-btn'),
    document.getElementById('mobile-sample-btn'),
    document.getElementById('hero-sample-btn'),
    document.getElementById('cta-sample-btn')
  ];

  function openSampleModal(classPref) {
    if (!sampleModal) return;
    if (classPref && sampleClassSelect) {
      sampleClassSelect.value = classPref;
      if (sampleHighlight) {
        sampleHighlight.textContent = `Sample Includes: ${classPref} Chapter 1 & Formula Summary`;
      }
    }
    sampleModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeSampleModal() {
    if (!sampleModal) return;
    sampleModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  sampleTriggers.forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openSampleModal('Class 10th');
    });
  });

  closeSampleBtn?.addEventListener('click', closeSampleModal);
  sampleModal?.addEventListener('click', (e) => {
    if (e.target === sampleModal) closeSampleModal();
  });

  // Preview buttons on individual cards
  document.querySelectorAll('[data-preview-course]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseId = btn.getAttribute('data-preview-course');
      const course = BFA_COURSES.find(c => c.id === courseId);
      openSampleModal(course ? course.category : 'Class 10th');
    });
  });

  if (sampleForm) {
    sampleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const contact = document.getElementById('sample-recipient')?.value;
      const selectedClass = sampleClassSelect?.value;
      closeSampleModal();
      showToast(`🎉 Success! Free ${selectedClass} Sample Notes sent to ${contact}. Download link is active!`);
      sampleForm.reset();
    });
  }

  // Buy Notes Modal elements
  const buyModal = document.getElementById('buy-notes-modal');
  const closeBuyBtn = document.getElementById('close-buy-modal');
  const buyForm = document.getElementById('buy-notes-form');
  const buyTitle = document.getElementById('buy-modal-title');
  const buyPkg = document.getElementById('buy-modal-pkg');
  const buyOrig = document.getElementById('buy-modal-orig');
  const buyPrice = document.getElementById('buy-modal-price');

  let activeBuyCourse = null;

  function openBuyModal(course) {
    if (!buyModal || !course) return;
    activeBuyCourse = course;
    if (buyTitle) buyTitle.textContent = `Get ${course.category} Study Notes`;
    if (buyPkg) buyPkg.textContent = course.title;
    if (buyOrig) buyOrig.textContent = course.originalPrice ? `₹${course.originalPrice}` : '₹550';
    if (buyPrice) buyPrice.textContent = course.price.startsWith('₹') ? course.price : `₹${course.price}`;

    buyModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeBuyModal() {
    if (!buyModal) return;
    buyModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeBuyBtn?.addEventListener('click', closeBuyModal);
  buyModal?.addEventListener('click', (e) => {
    if (e.target === buyModal) closeBuyModal();
  });

  document.querySelectorAll('[data-buy-course]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseId = btn.getAttribute('data-buy-course');
      const course = BFA_COURSES.find(c => c.id === courseId);
      if (course) {
        openBuyModal(course);
      }
    });
  });

  if (buyForm) {
    buyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const studentName = document.getElementById('buy-name')?.value || '';
      const email = document.getElementById('buy-email')?.value || '';
      const phone = document.getElementById('buy-phone')?.value || '';
      const courseId = activeBuyCourse?.id || 'class-10-science-notes';
      closeBuyModal();
      window.location.href = `./checkout.html?package=${courseId}&name=${encodeURIComponent(studentName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
    });
  }
}

// ── 7. CUSTOM NOTES REQUEST FORM ──────────────────────────────────────────
function initCustomNotesForm() {
  const customForm = document.getElementById('custom-notes-request-form');
  if (!customForm) return;

  customForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const reqClass = document.getElementById('request-class')?.value;
    const reqSubject = document.getElementById('request-subject')?.value;
    const reqChapter = document.getElementById('request-chapter')?.value;
    const reqContact = document.getElementById('request-contact')?.value;

    showToast(`📚 Request received for ${reqClass} ${reqSubject} ("${reqChapter}"). Our academic team will contact ${reqContact} within 4 hours!`);
    customForm.reset();
  });
}

// ── 8. NEWSLETTER SUBSCRIPTION ────────────────────────────────────────────
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`✨ Subscribed! Free revision formula tips will be emailed to ${input.value}.`);
        input.value = '';
      }
    });
  }
}

// ── 9. TOAST NOTIFICATION HELPER ──────────────────────────────────────────
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-[#17252A] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#20B486]/40 flex items-center gap-3 text-xs sm:text-sm font-medium transform translate-y-4 opacity-0 transition-all duration-300 max-w-md';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[#20B486] text-[20px] shrink-0">check_circle</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger smooth enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Auto dismiss after 4.5 seconds
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}
