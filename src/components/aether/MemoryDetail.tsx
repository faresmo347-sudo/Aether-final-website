'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Brain,
  Share2,
  Pencil,
  Trash2,
  Plus,
  Mic,
  Link2,
  FileText,
  Image as ImageIcon,
  Calendar,
  Tag,
  X,
  Check,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAetherStore } from '@/store/aether-store'
import { useToast } from '@/hooks/use-toast'
import type { Memory, MemoryType } from '@/components/aether/types'

const typeConfig: Record<MemoryType, { icon: typeof Mic; label: string; color: string }> = {
  text: { icon: FileText, label: 'Text', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  voice: { icon: Mic, label: 'Voice', color: 'bg-[#9D8BA7]/10 text-[#9D8BA7] border-[#9D8BA7]/20' },
  link: { icon: Link2, label: 'Link', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  image: { icon: ImageIcon, label: 'Image', color: 'bg-amber-50 text-amber-700 border-amber-200' },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/* ─────────── Related Memory Card ─────────── */
function RelatedMemoryCard({ memory, onClick }: { memory: Memory; onClick: () => void }) {
  const config = typeConfig[memory.type]
  const Icon = config.icon

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-[#9D8BA7]/20 transition-all duration-300 group"
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-[#9D8BA7]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#9D8BA7]/15 transition-colors duration-300">
          <Icon size={16} className="text-[#9D8BA7]" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#1a1a2e] truncate group-hover:text-[#9D8BA7] transition-colors duration-300">
            {memory.title}
          </h4>
          <p className="text-xs text-[#6c757d] line-clamp-2 mt-1 leading-relaxed">
            {memory.content}
          </p>
        </div>
      </div>
    </button>
  )
}

/* ─────────── Delete Confirmation Dialog ─────────── */
function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  memoryTitle,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  memoryTitle: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border border-gray-100 bg-[#FFFAF5]">
        <DialogHeader>
          <DialogTitle className="text-[#1a1a2e]">Delete Memory</DialogTitle>
          <DialogDescription className="text-[#6c757d]">
            Are you sure you want to delete &ldquo;{memoryTitle}&rdquo;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-gray-200 text-[#1a1a2e] hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="rounded-xl"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ─────────── Memory Detail View ─────────── */
export function MemoryDetail() {
  const { memories, selectedMemoryId, setSelectedMemoryId, setCurrentView, deleteMemory } = useAetherStore()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTag, setNewTag] = useState('')

  const memory = useMemo(
    () => memories.find((m) => m.id === selectedMemoryId),
    [memories, selectedMemoryId]
  )

  // Find related memories: same collection or matching tags
  const relatedMemories = useMemo(() => {
    if (!memory) return []
    return memories
      .filter((m) => {
        if (m.id === memory.id) return false
        const sameCollection = m.collectionId && m.collectionId === memory.collectionId
        const sharedTags = m.tags.some((t) => memory.tags.includes(t))
        return sameCollection || sharedTags
      })
      .slice(0, 3)
  }, [memories, memory])

  const handleBack = () => {
    setSelectedMemoryId(null)
    setCurrentView('dashboard')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`https://aether.app/memory/${memory?.id ?? ''}`)
    toast({ title: 'Link copied!', description: 'Memory link has been copied to your clipboard.' })
  }

  const handleEdit = () => {
    if (!memory) return
    if (isEditing) {
      // Save — update content in the memory store
      setIsEditing(false)
    } else {
      setEditContent(memory.content)
      setIsEditing(true)
    }
  }

  const handleDelete = () => {
    if (!memory) return
    deleteMemory(memory.id)
    setDeleteDialogOpen(false)
    setSelectedMemoryId(null)
    setCurrentView('dashboard')
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return
    // Tags are managed in mock-data, we just clear the input for demo
    setNewTag('')
    setShowTagInput(false)
    toast({ title: 'Tag added!', description: `"${newTag.trim()}" has been added to this memory.` })
  }

  // Empty state
  if (!memory) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-6"
      >
        <div className="h-16 w-16 rounded-2xl bg-[#9D8BA7]/10 flex items-center justify-center mb-4">
          <Brain size={28} className="text-[#9D8BA7]" />
        </div>
        <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2">Memory not found</h2>
        <p className="text-sm text-[#6c757d] mb-6 text-center">
          This memory may have been deleted or doesn&apos;t exist.
        </p>
        <Button
          onClick={handleBack}
          variant="outline"
          className="rounded-xl border-[#9D8BA7]/20 text-[#9D8BA7] hover:bg-[#9D8BA7]/5"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>
    )
  }

  const config = typeConfig[memory.type]
  const TypeIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen bg-[#FFFAF5]"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* ── Back Button ── */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-[#6c757d] hover:text-[#9D8BA7] transition-colors duration-300 mb-6 group"
        >
          <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Dashboard
        </button>

        {/* ── Memory Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-start gap-4 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-[#9D8BA7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <TypeIcon size={22} className="text-[#9D8BA7]" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] leading-tight">
                {memory.title}
              </h1>
            </div>
          </div>

          {/* ── Metadata Row ── */}
          <div className="flex flex-wrap items-center gap-3 mt-4 mb-6">
            <div className="flex items-center gap-1.5 text-sm text-[#6c757d]">
              <Calendar size={14} />
              <span>{formatDate(memory.createdAt)}</span>
            </div>
            <Badge
              variant="outline"
              className={`${config.color} text-xs font-medium rounded-lg px-2.5 py-0.5`}
            >
              <TypeIcon size={12} className="mr-1" />
              {config.label}
            </Badge>
            {memory.source && (
              <a
                href={memory.source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#9D8BA7] hover:text-[#6D597A] transition-colors duration-300 group"
              >
                <Link2 size={12} />
                <span className="truncate max-w-[200px]">{memory.source.replace(/^https?:\/\//, '')}</span>
                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            )}
          </div>
        </motion.div>

        {/* ── Content ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-8"
        >
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[180px] rounded-2xl border-gray-100 bg-white text-[#1a1a2e] text-base leading-relaxed focus-visible:border-[#9D8BA7]/30 focus-visible:ring-[#9D8BA7]/10 resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border-gray-200"
                >
                  <X size={14} className="mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsEditing(false)
                    toast({ title: 'Memory updated!', description: 'Your changes have been saved.' })
                  }}
                  className="rounded-xl bg-[#9D8BA7] hover:bg-[#6D597A] text-white"
                >
                  <Check size={14} className="mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
              <p className="text-[#1a1a2e] text-base leading-relaxed whitespace-pre-wrap">
                {memory.content}
              </p>
            </div>
          )}
        </motion.div>

        {/* ── Tags ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Tag size={14} className="text-[#9D8BA7]" />
            <h3 className="text-sm font-semibold text-[#1a1a2e]">Tags</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#9D8BA7]/8 text-[#9D8BA7] border border-[#9D8BA7]/15 hover:bg-[#9D8BA7]/15 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
            {showTagInput ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTag()
                    if (e.key === 'Escape') {
                      setShowTagInput(false)
                      setNewTag('')
                    }
                  }}
                  placeholder="#new-tag"
                  autoFocus
                  className="h-8 w-28 rounded-full border border-[#9D8BA7]/20 bg-white px-3 text-xs text-[#1a1a2e] placeholder:text-[#6c757d]/50 focus:outline-none focus:border-[#9D8BA7]/40 focus:ring-2 focus:ring-[#9D8BA7]/10 transition-all duration-300"
                />
                <button
                  onClick={handleAddTag}
                  className="h-7 w-7 rounded-full bg-[#9D8BA7] text-white flex items-center justify-center hover:bg-[#6D597A] transition-colors duration-300"
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={() => {
                    setShowTagInput(false)
                    setNewTag('')
                  }}
                  className="h-7 w-7 rounded-full bg-gray-100 text-[#6c757d] flex items-center justify-center hover:bg-gray-200 transition-colors duration-300"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#6c757d] border border-dashed border-gray-200 hover:border-[#9D8BA7]/30 hover:text-[#9D8BA7] hover:bg-[#9D8BA7]/5 transition-all duration-300"
              >
                <Plus size={12} />
                Add tag
              </button>
            )}
          </div>
        </motion.div>

        {/* ── AI Summary ── */}
        {memory.aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mb-8"
          >
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm border-l-4 border-l-[#9D8BA7]">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={16} className="text-[#9D8BA7]" />
                <span className="text-xs font-semibold text-[#9D8BA7] uppercase tracking-wider">
                  Aether&apos;s Understanding
                </span>
              </div>
              <p className="text-sm text-[#1a1a2e] leading-relaxed">
                {memory.aiSummary}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Related Memories ── */}
        {relatedMemories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-sm font-semibold text-[#1a1a2e] mb-4">Related Memories</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedMemories.map((relMemory) => (
                <RelatedMemoryCard
                  key={relMemory.id}
                  memory={relMemory}
                  onClick={() => {
                    setSelectedMemoryId(relMemory.id)
                    setIsEditing(false)
                    setShowTagInput(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex flex-wrap gap-3 pt-4 border-t border-gray-100"
        >
          <Button
            onClick={handleShare}
            variant="outline"
            className="rounded-xl border-gray-200 text-[#1a1a2e] hover:bg-[#9D8BA7]/5 hover:border-[#9D8BA7]/20 hover:text-[#9D8BA7] transition-all duration-300"
          >
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
          {memory.type === 'text' && (
            <Button
              onClick={handleEdit}
              variant="outline"
              className={`rounded-xl border-gray-200 transition-all duration-300 ${
                isEditing
                  ? 'bg-[#9D8BA7]/10 border-[#9D8BA7]/20 text-[#9D8BA7]'
                  : 'text-[#1a1a2e] hover:bg-[#9D8BA7]/5 hover:border-[#9D8BA7]/20 hover:text-[#9D8BA7]'
              }`}
            >
              {isEditing ? (
                <>
                  <Check size={16} className="mr-2" />
                  Editing...
                </>
              ) : (
                <>
                  <Pencil size={16} className="mr-2" />
                  Edit
                </>
              )}
            </Button>
          )}
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="outline"
            className="rounded-xl border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </motion.div>
      </div>

      {/* ── Delete Confirmation Dialog ── */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        memoryTitle={memory.title}
      />
    </motion.div>
  )
}
