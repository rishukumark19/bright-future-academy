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
        // === VIBRANT EDTECH / EDULE PALETTE ===
        'surface-container-lowest':  '#ffffff',
        'surface-container-low':     '#f0f3ff',
        'surface-container':         '#e7eeff',
        'surface-container-high':    '#dee8ff',
        'surface-container-highest': '#d8e3fb',
        'surface':                   '#f9f9ff',
        'surface-bright':            '#f9f9ff',
        'surface-dim':               '#cfdaf2',
        'surface-variant':           '#d8e3fb',
        'surface-tint':              '#006c4e',

        'background':                '#f9f9ff',
        'on-background':             '#111c2d',

        'on-surface':                '#111c2d',
        'on-surface-variant':        '#3d4a43',
        'inverse-surface':           '#263143',
        'inverse-on-surface':        '#ecf1ff',

        // PRIMARY — Emerald Green (#20B486)
        'primary':                   '#20b486',
        'primary-dark':              '#006c4e',
        'on-primary':                '#ffffff',
        'primary-container':         '#20b486',
        'on-primary-container':      '#003f2c',
        'inverse-primary':           '#58ddac',
        'primary-fixed':             '#77fac7',
        'primary-fixed-dim':         '#58ddac',
        'on-primary-fixed':          '#002115',
        'on-primary-fixed-variant':  '#00513a',

        // SECONDARY — Forest Deep Mint
        'secondary':                 '#2d6a48',
        'on-secondary':              '#ffffff',
        'secondary-container':       '#b0f1c7',
        'on-secondary-container':    '#33704e',
        'secondary-fixed':           '#b0f1c7',
        'secondary-fixed-dim':       '#95d4ac',
        'on-secondary-fixed':        '#002111',
        'on-secondary-fixed-variant':'#0f5132',

        // TERTIARY — Gold / Amber (#FFB800)
        'tertiary':                  '#7c5800',
        'on-tertiary':               '#ffffff',
        'tertiary-container':        '#cf9500',
        'on-tertiary-container':     '#493200',
        'tertiary-fixed':            '#ffdea8',
        'tertiary-fixed-dim':        '#ffba20',
        'on-tertiary-fixed':         '#271900',
        'on-tertiary-fixed-variant': '#5e4200',

        // OUTLINE & BORDERS
        'outline':                   '#6d7a72',
        'outline-variant':           '#bccac1',

        // ERROR
        'error':                     '#ba1a1a',
        'on-error':                  '#ffffff',
        'error-container':           '#ffdad6',
        'on-error-container':        '#93000a',
      },

      borderRadius: {
        DEFAULT: '0.25rem',
        lg:      '0.5rem',
        xl:      '0.75rem',
        '2xl':   '1rem',
        '3xl':   '1.5rem',
        full:    '9999px',
      },

      spacing: {
        'space-xs':  '0.25rem',
        'space-sm':  '0.5rem',
        'space-md':  '1rem',
        'space-lg':  '1.5rem',
        'space-xl':  '2.5rem',
        'margin':    '2rem',
        'margin-mobile': '1rem',
        'gutter':    '1.5rem',
        'gutter-mobile': '1rem',
      },

      fontFamily: {
        sans:                 ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        'display-hero':        ['Plus Jakarta Sans', 'sans-serif'],
        'display-hero-mobile': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-xl':        ['Plus Jakarta Sans', 'sans-serif'],
        'headline-xl-mobile': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-lg':        ['Plus Jakarta Sans', 'sans-serif'],
        'headline-md':        ['Plus Jakarta Sans', 'sans-serif'],
        'headline-sm':        ['Plus Jakarta Sans', 'sans-serif'],
        'body-lg':            ['Plus Jakarta Sans', 'sans-serif'],
        'body-md':            ['Plus Jakarta Sans', 'sans-serif'],
        'body-sm':            ['Plus Jakarta Sans', 'sans-serif'],
        'label-lg':           ['Plus Jakarta Sans', 'sans-serif'],
        'label-md':           ['Plus Jakarta Sans', 'sans-serif'],
        'label-sm':           ['Plus Jakarta Sans', 'sans-serif'],
      },

      fontSize: {
        'display-hero':        ['56px', { lineHeight: '68px', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-hero-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-xl':        ['40px', { lineHeight: '48px', letterSpacing: '-0.025em', fontWeight: '700' }],
        'headline-xl-mobile': ['28px', { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg':        ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md':        ['24px', { lineHeight: '32px', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-sm':        ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg':            ['18px', { lineHeight: '28px', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body-md':            ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm':            ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-lg':           ['16px', { lineHeight: '22px', fontWeight: '600' }],
        'label-md':           ['14px', { lineHeight: '18px', fontWeight: '600' }],
        'label-sm':           ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '700' }],
      },

      maxWidth: {
        'container': '1280px',
      },

      boxShadow: {
        'cta':       '0 8px 20px -4px rgba(32, 180, 134, 0.35)',
        'cta-hover': '0 12px 28px -4px rgba(32, 180, 134, 0.50)',
        'card':      '0 4px 16px -2px rgba(15, 81, 50, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover':'0 12px 30px -4px rgba(15, 81, 50, 0.10), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
