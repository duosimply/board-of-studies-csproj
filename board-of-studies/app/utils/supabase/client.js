// utils/supabase/client.js

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const NEXT_PUBLIC_SUPABASE_URL = 'https://hfzhetmxzahyecqbahhx.supabase.co';
  const NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmemhldG14emFoeWVjcWJhaGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MzkxMDksImV4cCI6MjA1MDAxNTEwOX0.XP-Q_sc_yj2wQ35Gwrqa3pQEbw39HFhENkmHUhvR3V4';

  return createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
