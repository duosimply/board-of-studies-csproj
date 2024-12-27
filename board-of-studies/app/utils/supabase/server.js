import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const NEXT_PUBLIC_SUPABASE_URL = 'https://hfzhetmxzahyecqbahhx.supabase.co'
  const NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmemhldG14emFoeWVjcWJhaGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MzkxMDksImV4cCI6MjA1MDAxNTEwOX0.XP-Q_sc_yj2wQ35Gwrqa3pQEbw39HFhENkmHUhvR3V4'

  return createServerClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}