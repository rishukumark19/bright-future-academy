/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './*.html',
    './src/**/*.{js,html}',
  ],
  theme: {
    extend: {
      colors: {
        // === OBSIDIAN ARCHITECTURAL EDITORIAL PALETTE ===
        // Exact token values from the Stitch design system
        'surface':                   '#0f131c',
        'surface-dim':               '#0f131c',
        'surface-bright':            '#353942',
        'surface-variant':           '#31353e',
        'surface-container-lowest':  '#0a0e16',
        'surface-container-low':     '#181c24',
        'surface-container':         '#1c2028',
        'surface-container-high':    '#262a33',
        'surface-container-highest': '#31353e',
        'surface-tint':              '#00e388',

        'background':                '#0f131c',
        'on-background':             '#dfe2ee',

        'on-surface':                '#dfe2ee',
        'on-surface-variant':        '#bacbbc',
        'inverse-surface':           '#dfe2ee',
        'inverse-on-surface':        '#2c3039',

        // PRIMARY — Electric Emerald CTA
        'primary':                   '#b4ffcb',
        'on-primary':                '#00391e',
        'primary-container':         '#00f090',
        'on-primary-container':      '#00683b',
        'inverse-primary':           '#006d3e',
        'primary-fixed':             '#58ffa5',
        'primary-fixed-dim':         '#00e388',
        'on-primary-fixed':          '#00210f',
        'on-primary-fixed-variant':  '#00522e',

        // SECONDARY — Deep Forest Mint
        'secondary':                 '#4edea3',
        'on-secondary':              '#003824',
        'secondary-container':       '#00a572',
        'on-secondary-container':    '#00311f',
        'secondary-fixed':           '#6ffbbe',
        'secondary-fixed-dim':       '#4edea3',
        'on-secondary-fixed':        '#002113',
        'on-secondary-fixed-variant':'#005236',

        // TERTIARY — Laser Sky Blue (technical metadata)
        'tertiary':                  '#def1ff',
        'on-tertiary':               '#00354a',
        'tertiary-container':        '#9cdaff',
        'on-tertiary-container':     '#006184',
        'tertiary-fixed':            '#c4e7ff',
        'tertiary-fixed-dim':        '#7bd0ff',
        'on-tertiary-fixed':         '#001e2c',
        'on-tertiary-fixed-variant': '#004c69',

        // OUTLINE
        'outline':                   '#849587',
        'outline-variant':           '#3b4a3f',

        // ERROR
        'error':                     '#ffb4ab',
        'on-error':                  '#690005',
        'error-container':           '#93000a',
        'on-error-container':        '#ffdad6',
      },

      borderRadius: {
        DEFAULT: '0.125rem',  // 2px — surgical precision
        lg:      '0.25rem',   // 4px
        xl:      '0.5rem',    // 8px
        full:    '0.75rem',   // 12px
      },

      spacing: {
        'space-xs':  '0.25rem',
        'space-sm':  '0.5rem',
        'space-md':  '1rem',
        'space-lg':  '1.5rem',
        'space-xl':  '2.5rem',
        'margin':    '1rem',
        'margin-md': '1.5rem',
        'margin-lg': '2.5rem',
        'gutter':    '1rem',
        'gutter-lg': '1.5rem',
      },

      fontFamily: {
        'headline-xl':        ['Space Grotesk', 'sans-serif'],
        'headline-xl-mobile': ['Space Grotesk', 'sans-serif'],
        'headline-lg':        ['Space Grotesk', 'sans-serif'],
        'headline-lg-mobile': ['Space Grotesk', 'sans-serif'],
        'headline-md':        ['Space Grotesk', 'sans-serif'],
        'body-lg':            ['Inter', 'sans-serif'],
        'body-md':            ['Inter', 'sans-serif'],
        'body-sm':            ['Inter', 'sans-serif'],
        'label-md':           ['JetBrains Mono', 'monospace'],
        'label-sm':           ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'headline-xl':        ['56px', { lineHeight: '60px', letterSpacing: '-0.04em', fontWeight: '700' }],
        'headline-xl-mobile': ['36px', { lineHeight: '40px', letterSpacing: '-0.03em', fontWeight: '700' }],
        'headline-lg':        ['40px', { lineHeight: '44px', letterSpacing: '-0.03em', fontWeight: '600' }],
        'headline-lg-mobile': ['28px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md':        ['24px', { lineHeight: '28px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'body-lg':            ['18px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-md':            ['15px', { lineHeight: '24px', letterSpacing: '0em',     fontWeight: '400' }],
        'body-sm':            ['13px', { lineHeight: '20px', letterSpacing: '0em',     fontWeight: '400' }],
        'label-md':           ['13px', { lineHeight: '16px', letterSpacing: '0.06em',  fontWeight: '500' }],
        'label-sm':           ['11px', { lineHeight: '14px', letterSpacing: '0.08em',  fontWeight: '500' }],
      },

      maxWidth: {
        'container': '1120px',
      },

      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow':   'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in':     'fadeIn 0.4s ease-out forwards',
        'slide-up':    'slideUp 0.5s ease-out forwards',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'marquee':     'marquee 30s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px -4px rgba(0, 240, 144, 0.3)' },
          '50%':      { boxShadow: '0 0 40px -4px rgba(0, 240, 144, 0.6)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      boxShadow: {
        'cta':       '0 0 24px -4px rgba(0, 240, 144, 0.35)',
        'cta-hover': '0 0 40px -4px rgba(0, 240, 144, 0.55)',
        'card':      '0 4px 24px rgba(0,0,0,0.4)',
      },

      backdropBlur: {
        'xs': '4px',
      },
    },
  },
  plugins: [],
};
