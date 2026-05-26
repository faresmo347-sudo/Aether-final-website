# Task 5-6: Redesign Memory Detail and Ask Aether for mobile-first

## Agent: mobile-ui-agent

## Summary
Redesigned both MemoryDetail and AskAether components for a mobile-first, native-app-like experience while preserving all existing functionality (Supabase, AI search, memory references, etc.).

## Changes Made

### globals.css
- Added `.scrollbar-none` utility (hide scrollbar while keeping scroll)
- Added `.ios-scroll` utility (iOS momentum scrolling with overscroll-behavior)
- Added `.pb-safe` utility (safe-area bottom padding for iOS)

### MemoryDetail.tsx
- **Full-screen mobile layout**: Removed `max-w-3xl mx-auto` on mobile, uses `md:max-w-3xl md:mx-auto`
- **Padding**: `px-4 sm:px-6`, `py-4 sm:py-10`
- **Back button**: min 44x44px touch target, text label hidden on mobile
- **AI Insights card**: full width with `p-4 sm:p-6`, left border accent preserved
- **View Original Memory button**: `w-full md:w-auto`, `min-h-[48px]`
- **Tags**: horizontally scrollable on mobile (`overflow-x-auto scrollbar-none`), each tag `whitespace-nowrap flex-shrink-0`; wraps on desktop
- **Action Buttons**: fixed bottom bar on mobile (`fixed bottom-16 left-0 right-0 md:hidden`), each 48x48px with icon + label; desktop keeps inline layout
- **Related Memories**: horizontally scrollable cards (`min-w-[260px]`), grid on desktop
- **Content editing**: textarea `min-h-[50vh]` on mobile for near-full-screen editing
- **Root container**: `pb-28 md:pb-6` to prevent content hiding behind fixed action bar

### AskAether.tsx
- **Header**: compact on mobile (smaller icon, `text-lg` title), subtitle hidden on mobile
- **Suggested Questions**: horizontally scrollable chips (`overflow-x-auto scrollbar-none flex gap-2`), each `whitespace-nowrap min-w-fit`
- **Chat messages**: user bubbles `max-w-[75%] ml-auto`, Aether bubbles `max-w-[85%]`
- **Input bar**: fixed above bottom nav on mobile (`fixed bottom-16 md:static z-30`), with `bg-card/95 backdrop-blur-sm` and `pb-safe`
- **Input field**: `min-h-[48px]`, microphone button inside input bar
- **Send button**: `h-12 w-12` on mobile for larger touch target
- **Chat area**: `ios-scroll` class for momentum scrolling, `md:max-w-3xl md:mx-auto`
- **Empty state**: "Capture a Memory" button is `w-full sm:w-auto` with `min-h-[48px]`
- **Mobile spacer**: `h-20 md:hidden` div so content scrolls past fixed input bar

## Verification
- Lint: passes with zero errors
- Dev server: responds with HTTP 200
- All existing functionality preserved
