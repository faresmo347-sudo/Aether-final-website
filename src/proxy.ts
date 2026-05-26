import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that should be handled by Next.js directly (API routes, static assets, etc.)
const IGNORED_PREFIXES = [
  '/api/',
  '/_next/',
  '/auth/',
  '/favicon.ico',
  '/aether-icon.svg',
  '/aether-logo.png',
  '/aether-hero.png',
  '/aether-wave.png',
  '/logo.svg',
  '/robots.txt',
]

// Routes that exist as actual Next.js pages or API routes
const EXISTING_ROUTES = [
  '/auth/callback',
]

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Skip proxy for API routes, static assets, and existing Next.js routes
  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  if (EXISTING_ROUTES.some((route) => pathname === route)) {
    // Still refresh session for auth routes
    return updateSession(request)
  }

  // 2. Refresh Supabase session — this is critical for auth to work
  //    across tabs, new windows, and direct links
  const supabaseResponse = await updateSession(request)

  // 3. For SPA routing: if the path isn't "/" and doesn't match a static file,
  //    rewrite to "/" so the client-side router (Zustand) can handle it.
  //    This ensures /dashboard, /ask, /collections, /settings, etc. all load the app
  //    instead of returning 404.
  if (pathname !== '/' && !pathname.includes('.')) {
    // Rewrite to root page while preserving the URL in the browser
    // Carry over any cookies set by the Supabase session refresh
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = '/'
    const rewriteResponse = NextResponse.rewrite(rewriteUrl)

    // Copy cookies from the Supabase response to the rewrite response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie.name, cookie.value)
    })

    return rewriteResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * This ensures proxy runs on all pages and API routes.
     */
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
  ],
}
