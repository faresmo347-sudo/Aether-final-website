---
Task ID: 1
Agent: Main Agent
Task: Fix website not showing in preview or new tab

Work Log:
- Diagnosed that the dev server was not running (port 3000 not listening)
- Found that the `middleware.ts` convention is deprecated in Next.js 16 - must use `proxy.ts` with `export default function proxy()`
- Renamed `src/middleware.ts` to `src/proxy.ts` and updated the export from `export async function middleware()` to `export default async function proxy()`
- Fixed proxy file to use the correct Next.js 16 proxy convention
- Discovered that background dev server processes get killed by the sandbox after serving a few requests
- Created `start-dev.sh` auto-restart wrapper script that restarts the server when it dies
- Verified the page renders correctly in the browser with all components: Landing page, Features, How It Works, AI Chat Demo, Testimonials, Pricing, CTA, Footer
- Confirmed no browser console errors
- The page title shows "Aether — Your AI-Powered Second Brain"

Stage Summary:
- Fixed the critical proxy.ts migration issue (middleware → proxy) that was causing 500 errors
- The website now renders correctly when the dev server is running
- Created auto-restart wrapper (`start-dev.sh`) to keep the dev server alive
- The landing page with all sections is fully functional
- Key files changed: `src/proxy.ts` (renamed from middleware.ts, updated exports), `start-dev.sh` (new file)
