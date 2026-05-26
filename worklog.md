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

---
Task ID: 2
Agent: Main Agent
Task: Fix AI auto-tagging for images and voice memories in Aether

Work Log:
- Read all relevant source files: Dashboard.tsx, /api/ai/tags/route.ts, /api/ai/transcribe/route.ts, types.ts, aether-store.ts, MemoryDetail.tsx
- Identified root causes:
  - Image tagging: Image upload was mock-only (setImagePreview('mock')), content was hardcoded "Captured image", no VLM analysis
  - Voice tagging: Transcription summary was generated but ignored by frontend, fallback tags were generic (#voice, #memo)
  - Tags API: Prompts were not strong enough to prevent generic tags like #notes, #image, #voice
- Created new API endpoint: /api/ai/analyze-image/route.ts using VLM (zai.chat.completions.createVision) to analyze image content and generate description + relevant tags
- Rewrote /api/ai/tags/route.ts with:
  - Type-specific system prompts (voice, image, link, text)
  - Forbidden generic tags list (#notes, #memory, #voice, #image, #photo, etc.)
  - Accepts optional summary and imageDescription parameters for richer context
  - Fallback keyword-based tag extraction when LLM produces generic tags
- Updated Dashboard.tsx QuickCaptureModal:
  - Image: Actually reads file as base64, shows real image preview, calls /api/ai/analyze-image, displays VLM analysis with tags
  - Voice: Captures and uses summary from transcribe endpoint, passes summary to tag generation, displays AI summary in UI
  - Added smart fallback tags (getSmartFallbackTags) based on content keywords instead of generic type-based tags
- Updated MemoryDetail.tsx to show actual image preview for image memories

Stage Summary:
- Created: /src/app/api/ai/analyze-image/route.ts (new VLM image analysis endpoint)
- Modified: /src/app/api/ai/tags/route.ts (type-specific prompts, forbidden generic tags, summary/description support)
- Modified: /src/components/aether/Dashboard.tsx (real image upload + VLM analysis, voice summary capture, smart fallback tags)
- Modified: /src/components/aether/MemoryDetail.tsx (image preview display for image memories)
- All AI-generated tags are now content-relevant and specific
- #voice, #image, #notes and other generic tags are explicitly forbidden
- Voice memories now use transcription summary for richer tag generation
- Image memories now use VLM to analyze actual image content
