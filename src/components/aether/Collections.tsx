'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Briefcase,
  Lightbulb,
  Plane,
  BookOpen,
  ChefHat,
  Moon,
  Target,
  Palette,
  Music,
  Globe,
  Wrench,
  Heart,
  type LucideIcon,
} from 'lucide-react'
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

/* ─────────── Icon Registry ─────────── */

interface IconOption {
  key: string
  icon: LucideIcon
  label: string
}

const iconOptions: IconOption[] = [
  { key: 'briefcase', icon: Briefcase, label: 'Work' },
  { key: 'lightbulb', icon: Lightbulb, label: 'Ideas' },
  { key: 'plane', icon: Plane, label: 'Travel' },
  { key: 'book-open', icon: BookOpen, label: 'Books' },
  { key: 'chef-hat', icon: ChefHat, label: 'Recipes' },
  { key: 'moon', icon: Moon, label: 'Personal' },
  { key: 'target', icon: Target, label: 'Goals' },
  { key: 'palette', icon: Palette, label: 'Creative' },
  { key: 'music', icon: Music, label: 'Music' },
  { key: 'globe', icon: Globe, label: 'World' },
  { key: 'wrench', icon: Wrench, label: 'Tools' },
  { key: 'heart', icon: Heart, label: 'Health' },
]

const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  iconOptions.map((o) => [o.key, o.icon])
)

function CollectionIcon({ iconKey, className, style }: { iconKey: string; className?: string; style?: React.CSSProperties }) {
  const Icon = iconMap[iconKey] ?? Briefcase
  return <Icon className={className} style={style} />
}

/* ─────────── Helpers ─────────── */

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ─────────── Collections Component ─────────── */

export function Collections() {
  const { setCurrentView, setCollectionFilter } = useAetherStore()
  const [collections, setCollections] = useState<Collection[]>(mockCollections)
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<string>('briefcase')

  const handleCreate = () => {
    if (!newName.trim()) return
    const newCollection: Collection = {
      id: `col-${Date.now()}`,
      name: newName.trim(),
      icon: selectedIcon,
      memoryCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      color: '#9D8BA7',
    }
    setCollections((prev) => [...prev, newCollection])
    setNewName('')
    setSelectedIcon('briefcase')
    setCreateOpen(false)
  }

  const handleCollectionClick = (collection: Collection) => {
    setCollectionFilter(collection.id)
    setCurrentView('dashboard')
  }

  const handleTagClick = () => {
    setCollectionFilter(null)
    setCurrentView('dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Collections
            </h1>
            <p className="text-sm mt-1 text-muted-foreground">
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
              className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md hover:border-[#9D8BA7]/15 transition-all cursor-pointer group"
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${collection.color}15` }}
              >
                <CollectionIcon
                  iconKey={collection.icon}
                  className="size-5 transition-colors duration-300"
                  style={{ color: collection.color }}
                />
              </div>
              <h3 className="font-bold text-sm sm:text-base mb-1 text-foreground">
                {collection.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {collection.memoryCount} memories
              </p>
              <p className="text-xs mt-1 text-muted-foreground">
                Updated {formatDate(collection.lastUpdated)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tag Cloud Section */}
        <div>
          <h2
            className="text-xl sm:text-2xl font-bold mb-4 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
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
                className={`px-3 py-1.5 rounded-full transition-colors bg-[#9D8BA7]/8 text-foreground hover:bg-[#9D8BA7]/15 ${
                  tag.count >= 6
                    ? 'text-base'
                    : tag.count >= 4
                      ? 'text-sm'
                      : 'text-xs'
                }`}
              >
                {tag.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Collection Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle
              className="text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Create Collection
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">
                Name
              </label>
              <Input
                placeholder="Enter collection name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-xl border-[#9D8BA7]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Choose an Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {iconOptions.map((opt) => {
                  const Icon = opt.icon
                  const isSelected = selectedIcon === opt.key
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setSelectedIcon(opt.key)}
                      className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? 'scale-110 shadow-sm bg-[#9D8BA7]/12'
                          : 'hover:bg-muted'
                      }`}
                      style={
                        isSelected
                          ? { outline: '2px solid #9D8BA7' }
                          : {}
                      }
                      title={opt.label}
                    >
                      <Icon
                        className={`size-5 ${isSelected ? 'text-[#9D8BA7]' : 'text-muted-foreground'}`}
                      />
                    </button>
                  )
                })}
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
