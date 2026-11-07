/**
 * GSAP + EMIL KOWALSKI CRAFT MICRO-ANIMATIONS
 * Elevates the website with fluid spring physics, 3D card tilts,
 * magnetic buttons, and scroll-triggered entrances.
 */
import gsap from 'gsap';

export function initAnimations() {
  initHeroEntrance();
  initCard3DTilt();
  initMagneticButtons();
  initScrollReveals();
}

// ── 1. GSAP HERO ENTRANCE SEQUENCE ─────────────────────────────────────────
function initHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Mobile dedicated hero entrance (smooth spring)
  if (document.getElementById('hero-mobile-container')) {
    gsap.fromTo(
      '#hero-mobile-container',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.05 }
    );
  }

  // Hero badge pop
  tl.fromTo(
    '#hero-badge',
    { opacity: 0, scale: 0.85, y: -15 },
    { opacity: 1, scale: 1, y: 0, duration: 0.7, delay: 0.1 }
  );

  // Hero headline words stagger
  tl.fromTo(
    '#hero-title',
    { opacity: 0, y: 25, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
    '-=0.4'
  );

  // Hero subtitle
  tl.fromTo(
    '#hero-subtitle',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.7 },
    '-=0.5'
  );

  // Hero CTA buttons spring
  tl.fromTo(
    '#hero-cta-cluster > *',
    { opacity: 0, y: 20, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' },
    '-=0.4'
  );

  // Floating student photo
  tl.fromTo(
    '#hero-image-wrapper',
    { opacity: 0, scale: 0.92, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power2.out' },
    '-=0.8'
  );

  // Floating Badges spring in
  tl.fromTo(
    '.hero-floating-badge',
    { opacity: 0, scale: 0.7, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)' },
    '-=0.6'
  );

  // Continuous organic subtle floating sine-wave (compact on mobile)
  const isMobile = window.innerWidth < 640;
  const floatDistance = isMobile ? 6 : 12;

  gsap.to('.hero-floating-badge-left', {
    y: `-=${floatDistance}`,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.hero-floating-badge-right', {
    y: `-=${isMobile ? 5 : 10}`,
    duration: 2.8,
    delay: 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

// ── 2. EMIL KOWALSKI 3D CARD TILT ON HOVER ─────────────────────────────────
function initCard3DTilt() {
  const cards = document.querySelectorAll('[data-course-card]');
  if (!cards.length) return;

  cards.forEach(card => {
    // Only enable tilt on devices with hover capability
    if (window.matchMedia('(hover: hover)').matches) {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease, border-color 0.3s ease';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;  // Max 6 deg

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
      });
    }
  });
}

// ── 3. EMIL KOWALSKI MAGNETIC BUTTON EFFECT ────────────────────────────────
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.magnetic-btn');
  if (!magneticElements.length) return;

  if (window.matchMedia('(hover: hover)').matches) {
    magneticElements.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.28,
          y: y * 0.28,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1.1, 0.4)',
        });
      });
    });
  }
}

// ── 5. SCROLL-TRIGGERED REVEALS (Intersection Observer + GSAP) ──────────────
function initScrollReveals() {
  const elements = document.querySelectorAll('[data-course-card], .faq-item, #classes .grid > div, #why-us .grid > div, #reviews .grid > div');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            entry.target,
            { opacity: 0, y: 30, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: 'power3.out',
            }
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}

