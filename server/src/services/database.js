/**
 * SUPABASE DATABASE SERVICE
 */
import { createClient } from '@supabase/supabase-js';

const isConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!isConfigured) {
  console.warn('⚠️  Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env.');
}

// Use service role key (has full DB access — never expose to frontend)
export const supabase = isConfigured
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false },
      }
    )
  : {
      from: () => ({
        insert: async () => ({ error: new Error('Supabase not configured') }),
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Supabase not configured') }),
            order: () => ({
              limit: () => ({
                single: async () => ({ data: null, error: new Error('Supabase not configured') }),
              }),
            }),
          }),
          order: () => ({
            limit: () => ({
              single: async () => ({ data: null, error: new Error('Supabase not configured') }),
            }),
          }),
        }),
        update: () => ({
          eq: async () => ({ error: new Error('Supabase not configured') }),
        }),
      }),
    };
