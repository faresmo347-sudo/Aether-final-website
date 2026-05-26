---
Task ID: 1
Agent: Main Agent
Task: Fix website not working when opening in new tab or via direct link

Work Log:
- Diagnosed root causes: (1) Supabase client cookies not always set with path=/, (2) session restoration too slow (3-sec fallback), (3) auth callback not setting cookies with path=/
- Fixed src/lib/supabase/client.ts — Always set path=/ on cookies to ensure they persist across tabs and new windows
- Fixed src/lib/supabase/middleware.ts — Set path=/ and long maxAge on server-side cookies for session refresh
- Fixed src/app/auth/callback/route.ts — Properly create Supabase server client with cookie handling, set path=/ on all cookies
- Fixed src/app/page.tsx — Replaced slow onAuthStateChange/INITIAL_SESSION pattern with immediate getSession() call for instant session restoration
- Fixed src/store/aether-store.ts — Removed direct localStorage access in store initializer that could cause hydration mismatch

Stage Summary:
- Key fix: Cookie path=/ ensures Supabase auth tokens are visible on all routes and persist when opening in new tabs
- Key fix: getSession() is called immediately on mount instead of waiting for INITIAL_SESSION event (which could be slow or unreliable)
- Key fix: getUser() fallback handles expired tokens that need server-side refresh
- Auth callback now properly sets session cookies with path=/ for Google OAuth
- Middleware sets long maxAge (1 year) so session cookies survive browser restarts
- Lint passes cleanly, server returns 200
