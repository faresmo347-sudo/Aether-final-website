---
Task ID: 1
Agent: Main Agent
Task: Redesign Aether app logo and favicon to be premium and polished; fix hydration error

Work Log:
- Read all existing source files to understand current logo locations and hydration error source
- Fixed hydration error in FloatingParticles component - removed `typeof window !== 'undefined' && window.innerWidth < 768` from useMemo which caused SSR/client mismatch
- Designed premium SVG brain/neural network logo with: abstract brain hemispheres made of flowing curves, neural node circles at intersections, subtle connection lines, #6D597A lavender primary color
- Created `/public/aether-icon.svg` - standalone SVG favicon file with circular background
- Created `/src/components/aether/AetherLogo.tsx` - reusable React component with AetherLogo (icon + optional text) and AetherIcon (standalone SVG) exports
- Generated new `/public/aether-logo.png` (1024x1024) using AI image generation with the new brain design
- Updated `/src/app/layout.tsx` - favicon now uses SVG (primary) + PNG (fallback) + Apple touch icon
- Updated `/src/app/page.tsx` - navbar logo, footer logo, and AI chat demo header all use AetherLogo component
- Updated `/src/components/aether/Auth.tsx` - AetherBrainLogo now uses AetherLogo component instead of Lucide Brain icon
- Updated `/src/components/aether/AppShell.tsx` - sidebar logo and mobile header logo both use AetherLogo component
- All lint checks pass, app compiles and serves with HTTP 200

Stage Summary:
- Hydration error fixed by removing window-dependent code from useMemo
- New premium logo: minimal abstract brain/neural network in #6D597A with white neural paths and nodes
- Logo consistently applied across all 6+ locations: favicon, navbar, footer, auth pages, sidebar, mobile header, chat demo
- SVG favicon for crisp rendering at all sizes + PNG fallback for older browsers
