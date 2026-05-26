import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // If "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Successfully exchanged code for session.
      // Redirect to the app root — the client-side onAuthStateChange
      // will detect the session and load the dashboard.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  console.error('Auth callback: failed to exchange code for session')
  return NextResponse.redirect(`${origin}`)
}
