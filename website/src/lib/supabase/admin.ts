import { createClient } from '@supabase/supabase-js';

/**
 * کلاینت سرویس‌رول — فقط سمت سرور (Route Handlerها).
 * RLS را دور می‌زند، پس هرگز در کد کلاینت import نشود.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
