---
Task ID: 1
Agent: main
Task: Fix performance, collections filter, AI auto-tagging, voice transcription, and Ask Aether accuracy

Work Log:
- Created 3 backend API routes: /api/ai/tags (LLM-based tag generation), /api/ai/transcribe (ASR-based voice transcription), /api/ai/search (LLM-based memory search)
- Rewrote Dashboard.tsx with React.memo on MemoryCard, EmptyState, FilterBar; replaced AnimatePresence with simple div rendering; added useMemo for filtered/sorted memories; collection filter works instantly via memoized computation
- Rewrote AskAether.tsx with memoized components (ChatBubble, InlineMemoryCard, TypingIndicator); replaced mock keyword matching with real API call to /api/ai/search; LLM searches actual memories and returns relevant results; if nothing found, honestly says so
- Rewrote AppShell.tsx: removed framer-motion from all nav items (SidebarNavItem, BottomNavItem); replaced motion.button with plain buttons; removed AnimatePresence wrapper from content area for instant page transitions
- Updated QuickCaptureModal in Dashboard: added real MediaRecorder API for voice recording; sends audio base64 to /api/ai/transcribe for ASR transcription; auto-tagging now calls /api/ai/tags with LLM to generate relevant tags; shows loading state while saving
- Collections filter already worked correctly in Dashboard (memoized filtered results); empty state is shown immediately when no memories match
- Lint passes with zero errors
- Dev server running on port 3000 and responding

Stage Summary:
- 3 new API routes created for AI capabilities using z-ai-web-dev-sdk
- All components memoized with React.memo where appropriate
- Removed framer-motion from navigation (biggest performance win)
- Page transitions are now instant (no AnimatePresence wait)
- AI auto-tagging uses LLM to generate 2-4 relevant tags per memory
- Voice recording uses real MediaRecorder API + ASR transcription
- Ask Aether uses LLM to search through actual memories with relevance ranking
