'use client'

import { useState, useCallback, useMemo, memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, FileText, Link2, ImageIcon, X, Upload, Plus, Brain, ArrowLeft, FolderOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAetherStore } from '@/store/aether-store'
import { mockCollections } from '@/components/aether/mock-data'
import type { Memory, MemoryType } from '@/components/aether/types'

// ---------- helpers ----------

const FILTER_MAP: Record<string, MemoryType | undefined> = {
  All: undefined,
  Text: 'text',
  Voice: 'voice',
  Links: 'link',
  Images: 'image',
}

const FILTERS = Object.keys(FILTER_MAP)

function typeIcon(type: MemoryType) {
  switch (type) {
    case 'voice':
      return <Mic className="size-4 text-[#9D8BA7]" />
    case 'link':
      return <Link2 className="size-4 text-[#9D8BA7]" />
    case 'image':
      return <ImageIcon className="size-4 text-[#9D8BA7]" />
    default:
      return <FileText className="size-4 text-[#9D8BA7]" />
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// ---------- sub-components (memoized) ----------

const MemoryCard = memo(function MemoryCard({ memory, onClick }: { memory: Memory; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-2xl p-4 shadow-sm border border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center size-9 rounded-xl bg-[#9D8BA7]/10 shrink-0 mt-0.5">
          {typeIcon(memory.type)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-foreground text-sm leading-snug truncate group-hover:text-[#9D8BA7] transition-colors">
            {memory.title}
          </h3>
          <p className="text-muted-foreground text-xs mt-1 line-clamp-2 leading-relaxed">
            {memory.content}
          </p>
          <div className="flex items-center justify-between mt-3 gap-2">
            <div className="flex items-center gap-1.5 overflow-hidden">
              {memory.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-[#9D8BA7]/10 text-[#9D8BA7] text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
              {formatDate(memory.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
})

const EmptyState = memo(function EmptyState({ collectionName }: { collectionName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-[#9D8BA7]/10 flex items-center justify-center mb-4">
        {collectionName ? (
          <FolderOpen className="size-8 text-[#9D8BA7]" />
        ) : (
          <Brain className="size-8 text-[#9D8BA7]" />
        )}
      </div>
      <h3 className="font-serif text-lg font-semibold text-foreground">
        {collectionName
          ? `No memories in ${collectionName} yet`
          : 'No memories here yet'}
      </h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
        {collectionName
          ? `Start capturing memories to this collection and they'll appear here. Tap the + button to add your first one.`
          : 'Start capturing to fill your second brain'}
      </p>
    </div>
  )
})

// ---------- FilterBar (memoized) ----------

const FilterBar = memo(function FilterBar() {
  const { activeFilter, setActiveFilter, collectionFilter, setCollectionFilter } = useAetherStore()

  const activeCollection = useMemo(
    () => (collectionFilter ? mockCollections.find((c) => c.id === collectionFilter) : null),
    [collectionFilter]
  )

  if (activeCollection) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCollectionFilter(null)}
          className="flex items-center gap-1.5 text-sm text-[#9D8BA7] hover:text-[#7A6B85] transition-colors font-medium"
        >
          <ArrowLeft className="size-4" />
          All memories
        </button>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 bg-[#9D8BA7]/10 text-[#9D8BA7] text-sm px-3 py-1.5 rounded-full font-medium">
          <FolderOpen className="size-3.5" />
          {activeCollection.name}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => setActiveFilter(f)}
          className={`text-sm px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
            activeFilter === f
              ? 'bg-[#9D8BA7] text-white shadow-sm'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
})

// ---------- Quick Capture Modal ----------

function QuickCaptureModal() {
  const {
    captureModalOpen,
    setCaptureModalOpen,
    activeCaptureTab,
    setActiveCaptureTab,
    addMemory,
    autoTagging,
  } = useAetherStore()

  const [textContent, setTextContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkPreview, setLinkPreview] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  const resetForm = useCallback(() => {
    setTextContent('')
    setIsRecording(false)
    setVoiceTranscript('')
    setLinkUrl('')
    setLinkPreview(false)
    setImagePreview(null)
    setIsSaving(false)
    setAudioChunks([])
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
    }
    setMediaRecorder(null)
  }, [mediaRecorder])

  const handleClose = () => {
    setCaptureModalOpen(false)
    resetForm()
  }

  // Generate AI tags based on content
  const generateTags = useCallback(async (content: string, type: string): Promise<string[]> => {
    if (!autoTagging || !content.trim()) {
      // Fallback tags
      switch (type) {
        case 'voice': return ['#voice', '#memo']
        case 'link': return ['#links', '#bookmark']
        case 'image': return ['#image', '#capture']
        default: return ['#notes']
      }
    }

    try {
      const res = await fetch('/api/ai/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type }),
      })
      const data = await res.json()
      return data.tags || ['#memory']
    } catch {
      // Fallback tags on error
      switch (type) {
        case 'voice': return ['#voice', '#memo']
        case 'link': return ['#links', '#bookmark']
        case 'image': return ['#image', '#capture']
        default: return ['#notes']
      }
    }
  }, [autoTagging])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    const id = `mem-${Date.now()}`
    let title = ''
    let content = ''
    let tags: string[] = []

    switch (activeCaptureTab) {
      case 'text':
        title = textContent.slice(0, 50) || 'Quick note'
        content = textContent
        break
      case 'voice':
        title = voiceTranscript
          ? voiceTranscript.slice(0, 50)
          : 'Voice memo'
        content = voiceTranscript || 'Recorded voice memo'
        break
      case 'link':
        title = linkUrl ? `Saved link` : 'Bookmark'
        content = linkUrl || 'Saved bookmark'
        break
      case 'image':
        title = 'Image capture'
        content = imagePreview
          ? 'Captured image'
          : 'Image saved'
        break
    }

    // Generate AI tags
    tags = await generateTags(content, activeCaptureTab)

    addMemory({
      id,
      type: activeCaptureTab,
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
      ...(activeCaptureTab === 'link' && linkUrl
        ? { source: linkUrl }
        : {}),
      ...(activeCaptureTab === 'image' && imagePreview
        ? { imagePreview }
        : {}),
    })

    setIsSaving(false)
    handleClose()
  }, [activeCaptureTab, textContent, voiceTranscript, linkUrl, imagePreview, generateTags, addMemory, handleClose])

  // Start voice recording with real MediaRecorder API
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunks, { type: 'audio/webm' })

        // Convert to base64 and send to ASR API
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1]
          if (base64Audio) {
            try {
              const res = await fetch('/api/ai/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audio: base64Audio }),
              })
              const data = await res.json()
              if (data.transcription) {
                setVoiceTranscript(data.transcription)
              } else {
                setVoiceTranscript('Voice memo recorded — transcription will be available shortly.')
              }
            } catch {
              setVoiceTranscript('Voice memo recorded — transcription will be available shortly.')
            }
          }
        }
        reader.readAsDataURL(blob)
        setAudioChunks([])
      }

      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      recorder.start()
      setIsRecording(true)
    } catch {
      // Fallback if mic permission denied
      setIsRecording(true)
      setTimeout(() => {
        setIsRecording(false)
        setVoiceTranscript('Voice memo recorded — microphone access needed for transcription.')
      }, 2000)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
    }
    setIsRecording(false)
  }, [mediaRecorder])

  const captureTabs: { key: typeof activeCaptureTab; icon: React.ReactNode; label: string }[] = [
    { key: 'text', icon: <FileText className="size-4" />, label: 'Text' },
    { key: 'voice', icon: <Mic className="size-4" />, label: 'Voice' },
    { key: 'link', icon: <Link2 className="size-4" />, label: 'Link' },
    { key: 'image', icon: <ImageIcon className="size-4" />, label: 'Image' },
  ]

  if (!captureModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-card rounded-2xl max-w-lg w-full mx-4 overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Quick Capture
          </h2>
          <button
            onClick={handleClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 pb-3">
          {captureTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCaptureTab(tab.key)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all duration-200 ${
                activeCaptureTab === tab.key
                  ? 'bg-[#9D8BA7] text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-5 pb-4 min-h-[220px]">
          {/* Text */}
          {activeCaptureTab === 'text' && (
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-36 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#9D8BA7]/30 transition-shadow"
            />
          )}

          {/* Voice */}
          {activeCaptureTab === 'voice' && (
            <div className="flex flex-col items-center py-4">
              <button
                onClick={() => {
                  if (!isRecording) {
                    startRecording()
                  } else {
                    stopRecording()
                  }
                }}
                className={`size-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                    : 'bg-[#9D8BA7]/10 text-[#9D8BA7] hover:bg-[#9D8BA7]/20'
                }`}
              >
                <Mic className="size-7" />
              </button>

              {isRecording && (
                <p className="text-sm text-red-500 mt-3 font-medium">
                  Recording... tap to stop
                </p>
              )}

              {!isRecording && !voiceTranscript && (
                <p className="text-sm text-muted-foreground mt-3">
                  Tap to start recording
                </p>
              )}

              {voiceTranscript && !isRecording && (
                <div className="mt-4 w-full rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground mb-1">Transcription</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {voiceTranscript}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Link */}
          {activeCaptureTab === 'link' && (
            <div>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => {
                  setLinkUrl(e.target.value)
                  setLinkPreview(e.target.value.length > 5)
                }}
                placeholder="Paste any link..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#9D8BA7]/30 transition-shadow"
              />

              {linkPreview && linkUrl.length > 5 && (
                <div className="mt-3 rounded-xl border border-border bg-background p-3 flex gap-3">
                  <div className="size-14 rounded-lg bg-[#9D8BA7]/10 flex items-center justify-center shrink-0">
                    <Link2 className="size-5 text-[#9D8BA7]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      Article Preview
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      A preview of the content from the link you saved. The full
                      article will be summarized and tagged automatically.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image */}
          {activeCaptureTab === 'image' && (
            <div>
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed border-border bg-background cursor-pointer hover:border-[#9D8BA7]/40 transition-colors">
                  <Upload className="size-8 text-[#9D8BA7]/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drop an image or click to upload
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={() => {
                      setImagePreview('mock')
                    }}
                  />
                </label>
              ) : (
                <div className="relative h-36 rounded-xl bg-gradient-to-br from-[#9D8BA7]/20 to-[#9D8BA7]/5 flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon className="size-10 text-[#9D8BA7]/40" />
                    <p className="text-xs text-[#9D8BA7]/60">Image uploaded</p>
                  </div>
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 size-6 rounded-full bg-card/80 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="px-5 pb-5">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[#9D8BA7] hover:bg-[#7A6B85] text-white rounded-xl h-11 text-sm font-medium transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Saving & tagging...
              </>
            ) : (
              <>
                <Plus className="size-4 mr-1" />
                Save Memory
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------- main Dashboard ----------

export default function Dashboard() {
  const { memories, activeFilter, collectionFilter, setSelectedMemoryId, setCurrentView } = useAetherStore()

  // Get the active collection name for empty state messaging
  const activeCollection = useMemo(
    () => (collectionFilter ? mockCollections.find((c) => c.id === collectionFilter) : null),
    [collectionFilter]
  )

  // Filter and sort memories (memoized)
  const sortedMemories = useMemo(() => {
    const filterType = FILTER_MAP[activeFilter]
    let filtered = filterType
      ? memories.filter((m) => m.type === filterType)
      : memories

    if (collectionFilter) {
      filtered = filtered.filter((m) => m.collectionId === collectionFilter)
    }

    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [memories, activeFilter, collectionFilter])

  const handleMemoryClick = useCallback((id: string) => {
    setSelectedMemoryId(id)
    setCurrentView('memory-detail')
  }, [setSelectedMemoryId, setCurrentView])

  return (
    <div className="flex flex-col h-full">
      {/* Filter Bar */}
      <div className="shrink-0 pb-4">
        <FilterBar />
      </div>

      {/* Memory Feed */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar">
        {sortedMemories.length > 0 ? (
          <div className="flex flex-col gap-3 pb-4">
            {sortedMemories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onClick={() => handleMemoryClick(memory.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState collectionName={activeCollection?.name} />
        )}
      </div>

      {/* Quick Capture Modal */}
      <QuickCaptureModal />
    </div>
  )
}
