import { create } from 'zustand'
import type { AppView, Memory, CaptureTab, RecapView, ChatMessage } from '@/components/aether/types'
import { mockMemories } from '@/components/aether/mock-data'

interface AetherState {
  // Navigation
  currentView: AppView
  setCurrentView: (view: AppView) => void

  // Memories
  memories: Memory[]
  addMemory: (memory: Memory) => void
  deleteMemory: (id: string) => void
  selectedMemoryId: string | null
  setSelectedMemoryId: (id: string | null) => void

  // Quick Capture
  captureModalOpen: boolean
  setCaptureModalOpen: (open: boolean) => void
  activeCaptureTab: CaptureTab
  setActiveCaptureTab: (tab: CaptureTab) => void

  // Search / Filter
  searchQuery: string
  setSearchQuery: (q: string) => void
  activeFilter: string
  setActiveFilter: (f: string) => void

  // Chat
  chatMessages: ChatMessage[]
  addChatMessage: (msg: ChatMessage) => void
  isChatThinking: boolean
  setChatThinking: (v: boolean) => void

  // Recaps
  recapView: RecapView
  setRecapView: (v: RecapView) => void

  // Settings
  dailySummary: boolean
  setDailySummary: (v: boolean) => void
  weeklyRecap: boolean
  setWeeklyRecap: (v: boolean) => void
  autoTagging: boolean
  setAutoTagging: (v: boolean) => void
  defaultCapture: CaptureTab
  setDefaultCapture: (v: CaptureTab) => void
}

export const useAetherStore = create<AetherState>((set) => ({
  // Navigation
  currentView: 'landing',
  setCurrentView: (view) => set({ currentView: view }),

  // Memories
  memories: mockMemories,
  addMemory: (memory) => set((s) => ({ memories: [memory, ...s.memories] })),
  deleteMemory: (id) => set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),
  selectedMemoryId: null,
  setSelectedMemoryId: (id) => set({ selectedMemoryId: id }),

  // Quick Capture
  captureModalOpen: false,
  setCaptureModalOpen: (open) => set({ captureModalOpen: open }),
  activeCaptureTab: 'text',
  setActiveCaptureTab: (tab) => set({ activeCaptureTab: tab }),

  // Search / Filter
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  activeFilter: 'All',
  setActiveFilter: (f) => set({ activeFilter: f }),

  // Chat
  chatMessages: [],
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  isChatThinking: false,
  setChatThinking: (v) => set({ isChatThinking: v }),

  // Recaps
  recapView: 'daily',
  setRecapView: (v) => set({ recapView: v }),

  // Settings
  dailySummary: true,
  setDailySummary: (v) => set({ dailySummary: v }),
  weeklyRecap: true,
  setWeeklyRecap: (v) => set({ weeklyRecap: v }),
  autoTagging: true,
  setAutoTagging: (v) => set({ autoTagging: v }),
  defaultCapture: 'text',
  setDefaultCapture: (v) => set({ defaultCapture: v }),
}))
