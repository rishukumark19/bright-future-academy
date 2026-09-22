/**
 * EXPRESS SERVER — Entry Point
 * Serves the built Vite frontend + all API routes
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { rateLimit } from 'express-rate-limit';

import apiRouter from './routes/api.js';
import webhookRouter from './routes/webhook.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ─────────────────────────────────────────────────────────────

// Trust proxy (needed for Railway/Render rate limiting)
app.set('trust proxy', 1);

// CORS — only allow your own domain in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: false,
}));

// Rate limit order creation (prevent spam)
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                      // 10 order attempts per IP per 15min
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Webhook must receive raw body for signature verification
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// All other routes get JSON parsing
app.use(express.json({ limit: '10kb' }));

// Apply rate limiter to order creation only
app.use('/api/create-order', orderLimiter);

// API routes
app.use('/api', apiRouter);

// ── SERVE BUILT FRONTEND ───────────────────────────────────────────────────
const publicDir = join(__dirname, '../../server/public');
app.use(express.static(publicDir));

// Multi-page fallback — serve index.html for unknown routes
// Individual pages (register.html, checkout.html etc.) are served directly
app.get('*', (req, res) => {
  res.sendFile(join(publicDir, 'index.html'));
});

// ── START ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Course Platform server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Razorpay: ${process.env.RAZORPAY_KEY_ID ? '✅ Configured' : '⚠️  NOT CONFIGURED'}`);
  console.log(`   Supabase:  ${process.env.SUPABASE_URL ? '✅ Configured' : '⚠️  NOT CONFIGURED'}`);
  console.log(`   Drive:     ${process.env.GOOGLE_DRIVE_FOLDER_ID ? '✅ Configured' : '⚠️  NOT CONFIGURED'}`);
  console.log(`   Email:     ${process.env.RESEND_API_KEY ? '✅ Configured' : '⚠️  NOT CONFIGURED'}\n`);
});
