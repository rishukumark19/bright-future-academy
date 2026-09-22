-- ══════════════════════════════════════════════════
-- COURSE PLATFORM — SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/[your-project]/sql
-- ══════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENROLLMENTS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   TEXT NOT NULL,
  email                  TEXT NOT NULL,
  phone                  TEXT,

  -- Razorpay fields
  razorpay_order_id      TEXT UNIQUE NOT NULL,
  razorpay_payment_id    TEXT,
  razorpay_signature     TEXT,
  payment_status         TEXT DEFAULT 'pending'
                         CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled')),

  -- Fulfillment
  drive_access_granted   BOOLEAN DEFAULT FALSE,
  drive_access_granted_at TIMESTAMPTZ,
  email_sent             BOOLEAN DEFAULT FALSE,
  email_sent_at          TIMESTAMPTZ,

  -- Metadata
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_email ON enrollments(email);
CREATE INDEX IF NOT EXISTS idx_enrollments_order_id ON enrollments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(payment_status);
CREATE INDEX IF NOT EXISTS idx_enrollments_drive ON enrollments(drive_access_granted);

-- ── EMAIL CORRECTIONS ────────────────────────────
-- Stores student email correction requests
CREATE TABLE IF NOT EXISTS email_corrections (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id  UUID REFERENCES enrollments(id),
  old_email      TEXT NOT NULL,
  new_email      TEXT NOT NULL,
  phone          TEXT,
  status         TEXT DEFAULT 'pending'
                 CHECK (status IN ('pending', 'processed', 'rejected')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  processed_at   TIMESTAMPTZ
);

-- ── UPDATED_AT TRIGGER ───────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ══════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- The server uses the service role key which bypasses RLS.
-- Enable RLS to prevent direct public access via the anon key.
-- ══════════════════════════════════════════════════

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_corrections ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically — no policies needed for server access.
-- Add policies here if you ever add a client-side Supabase connection.
