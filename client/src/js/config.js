/**
 * COURSE CONTENT CONFIGURATION
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Replace all [PLACEHOLDER] values with real content before launch.
 * This is the single source of truth for all course content on the frontend.
 *
 * Search for "TODO:" comments to find things that need your input.
 */

export const COURSE = {
  // ─── IDENTITY ─────────────────────────────────────────────────────────────
  brand:      'Bright Future Academy',
  name:       'Study Material & Practice Papers',
  subtitle:   'Comprehensive study material and practice papers for classes 6, 7 & 8.',
  instructor: 'Bright Future Academy',
  topic:      'Class 6-8 Subjects',

  // ─── HERO HEADLINE (split for emphasis) ───────────────────────────────────
  heroHeadlinePrefix: 'Get the best',
  heroHeadlineHighlight: 'Study Material & Practice Papers',
  heroHeadlineSuffix: 'for Classes 6, 7 & 8',

  // ─── SOCIAL PROOF (ONLY add real numbers once you have them) ──────────────
  // WARNING: Do NOT publish fake numbers. Use founding-student language at launch.
  socialProof: {
    useFounding: true,
    foundingText: 'Join thousands of successful students',
    studentCount: null,
    rating: null,
    ratingCount: null,
  },

  // ─── PRICING ──────────────────────────────────────────────────────────────
  price: {
    current:         499,
    original:        999,
    currency:        'INR',
    display:         '₹499',
    displayOriginal: '₹999',
    hasDiscount:     true,
    discountPercent: '50%',
    hasEmi:          false,
    emiText:         '',
    inPaise:         49900,
  },

  // ─── CURRICULUM ───────────────────────────────────────────────────────────
  modules: [
    {
      index: '01',
      title: 'Class 6 - Complete Study Material',
      lessons: 10,
      duration: 'Self-paced',
      topics: [
        'Mathematics Practice Papers',
        'Science Study Notes',
        'English Grammar Worksheets',
        'Social Studies Question Bank',
      ],
      badge: 'All Subjects Included',
    },
    {
      index: '02',
      title: 'Class 7 - Complete Study Material',
      lessons: 10,
      duration: 'Self-paced',
      topics: [
        'Mathematics Practice Papers',
        'Science Study Notes',
        'English Grammar Worksheets',
        'Social Studies Question Bank',
      ],
      badge: 'All Subjects Included',
    },
    {
      index: '03',
      title: 'Class 8 - Complete Study Material',
      lessons: 10,
      duration: 'Self-paced',
      topics: [
        'Mathematics Practice Papers',
        'Science Study Notes',
        'English Grammar Worksheets',
        'Social Studies Question Bank',
      ],
      badge: 'All Subjects Included',
    },
  ],

  // ─── WHAT'S INCLUDED ──────────────────────────────────────────────────────
  inclusions: [
    { icon: 'description',    label: 'Detailed Study Notes',               desc: 'Chapter-wise summary and important points' },
    { icon: 'quiz',           label: 'Practice Papers',                    desc: 'Previous year questions and expected papers' },
    { icon: 'folder_special', label: 'Lifetime Google Drive Vault Access', desc: 'All materials organized in one place' },
    { icon: 'groups',         label: 'WhatsApp Support',                   desc: 'Connect with teachers for doubt clearing' },
  ],

  // ─── WHO IT'S FOR ─────────────────────────────────────────────────────────
  forYou: [
    'Students of Class 6 looking to excel in exams',
    'Students of Class 7 needing structured study materials',
    'Students of Class 8 preparing for higher classes',
    'Parents looking for reliable resources for their children',
  ],
  notForYou: [
    'Students looking for video lectures (this is material only)',
    'Students outside of classes 6, 7, and 8',
  ],

  // ─── HOW IT WORKS ─────────────────────────────────────────────────────────
  steps: [
    {
      num: '01',
      title: 'Register with your Gmail',
      desc: 'Enter your name, the Gmail address you use on your phone, and your WhatsApp number.',
      icon: 'person_add',
    },
    {
      num: '02',
      title: 'Complete Secure Payment',
      desc: 'Pay via UPI, GPay, PhonePe, Credit/Debit Card, or EMI — powered by Razorpay.',
      icon: 'payments',
    },
    {
      num: '03',
      title: 'Instant Drive Access',
      desc: 'Your Google Drive folder with all materials is shared to your Gmail instantly.',
      icon: 'folder_open',
    },
  ],

  // ─── DRIVE VAULT ──────────────────────────────────────────────────────────
  vault: {
    folderName: 'Bright Future Academy — Study Vault',
    files: [
      { icon: '📁', name: '01_Class_6_Materials' },
      { icon: '📁', name: '02_Class_7_Materials' },
      { icon: '📁', name: '03_Class_8_Materials' },
      { icon: '📁', name: '04_Bonus_Worksheets' },
    ],
  },

  // ─── FAQ ──────────────────────────────────────────────────────────────────
  faqs: [
    {
      q: 'How fast do I get access after payment?',
      a: 'Instantly. Your Google Drive folder is shared to your Gmail within 60 seconds of payment confirmation. You\'ll also receive a backup link on email and WhatsApp.',
    },
    {
      q: 'Do I need a Gmail account to access the materials?',
      a: 'Yes — Google Drive requires a Google account. This can be a Gmail address or any Google Workspace email. Make sure to enter the email address you actively use.',
    },
    {
      q: 'Can I view materials on my mobile phone?',
      a: 'Yes. You can view all PDFs and documents directly via the Google Drive app on iOS and Android, or download them for offline viewing and printing.',
    },
    {
      q: 'What if I entered the wrong email during registration?',
      a: 'Contact us on WhatsApp immediately. We can update your Drive access to the correct Gmail within 10 minutes.',
    },
    {
      q: 'Is there a refund policy?',
      a: 'No questions asked 7-day refund policy if you are not satisfied with the materials.',
    },
  ],

  // ─── CONTACT & SUPPORT ────────────────────────────────────────────────────
  support: {
    email:        'support@brightfutureacademy.com',
    whatsapp:     '919876543210',
    whatsappUrl:  'https://wa.me/919876543210',
    hours:        '9 AM – 11 PM IST',
    responseTime: 'under 15 minutes',
  },

  // ─── GOOGLE DRIVE ─────────────────────────────────────────────────────────
  drive: {
    folderId:  '[GOOGLE_DRIVE_FOLDER_ID]',
    folderUrl: 'https://drive.google.com/drive/folders/[FOLDER_ID]',
  },

  // ─── LEGAL ────────────────────────────────────────────────────────────────
  legal: {
    companyName: 'Bright Future Academy',
    gstin:       null,
    termsUrl:    '/terms',
    privacyUrl:  '/privacy',
  },
};
