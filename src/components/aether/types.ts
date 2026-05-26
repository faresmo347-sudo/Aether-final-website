export type MemoryType = 'text' | 'voice' | 'link' | 'image'

export interface Memory {
  id: string
  type: MemoryType
  title: string
  content: string
  tags: string[]
  createdAt: string
  source?: string
  aiSummary?: string
  collectionId?: string
  imagePreview?: string
}

export interface Collection {
  id: string
  name: string
  icon: string
  memoryCount: number
  lastUpdated: string
  color: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  referencedMemories?: string[]
  sourcesCount?: number
  timestamp: string
}

export type AppView = 'landing' | 'dashboard' | 'memory-detail' | 'ask-aether' | 'collections' | 'recaps' | 'settings'

export type CaptureTab = 'text' | 'voice' | 'link' | 'image'

export type RecapView = 'daily' | 'weekly'
