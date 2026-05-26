'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { mockCollections, allTags } from './mock-data'
import { useAetherStore } from '@/store/aether-store'
import type { Collection } from './types'

const emojiOptions = ['💼', '💡', '✈️', '📚', '🍳', '🌙', '🎯', '🎨', '🎵', '🌍', '🔧', '❤️']

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function Collections() {
  const { setCurrentView } = useAetherStore()
  const [collections, setCollections] = useState<Collection[]>(mockCollections)
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState<string>('💼')

  const handleCreate = () => {
    if (!newName.trim()) return
    const newCollection: Collection = {
      id: `col-${Date.now()}`,
      name: newName.trim(),
      icon: selectedEmoji,
      memoryCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      color: '#9D8BA7',
    }
    setCollections((prev) => [...prev, newCollection])
    setNewName('')
    setSelectedEmoji('💼')
    setCreateOpen(false)
  }

  const handleCollectionClick = (collection: Collection) => {
    setCurrentView('dashboard')
  }

  const handleTagClick = () => {
    setCurrentView('dashboard')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFAF5' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}
            >
              Collections
            </h1>
            <p className="text-sm mt-1" style={{ color: '#1a1a2e', opacity: 0.5 }}>
              Organize your memories by theme
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="rounded-full px-4 shadow-sm"
            style={{ backgroundColor: '#9D8BA7', color: '#fff', border: 'none' }}
          >
            <Plus className="size-4 mr-1" />
            Create Collection
          </Button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -2 }}
              onClick={() => handleCollectionClick(collection)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-3xl mb-3">{collection.icon}</div>
              <h3
                className="font-bold text-sm sm:text-base mb-1"
                style={{ color: '#1a1a2e' }}
              >
                {collection.name}
              </h3>
              <p className="text-xs" style={{ color: '#1a1a2e', opacity: 0.5 }}>
                {collection.memoryCount} memories
              </p>
              <p className="text-xs mt-1" style={{ color: '#1a1a2e', opacity: 0.4 }}>
                Updated {formatDate(collection.lastUpdated)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tag Cloud Section */}
        <div>
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}
          >
            Your Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <motion.button
                key={tag.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTagClick}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  tag.count >= 6
                    ? 'text-base'
                    : tag.count >= 4
                      ? 'text-sm'
                      : 'text-xs'
                }`}
                style={{
                  backgroundColor: 'rgba(157, 139, 167, 0.08)',
                  color: '#1a1a2e',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(157, 139, 167, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(157, 139, 167, 0.08)'
                }}
              >
                {tag.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Collection Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md" style={{ backgroundColor: '#FFFAF5' }}>
          <DialogHeader>
            <DialogTitle
              style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}
            >
              Create Collection
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#1a1a2e' }}
              >
                Name
              </label>
              <Input
                placeholder="Enter collection name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-xl"
                style={{ borderColor: 'rgba(157, 139, 167, 0.3)' }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: '#1a1a2e' }}
              >
                Choose an Emoji
              </label>
              <div className="grid grid-cols-6 gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-2xl p-2 rounded-xl transition-all ${
                      selectedEmoji === emoji
                        ? 'ring-2 scale-110'
                        : 'hover:bg-gray-100'
                    }`}
                    style={
                      selectedEmoji === emoji
                        ? { ringColor: '#9D8BA7', backgroundColor: 'rgba(157, 139, 167, 0.1)' }
                        : {}
                    }
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-full">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="rounded-full"
              style={{ backgroundColor: '#9D8BA7', color: '#fff', border: 'none' }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
