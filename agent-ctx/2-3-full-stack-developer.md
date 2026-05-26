# Task 2-3: Redesign AppShell for mobile-first navigation + Update CSS globals

## Agent: full-stack-developer

## Changes Made

### 1. AppShell (`src/components/aether/AppShell.tsx`) — Full Redesign

**Mobile Bottom Navigation (below 768px):**
- 5 items: Home, Ask, Capture, Collections, Settings
- Center Capture button is a **raised circular lavender (#9D8BA7) button** that pops up above the bar
  - `-mt-5` to extend above the nav bar
  - 56px (h-14 w-14) circular button with gradient from #9D8BA7 to #7A6B85
  - Shadow with lavender tint + ring-4 ring-background/80 for visual separation
  - Opens capture modal on tap
- Active state: lavender color + `scale-[1.05]` on the active icon
- Each item has an icon + 10px label below it
- Bottom nav height: ~64px + `env(safe-area-inset-bottom)`
- Semi-transparent background (`bg-background/85`) with `backdrop-blur-lg` + `mobile-gpu` class
- Uses `tap-feedback` class for press animation

**Desktop Sidebar:**
- Kept as-is with 4 nav items (Home, Ask Aether, Collections, Settings)
- Added `scrollbar-none` class for cleaner scroll on sidebar nav

**Header:**
- Mobile: Simplified header with just the brain logo + compact search pill ("Ask Aether...")
  - Height reduced to h-12
  - Uses `safe-area-top` for iOS notch
  - `backdrop-blur-md` (reduced from xl for mobile performance)
- Desktop: Separate header block with full search bar + avatar, kept `backdrop-blur-xl`

**FAB Changes:**
- Removed floating FAB on mobile entirely (Capture button in bottom nav replaces it)
- Desktop: Subtle FAB at bottom-right (h-12 w-12, only visible on md+)

**Layout:**
- Changed `md:ml-64` to `md:pl-64` for better layout behavior
- Content area: `pb-20` on mobile (space for bottom nav), `pb-6` on desktop

### 2. CSS Globals (`src/app/globals.css`) — Mobile-First Utilities Added

- `.safe-area-top` / `.safe-area-bottom` — iOS safe area padding using `env()`
- `.scrollbar-none` — Hide scrollbar while keeping scroll functionality
- `.mobile-gpu` — GPU-accelerated animations on mobile (will-change, translateZ(0))
- `.tap-feedback` — Subtle scale on press (0.97) with 0.1s transition
- Reduced `backdrop-blur-xl` to 8px and `backdrop-blur-sm` to 4px on mobile for performance
- `.ios-scroll` — Smooth momentum scrolling on iOS with overscroll containment

## Lint Result
- Zero errors
