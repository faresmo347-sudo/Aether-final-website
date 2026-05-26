import { createClient } from '@/lib/supabase/client'
import type { Memory, Collection, UserProfile } from '@/components/aether/types'

const PAGE_SIZE = 20

// ─── AUTH ───

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}

// ─── PROFILES ───

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    initials: getInitials(data.name || data.email || ''),
    avatarUrl: data.avatar_url,
    plan: data.plan || 'free',
  }
}

export async function updateProfile(userId: string, updates: { name?: string; avatar_url?: string }) {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}

// ─── MEMORIES ───

export async function fetchMemories(page: number = 0): Promise<{ memories: Memory[]; hasMore: boolean }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { memories: [], hasMore: false }

  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Fetch memories error:', error)
    return { memories: [], hasMore: false }
  }

  const memories: Memory[] = (data || []).map(mapMemoryFromDb)
  const hasMore = data?.length === PAGE_SIZE

  return { memories, hasMore }
}

export async function createMemory(memory: {
  type: string
  title: string
  content: string
  summary?: string
  tags: string[]
  sourceUrl?: string
  fileUrl?: string
  imagePreview?: string
  collectionId?: string
}): Promise<Memory> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('memories')
    .insert({
      user_id: user.id,
      type: memory.type,
      title: memory.title,
      content: memory.content,
      summary: memory.summary,
      tags: memory.tags,
      source_url: memory.sourceUrl,
      file_url: memory.fileUrl,
      image_preview: memory.imagePreview,
    })
    .select()
    .single()

  if (error) throw error

  // Add to collection if specified
  if (memory.collectionId && data) {
    await supabase.from('memory_collections').insert({
      memory_id: data.id,
      collection_id: memory.collectionId,
    })
  }

  return mapMemoryFromDb(data)
}

export async function deleteMemoryById(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getMemoryCount(): Promise<number> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count, error } = await supabase
    .from('memories')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (error) return 0
  return count || 0
}

// ─── COLLECTIONS ───

export async function fetchCollections(): Promise<Collection[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Fetch collections error:', error)
    return []
  }

  // Get memory counts for each collection
  const collections: Collection[] = []
  for (const col of (data || [])) {
    const { count } = await supabase
      .from('memory_collections')
      .select('*', { count: 'exact', head: true })
      .eq('collection_id', col.id)

    collections.push({
      id: col.id,
      name: col.name,
      icon: col.icon,
      color: col.color,
      memoryCount: count || 0,
      lastUpdated: col.created_at,
      userId: col.user_id,
    })
  }

  return collections
}

export async function createCollection(collection: {
  name: string
  icon: string
  color: string
}): Promise<Collection> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('collections')
    .insert({
      user_id: user.id,
      name: collection.name,
      icon: collection.icon,
      color: collection.color,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    color: data.color,
    memoryCount: 0,
    lastUpdated: data.created_at,
    userId: data.user_id,
  }
}

export async function addMemoryToCollection(memoryId: string, collectionId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('memory_collections')
    .insert({ memory_id: memoryId, collection_id: collectionId })

  if (error) throw error
}

export async function getMemoriesForCollection(collectionId: string): Promise<Memory[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('memory_collections')
    .select('memory_id, memories(*)')
    .eq('collection_id', collectionId)

  if (error || !data) return []

  return data
    .map((row: any) => row.memories ? mapMemoryFromDb(row.memories) : null)
    .filter(Boolean) as Memory[]
}

// ─── EXPORT ───

export async function exportAllMemories(): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  return JSON.stringify(data, null, 2)
}

// ─── HELPERS ───

function mapMemoryFromDb(row: any): Memory {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    content: row.content,
    tags: row.tags || [],
    createdAt: row.created_at,
    source: row.source_url,
    aiSummary: row.summary,
    imagePreview: row.image_preview,
    userId: row.user_id,
    summary: row.summary,
    sourceUrl: row.source_url,
    fileUrl: row.file_url,
    updatedAt: row.updated_at,
  }
}

function getInitials(name: string): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}
