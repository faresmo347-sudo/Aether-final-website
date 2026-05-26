import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // First, set cookies on the request so the Supabase client can read them
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        // Then create a new response with the updated cookies
        supabaseResponse = NextResponse.next({ request })
        // Set cookies on the response so the browser persists them
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            sameSite: 'lax',
            path: '/',
          })
        )
      },
    },
  })

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // This will refresh the user's session if it's expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes — redirect to landing if not authenticated
  // (All app views are handled client-side via Zustand, so no server-side
  // route protection is needed. The middleware only ensures session cookies
  // are refreshed.)

  return supabaseResponse
}
