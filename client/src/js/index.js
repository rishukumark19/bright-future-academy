/**
 * LANDING PAGE — Main JS
 * Populates all dynamic content from config.js
 */
import { COURSE } from './config.js';

// ── POPULATE ON DOM READY ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateBranding();
  populateHero();
  populateVaultPreview();
  populateMarquee();
  populateWhoItsFor();
  populateInclusions();
  populateDriveFileTree();
  populateCurriculum();
  populateSteps();
  populatePricing();
  populateFaq();
  setupWhatsAppLinks();
  setupNavShrink();
  setupAccordions();
});

// ── BRANDING ──────────────────────────────────────────────────────────────
function populateBranding() {
  document.querySelectorAll('#nav-brand, #footer-brand').forEach(el => {
    el.textContent = COURSE.brand;
  });
  document.title = `${COURSE.name} — ${COURSE.brand}`;
  document.querySelector('meta[name="description"]')
    ?.setAttribute('content', `${COURSE.name} — ${COURSE.subtitle}. Master ${COURSE.topic} and start earning. Instant Google Drive access.`);
}

// ── HERO ──────────────────────────────────────────────────────────────────
function populateHero() {
  // Headline
  document.getElementById('hero-highlight').textContent = COURSE.heroHeadlineHighlight;
  document.getElementById('hero-suffix').textContent = COURSE.heroHeadlineSuffix;

  // Price
  document.getElementById('hero-price').textContent = COURSE.price.display;
  document.getElementById('mobile-cta-price').textContent = `· ${COURSE.price.display}`;

  if (COURSE.price.hasDiscount && COURSE.price.displayOriginal) {
    const orig = document.getElementById('hero-price-original');
    orig.textContent = COURSE.price.displayOriginal;
    orig.style.display = '';
    const badge = document.getElementById('hero-discount-badge');
    badge.textContent = `${COURSE.price.discountPercent} Off`;
    badge.classList.remove('hidden');
  }

  // Instructor card
  document.getElementById('instructor-name').textContent = COURSE.instructor;
  document.getElementById('instructor-sub').textContent = `Expert in ${COURSE.topic}`;

  // Stat
  const totalLessons = COURSE.modules.reduce((s, m) => s + m.lessons, 0);
  document.getElementById('stat-lessons').textContent = `${totalLessons}+ HD Lessons`;

  // Social proof
  if (!COURSE.socialProof.useFounding && COURSE.socialProof.studentCount) {
    document.getElementById('social-proof-row').innerHTML = `
      <div class="flex items-center gap-space-xs">
        <span class="text-yellow-400 font-bold">★★★★★</span>
        <span class="font-body-sm text-body-sm text-on-surface">${COURSE.socialProof.rating}/5</span>
        <span class="text-on-surface-variant font-body-sm text-body-sm">from ${COURSE.socialProof.ratingCount?.toLocaleString()}+ students</span>
      </div>
    `;
  }

  // Vault folder name
  document.getElementById('vault-folder-name').textContent = COURSE.vault.folderName;
}

// ── VAULT PREVIEW (hero card) ─────────────────────────────────────────────
function populateVaultPreview() {
  const list = document.getElementById('vault-file-list');
  if (!list) return;
  list.innerHTML = COURSE.vault.files.slice(0, 4).map(f => `
    <div class="drive-file text-[12px]">
      <span class="text-[16px]">${f.icon}</span>
      <span class="truncate">${f.name}</span>
    </div>
  `).join('');
}

// ── MARQUEE ───────────────────────────────────────────────────────────────
function populateMarquee() {
  const items = [
    '⚡ Instant Drive Access',
    '📁 Lifetime Vault Included',
    '🎓 Self-Paced Learning',
    '🔒 Secured by Razorpay',
    '📱 Mobile-First Design',
    '🔄 Future Updates Free',
    '✅ Gmail-Based Delivery',
    '💬 WhatsApp Support',
  ];
  const inner = document.getElementById('marquee-inner');
  // Duplicate for seamless loop
  const allItems = [...items, ...items];
  inner.innerHTML = allItems.map(item => `
    <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">${item}</span>
  `).join('');
}

// ── WHO IT'S FOR ──────────────────────────────────────────────────────────
function populateWhoItsFor() {
  const forList = document.getElementById('for-you-list');
  const notList = document.getElementById('not-for-you-list');

  forList.innerHTML = COURSE.forYou.map(item => `
    <li class="check-item">
      <span class="material-symbols-outlined text-primary-container text-[16px] shrink-0 mt-0.5">check</span>
      <span class="font-body-sm text-body-sm">${item}</span>
    </li>
  `).join('');

  notList.innerHTML = COURSE.notForYou.map(item => `
    <li class="check-item">
      <span class="material-symbols-outlined text-error text-[16px] shrink-0 mt-0.5">close</span>
      <span class="font-body-sm text-body-sm">${item}</span>
    </li>
  `).join('');
}

// ── INCLUSIONS ────────────────────────────────────────────────────────────
function populateInclusions() {
  const list = document.getElementById('inclusions-list');
  list.innerHTML = COURSE.inclusions.map(inc => `
    <div class="flex items-start gap-space-sm">
      <span class="material-symbols-outlined text-primary-container text-[20px] shrink-0 mt-0.5">${inc.icon}</span>
      <div>
        <p class="font-body-md text-body-md text-on-surface font-medium">${inc.label}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${inc.desc}</p>
      </div>
    </div>
  `).join('');
}

// ── DRIVE FILE TREE ───────────────────────────────────────────────────────
function populateDriveFileTree() {
  const tree = document.getElementById('drive-file-tree');
  const name = document.getElementById('drive-folder-name');
  if (name) name.textContent = COURSE.vault.folderName;
  if (!tree) return;
  tree.innerHTML = COURSE.vault.files.map((f, i) => `
    <div class="drive-file" style="animation-delay: ${i * 60}ms">
      <span class="text-[18px]">${f.icon}</span>
      <span class="text-[13px] truncate">${f.name}</span>
      <span class="ml-auto badge text-[9px]">Viewer</span>
    </div>
  `).join('');
}

// ── CURRICULUM ────────────────────────────────────────────────────────────
function populateCurriculum() {
  const container = document.getElementById('curriculum-accordion');
  container.innerHTML = COURSE.modules.map((mod, i) => `
    <div class="accordion-item">
      <button class="accordion-trigger" onclick="toggleAccordion('mod-${i}', this)">
        <div class="flex items-center gap-space-md">
          <span class="font-label-md text-label-md text-primary-container">${mod.index}</span>
          <div class="flex flex-col items-start">
            <span class="font-headline-md text-[16px] text-on-surface">${mod.title}</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase mt-0.5">
              ${mod.lessons} Lessons · ${mod.duration}
              ${mod.badge ? `<span class="ml-2 badge-primary text-[9px] py-0 px-1">${mod.badge}</span>` : ''}
            </span>
          </div>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 transition-transform duration-200" id="chevron-mod-${i}">expand_more</span>
      </button>
      <div class="accordion-content" id="mod-${i}">
        <div class="px-space-lg pb-space-lg flex flex-col gap-2">
          ${mod.topics.map(t => `
            <div class="flex items-center gap-space-sm">
              <span class="material-symbols-outlined text-secondary text-[16px]">play_circle</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant">${t}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// ── STEPS ─────────────────────────────────────────────────────────────────
function populateSteps() {
  const grid = document.getElementById('steps-grid');
  grid.innerHTML = COURSE.steps.map((step, i) => `
    <div class="card flex flex-col gap-space-md relative">
      ${i < COURSE.steps.length - 1 ? `
        <div class="hidden md:block absolute top-10 -right-[calc(theme(spacing.space-lg)/2+1px)] w-[calc(theme(spacing.space-lg)+2px)] h-0.5 bg-primary-container/20 translate-x-full z-10"></div>
      ` : ''}
      <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
        <span class="material-symbols-outlined text-primary-container text-[24px]">${step.icon}</span>
      </div>
      <div class="flex items-center gap-space-sm">
        <span class="font-label-md text-label-md text-primary-container">${step.num}</span>
        <h3 class="font-headline-md text-[16px] text-on-surface">${step.title}</h3>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface-variant">${step.desc}</p>
    </div>
  `).join('');
}

// ── PRICING ───────────────────────────────────────────────────────────────
function populatePricing() {
  document.getElementById('pricing-current').textContent = COURSE.price.display;

  if (COURSE.price.hasDiscount && COURSE.price.displayOriginal) {
    const orig = document.getElementById('pricing-original');
    orig.textContent = COURSE.price.displayOriginal;
    orig.classList.remove('hidden');
    const discount = document.getElementById('pricing-discount');
    discount.textContent = `${COURSE.price.discountPercent} Off — Founding Offer`;
    discount.classList.remove('hidden');
  }

  if (COURSE.price.hasEmi) {
    document.getElementById('emi-badge').style.display = '';
  }

  const incList = document.getElementById('pricing-inclusions');
  incList.innerHTML = COURSE.inclusions.map(inc => `
    <div class="check-item">
      <span class="material-symbols-outlined text-primary-container text-[18px] shrink-0 mt-0.5">check_circle</span>
      <span>${inc.label}</span>
    </div>
  `).join('');
}

// ── FAQ ───────────────────────────────────────────────────────────────────
function populateFaq() {
  const container = document.getElementById('faq-accordion');
  container.innerHTML = COURSE.faqs.map((faq, i) => `
    <div class="accordion-item">
      <button class="accordion-trigger" onclick="toggleAccordion('faq-${i}', this)">
        <span class="font-body-md text-body-md text-on-surface text-left">${faq.q}</span>
        <span class="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 transition-transform duration-200" id="chevron-faq-${i}">expand_more</span>
      </button>
      <div class="accordion-content" id="faq-${i}">
        <div class="px-space-lg pb-space-lg">
          <p class="font-body-md text-body-md text-on-surface-variant">${faq.a}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// ── WHATSAPP ──────────────────────────────────────────────────────────────
function setupWhatsAppLinks() {
  const url = COURSE.support.whatsappUrl;
  document.querySelectorAll('#whatsapp-float, #whatsapp-faq, #whatsapp-how-it-works').forEach(el => {
    el.href = url;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  const supportLink = document.getElementById('footer-support-link');
  if (supportLink) supportLink.href = `mailto:${COURSE.support.email}`;
}

// ── NAV SHRINK ON SCROLL ──────────────────────────────────────────────────
function setupNavShrink() {
  const nav = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.top = '0';
    } else {
      nav.style.top = '40px';
    }
  });
}

// ── ACCORDION LOGIC ───────────────────────────────────────────────────────
function setupAccordions() {
  // Nothing extra — individual accordion items are wired inline via onclick
}

// Exported to global scope for inline onclick handlers
window.toggleAccordion = function(id, btn) {
  const content = document.getElementById(id);
  const isOpen = content.classList.contains('open');
  const chevronId = btn.querySelector('[id^="chevron-"]')?.id;
  const chevron = chevronId ? document.getElementById(chevronId) : btn.querySelector('.material-symbols-outlined');

  if (isOpen) {
    content.classList.remove('open');
    if (chevron) chevron.style.transform = '';
  } else {
    // Close all open ones first
    document.querySelectorAll('.accordion-content.open').forEach(el => {
      el.classList.remove('open');
    });
    document.querySelectorAll('.accordion-trigger .material-symbols-outlined').forEach(el => {
      el.style.transform = '';
    });
    content.classList.add('open');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  }
};

window.closePreviewModal = function() {
  document.getElementById('preview-modal').classList.add('hidden');
};
