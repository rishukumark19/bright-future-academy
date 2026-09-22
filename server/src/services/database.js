/**
 * SUPABASE DATABASE SERVICE
 */
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

// Use service role key (has full DB access — never expose to frontend)
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: { persistSession: false },
  }
);
