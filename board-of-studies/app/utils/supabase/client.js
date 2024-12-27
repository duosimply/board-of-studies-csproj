// utils/supabase/client.js

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  process.env.NEXT_PUBLIC_SUPABASE_URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
