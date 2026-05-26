# Task 11: Redesign Auth Screens for Mobile-First

## Agent: auth-mobile-redesign

## Summary
Redesigned all three auth screens (SignUp, SignIn, ForgotPassword) in `src/components/aether/Auth.tsx` for mobile-first UX, focusing on touch-friendliness, keyboard-awareness, and performance optimization.

## Changes Made

### AuthBackground — Mobile Performance
- Hidden 2 of 4 animated orbs on mobile (`hidden sm:block`) — only primary lavender + secondary teal render on mobile
- Reduces GPU load from 4 animated+blurred elements to 2

### Container — Keyboard-Aware Layout
- `min-h-screen` → `min-h-[100dvh]` (dynamic viewport height adapts to mobile keyboard)
- Added `overflow-y-auto` for scrolling when keyboard is open
- `p-4` → `py-4 pb-8` (extra bottom padding for keyboard scenario)

### Card — Full Width Mobile
- `w-full max-w-md` → `w-full max-w-md mx-4 sm:mx-auto`
- Padding: `p-8 sm:p-10` → `p-6 sm:p-8 md:p-10`

### Inputs — iOS Zoom Prevention
- Added `text-base` (16px) to all inputs — prevents iOS auto-zoom on focus
- All inputs already `h-12` (48px tap target)

### Labels — Clickability
- Added `cursor-pointer` to all labels

### Error Display — Mobile Readability
- `p-3.5` → `p-4`, added `leading-relaxed`

### Touch Targets — 44px Minimum
- Switch links: `<p>` → `<div>` with `min-h-[44px] flex items-center justify-center`
- Forgot password link: added `min-h-[44px] flex items-center`
- Back to Sign In button: added `min-h-[44px]`

### Unchanged
- All Supabase auth integration (signUp, signInWithPassword, resetPasswordForEmail)
- Password strength indicator (already mobile-readable)
- Confirmation screen layout (inherited mobile improvements from card/container changes)

## Verification
- Lint: passes with zero errors
- Dev server: responds with HTTP 200
