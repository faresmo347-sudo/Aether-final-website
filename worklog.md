---
Task ID: 1
Agent: Main
Task: Implement full offline-first architecture for Aether web app

Work Log:
- Created `src/lib/offline-db.ts` — IndexedDB wrapper for caching memories, collections, sync queue, and meta data
- Created `src/hooks/use-online-status.ts` — React hook using useSyncExternalStore for online/offline detection
- Created `src/lib/sync-engine.ts` — Background sync engine with conflict resolution, delta sync, auto-sync on reconnect
- Updated `src/components/aether/types.ts` — Added `syncStatus` field to Memory type
- Updated `src/store/aether-store.ts` — Added offline/sync state (isOnline, isSyncing, pendingSyncCount, lastSyncedAt, showOfflineBanner)
- Updated `src/lib/supabase/data.ts` — All data operations are now offline-aware: fetchMemories falls back to cache, createMemory saves to IndexedDB and queues for sync, updateMemoryById/deleteMemoryById queue operations when offline
- Updated `src/components/aether/Dashboard.tsx` — Added sync indicator to MemoryCard, handleSave detects offline and marks memories with syncStatus='pending', skips AI tagging when offline
- Updated `src/components/aether/AskAether.tsx` — Offline keyword search through cached memories with "Searching your cached memories" note
- Updated `src/components/aether/AppShell.tsx` — Added OfflineBanner component showing offline/syncing/pending states
- Updated `src/components/aether/Settings.tsx` — Offline-aware profile updates and exports with appropriate toast messages
- Updated `src/components/aether/MemoryDetail.tsx` — Offline-aware edit and tag operations with sync messages
- Updated `src/app/page.tsx` — Initialize offline DB on mount, listen for sync events, fallback to cached data on network errors, handle memory-synced events for temp ID replacement
- Build passes successfully, lint passes cleanly

Stage Summary:
- Complete offline-first architecture implemented
- 4 new files created (offline-db.ts, use-online-status.ts, sync-engine.ts)
- 8 existing files updated
- All features: offline memory reading, offline capture with sync queue, offline Ask Aether search, offline banner, smart sync with conflict resolution, auto-sync on reconnect
