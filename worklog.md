---
Task ID: 1
Agent: main
Task: Fix sandbox inactive errors, preview errors, environment configuration, routing, build configuration, and deployment readiness

Work Log:
- Audited all core files: page.tsx, store, supabase clients, auth, offline-db, sync-engine
- Identified root cause: missing Next.js middleware/proxy for SPA routing and Supabase session refresh
- Created proper proxy.ts (Next.js 16 uses proxy.ts, not middleware.ts) with:
  - Supabase session refresh via updateSession()
  - SPA rewrite: /dashboard, /ask, /collections, /settings, /recaps all rewrite to / while preserving URL
  - Skips API routes, static assets, and auth callback
- Fixed next.config.ts: removed `output: "standalone"` (breaks Vercel), added security headers
- Added URL-based navigation to page.tsx: navigateFromUrl() reads window.location.pathname on load
- Added env var validation with graceful fallbacks to supabase/client.ts, server.ts, middleware.ts
- Created .env.example with all required variables documented
- Created vercel.json for Vercel deployment
- Verified no hardcoded localhost URLs in src/
- All routes tested: /, /dashboard, /ask, /collections, /settings, /recaps all return 200
- Lint passes cleanly

Stage Summary:
- Root cause was missing proxy.ts (Next.js 16's replacement for middleware.ts) for session refresh + SPA rewrites
- All routes now work via direct URL access thanks to proxy rewrite + client-side URL reading
- App is Vercel-ready with proper vercel.json, .env.example, and no hardcoded values
- Environment variables have graceful fallbacks — app won't crash if Supabase isn't configured
