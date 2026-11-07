/**
 * LOTTIEFILES MOTION DESIGN
 * Adds lightweight vector micro-animations to enhance interactive tactile feel
 */
import lottie from 'lottie-web/build/player/lottie_light.js';

export function initLottieEffects() {
  initHeroBadgeLottie();
  initBookmarkLottie();
}

/**
 * Animated dynamic sparkle / achievement badge
 */
function initHeroBadgeLottie() {
  const container = document.getElementById('lottie-sparkle-container');
  if (!container) return;

  // Embedded clean geometric sparkle animation JSON
  const sparkleAnimationData = {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 60,
    h: 60,
    nm: "Sparkle",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Star",
        sr: 1,
        ks: {
          o: { k: [{ t: 0, s: [0] }, { t: 15, s: [100] }, { t: 45, s: [100] }, { t: 60, s: [0] }] },
          r: { k: [{ t: 0, s: [0] }, { t: 60, s: [90] }] },
          p: { k: [30, 30, 0] },
          a: { k: [0, 0, 0] },
          s: { k: [{ t: 0, s: [0, 0] }, { t: 20, s: [100, 100] }, { t: 50, s: [100, 100] }, { t: 60, s: [0, 0] }] }
        },
        shapes: [
          {
            ty: "rc",
            d: 1,
            s: { k: [14, 14] },
            p: { k: [0, 0] },
            r: { k: 2 }
          },
          {
            ty: "fl",
            c: { k: [0.125, 0.705, 0.525, 1] } // #20B486 Emerald
          }
        ]
      }
    ]
  };

  try {
    lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: sparkleAnimationData
    });
  } catch (e) {
    console.debug('Lottie initialization note:', e);
  }
}

/**
 * Trigger micro-celebration on notes interaction
 */
function initBookmarkLottie() {
  const requestBtn = document.getElementById('drop-info-btn');
  if (!requestBtn) return;

  requestBtn.addEventListener('mouseenter', () => {
    // Subtle scale feedback
    requestBtn.style.boxShadow = '0 12px 32px -4px rgba(32, 180, 134, 0.45)';
  });
}
