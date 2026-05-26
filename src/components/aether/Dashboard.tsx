'use client'

import { useState, useCallback, useMemo, memo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, FileText, Link2, ImageIcon, X, Upload, Plus, Brain, ArrowLeft, FolderOpen, Loader2, Eye, Sparkles, CheckSquare, Square, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAetherStore } from '@/store/aether-store'
import { createMemory, getMemoryCount } from '@/lib/supabase/data'
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
  const { setCaptureModalOpen } = useAetherStore()

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Animated brain icon with pulse ring */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-[#9D8BA7]/20 animate-ping opacity-20" />
        <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-[#9D8BA7]/15 to-[#9D8BA7]/5 flex items-center justify-center ring-4 ring-[#9D8BA7]/10">
          {collectionName ? (
            <FolderOpen className="size-9 text-[#9D8BA7]" />
          ) : (
            <Brain className="size-9 text-[#9D8BA7]" />
          )}
        </div>
      </div>

      <h3 className="font-serif text-xl font-semibold text-foreground">
        {collectionName
          ? `No memories in ${collectionName} yet`
          : 'Your second brain is empty'}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
        {collectionName
          ? `Start capturing memories to this collection and they'll appear here.`
          : 'Start capturing your first memory — ideas, notes, links, anything you want to remember.'}
      </p>

      {/* Prominent CTA button for new users */}
      {!collectionName && (
        <button
          onClick={() => setCaptureModalOpen(true)}
          className="mt-6 inline-flex items-center gap-2 bg-[#9D8BA7] hover:bg-[#7A6B85] text-white rounded-xl px-6 py-3 text-sm font-semibold shadow-lg shadow-[#9D8BA7]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#9D8BA7]/30 hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          Add Your First Memory
        </button>
      )}
    </div>
  )
})

// ---------- FilterBar (memoized) ----------

const FilterBar = memo(function FilterBar() {
  const { activeFilter, setActiveFilter, collectionFilter, setCollectionFilter, collections } = useAetherStore()

  const activeCollection = useMemo(
    () => (collectionFilter ? collections.find((c) => c.id === collectionFilter) : null),
    [collectionFilter, collections]
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
    user,
  } = useAetherStore()

  const [textContent, setTextContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [voiceSummary, setVoiceSummary] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkPreview, setLinkPreview] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageDescription, setImageDescription] = useState('')
  const [imageTags, setImageTags] = useState<string[]>([])
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = useCallback(() => {
    setTextContent('')
    setIsRecording(false)
    setVoiceTranscript('')
    setVoiceSummary('')
    setLinkUrl('')
    setLinkPreview(false)
    setImagePreview(null)
    setImageBase64(null)
    setImageDescription('')
    setImageTags([])
    setIsAnalyzingImage(false)
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

  // Generate AI tags based on content (for text, voice, link)
  const generateTags = useCallback(async (
    content: string,
    type: string,
    summary?: string,
    imgDescription?: string,
  ): Promise<string[]> => {
    if (!autoTagging || !content.trim()) {
      // Smarter fallback tags based on content keywords
      return getSmartFallbackTags(content, type)
    }

    try {
      const res = await fetch('/api/ai/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          type,
          ...(summary ? { summary } : {}),
          ...(imgDescription ? { imageDescription: imgDescription } : {}),
        }),
      })
      const data = await res.json()
      return data.tags || ['#memory']
    } catch {
      return getSmartFallbackTags(content, type)
    }
  }, [autoTagging])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    const id = `mem-${Date.now()}`
    let title = ''
    let content = ''
    let tags: string[] = []
    let aiSummary: string | undefined

    switch (activeCaptureTab) {
      case 'text':
        title = textContent.slice(0, 50) || 'Quick note'
        content = textContent
        tags = await generateTags(content, 'text')
        break

      case 'voice':
        title = voiceTranscript
          ? voiceTranscript.slice(0, 50)
          : 'Voice memo'
        content = voiceTranscript || 'Recorded voice memo'
        // Pass the summary to generate tags based on what was actually said
        tags = await generateTags(content, 'voice', voiceSummary || undefined)
        // Use the AI summary from transcription if available
        if (voiceSummary) {
          aiSummary = voiceSummary
        }
        break

      case 'link':
        title = linkUrl ? `Saved link` : 'Bookmark'
        content = linkUrl || 'Saved bookmark'
        tags = await generateTags(content, 'link')
        break

      case 'image':
        // For images, use the VLM-generated description and tags
        if (imageDescription && imageTags.length > 0) {
          title = imageDescription.slice(0, 50) || 'Image capture'
          content = imageDescription
          tags = imageTags
        } else if (imageDescription) {
          title = imageDescription.slice(0, 50) || 'Image capture'
          content = imageDescription
          tags = await generateTags(content, 'image', undefined, imageDescription)
        } else {
          title = 'Image capture'
          content = 'Captured image'
          tags = await generateTags('Captured image', 'image')
        }
        if (imageDescription) {
          aiSummary = `AI detected: ${imageDescription}`
        }
        break
    }

    // Check free tier limit before creating
    try {
      if (user?.plan === 'free') {
        const count = await getMemoryCount()
        if (count >= 50) {
          setIsSaving(false)
          setShowUpgradeDialog(true)
          return
        }
      }

      const returnedMemory = await createMemory({
        type: activeCaptureTab,
        title,
        content,
        tags,
        ...(aiSummary ? { summary: aiSummary } : {}),
        ...(activeCaptureTab === 'link' && linkUrl
          ? { sourceUrl: linkUrl }
          : {}),
        ...(activeCaptureTab === 'image' && imagePreview
          ? { imagePreview }
          : {}),
      })

      addMemory(returnedMemory)
    } catch (error: any) {
      // If the error is about limits from Supabase, show upgrade dialog
      if (error?.message?.toLowerCase().includes('limit') || error?.message?.toLowerCase().includes('quota')) {
        setShowUpgradeDialog(true)
      }
      // Otherwise, fall back to local-only save so the user doesn't lose their data
      else {
        addMemory({
          id,
          type: activeCaptureTab,
          title,
          content,
          tags,
          createdAt: new Date().toISOString(),
          ...(aiSummary ? { aiSummary } : {}),
          ...(activeCaptureTab === 'link' && linkUrl
            ? { source: linkUrl }
            : {}),
          ...(activeCaptureTab === 'image' && imagePreview
            ? { imagePreview }
            : {}),
        })
      }
    }

    setIsSaving(false)
    handleClose()
  }, [activeCaptureTab, textContent, voiceTranscript, voiceSummary, linkUrl, imagePreview, imageDescription, imageTags, generateTags, addMemory, handleClose, user])

  // Handle image file selection — actually read and analyze the image
  const handleImageUpload = useCallback(async (file: File) => {
    // Read the image for preview and base64
    const reader = new FileReader()
    reader.onloadend = async () => {
      const dataUrl = reader.result as string
      setImagePreview(dataUrl)

      // Extract base64 for API calls
      const base64 = dataUrl.split(',')[1]
      if (base64) {
        setImageBase64(base64)
        setIsAnalyzingImage(true)

        try {
          // Call the VLM image analysis endpoint
          const res = await fetch('/api/ai/analyze-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: dataUrl }),
          })
          const data = await res.json()

          if (data.description) {
            setImageDescription(data.description)
          }
          if (data.tags && data.tags.length > 0) {
            setImageTags(data.tags)
          }
        } catch (error) {
          console.error('Image analysis failed:', error)
          setImageDescription('')
          setImageTags([])
        } finally {
          setIsAnalyzingImage(false)
        }
      }
    }
    reader.readAsDataURL(file)
  }, [])

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
              // Capture the summary for use in tag generation and memory creation
              if (data.summary) {
                setVoiceSummary(data.summary)
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
    <>
      {/* Upgrade Dialog */}
      <AnimatePresence>
        {showUpgradeDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUpgradeDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-card rounded-3xl max-w-sm w-full mx-4 overflow-hidden shadow-2xl border border-[#9D8BA7]/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top accent */}
              <div className="h-1.5 bg-gradient-to-r from-[#9D8BA7] to-[#C4B5CE]" />

              <div className="p-6 text-center">
                {/* Icon */}
                <div className="mx-auto size-16 rounded-2xl bg-[#9D8BA7]/10 flex items-center justify-center mb-4">
                  <Sparkles className="size-8 text-[#9D8BA7]" />
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  You've reached your Seed plan limit
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  50 memories saved! Upgrade to <span className="font-semibold text-[#9D8BA7]">Bloom</span> for unlimited memories, advanced AI insights, and more.
                </p>

                {/* Upgrade button */}
                <button
                  className="w-full bg-[#9D8BA7] hover:bg-[#8A7A96] text-white rounded-xl h-11 text-sm font-semibold transition-colors mb-3"
                  onClick={() => {
                    setShowUpgradeDialog(false)
                    // TODO: Navigate to upgrade flow
                  }}
                >
                  Upgrade to Bloom
                </button>

                {/* Dismiss button */}
                <button
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setShowUpgradeDialog(false)}
                >
                  Not now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capture Modal */}
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
                <div className="mt-4 w-full space-y-2">
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground mb-1">Transcription</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {voiceTranscript}
                    </p>
                  </div>
                  {voiceSummary && (
                    <div className="rounded-xl border border-[#9D8BA7]/20 bg-[#9D8BA7]/5 p-3">
                      <p className="text-xs text-[#9D8BA7] font-medium mb-1">AI Summary</p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {voiceSummary}
                      </p>
                    </div>
                  )}
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
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(file)
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden">
                  {/* Show the actual image preview */}
                  <img
                    src={imagePreview}
                    alt="Uploaded image preview"
                    className="w-full h-36 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null)
                      setImageBase64(null)
                      setImageDescription('')
                      setImageTags([])
                    }}
                    className="absolute top-2 right-2 size-6 rounded-full bg-card/80 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="size-3" />
                  </button>

                  {/* AI analysis overlay */}
                  {isAnalyzingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 text-white animate-spin" />
                      <p className="text-xs text-white font-medium">Analyzing image...</p>
                    </div>
                  )}

                  {/* Show AI analysis results */}
                  {!isAnalyzingImage && imageDescription && (
                    <div className="mt-2 rounded-xl border border-[#9D8BA7]/20 bg-[#9D8BA7]/5 p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Eye className="size-3.5 text-[#9D8BA7]" />
                        <p className="text-xs text-[#9D8BA7] font-medium">AI Analysis</p>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {imageDescription}
                      </p>
                      {imageTags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {imageTags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-[#9D8BA7]/10 text-[#9D8BA7] text-[10px] px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="px-5 pb-5">
          <Button
            onClick={handleSave}
            disabled={isSaving || isAnalyzingImage}
            className="w-full bg-[#9D8BA7] hover:bg-[#7A6B85] text-white rounded-xl h-11 text-sm font-medium transition-colors"
          >
            {isSaving || isAnalyzingImage ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {isAnalyzingImage ? 'Analyzing image...' : 'Saving & tagging...'}
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
    </>
  )
}

// ---------- Smart fallback tags based on content keywords ----------

function getSmartFallbackTags(content: string, type: string): string[] {
  const lower = content.toLowerCase()
  const tags: string[] = []

  const topicMap: Record<string, string[]> = {
    cafe: ['#cafe', '#food'],
    coffee: ['#coffee', '#food'],
    restaurant: ['#restaurant', '#food'],
    lunch: ['#food', '#lunch'],
    dinner: ['#food', '#dinner'],
    breakfast: ['#food', '#breakfast'],
    meeting: ['#meeting', '#work'],
    project: ['#project', '#work'],
    code: ['#code', '#programming'],
    programming: ['#programming', '#tech'],
    book: ['#books', '#reading'],
    recipe: ['#recipe', '#food', '#cooking'],
    travel: ['#travel'],
    trip: ['#travel'],
    idea: ['#idea', '#creativity'],
    workout: ['#fitness', '#health'],
    gym: ['#fitness', '#health'],
    movie: ['#movies', '#entertainment'],
    music: ['#music'],
    shopping: ['#shopping'],
    budget: ['#finance', '#budgeting'],
    money: ['#finance'],
    doctor: ['#health', '#medical'],
    family: ['#family'],
    friend: ['#social', '#friends'],
    party: ['#social', '#events'],
    school: ['#education', '#learning'],
    study: ['#education', '#study'],
    design: ['#design', '#creative'],
    ai: ['#ai', '#technology'],
    startup: ['#startup', '#business'],
    product: ['#product', '#business'],
  }

  for (const [keyword, tagList] of Object.entries(topicMap)) {
    if (lower.includes(keyword) && tags.length < 4) {
      for (const tag of tagList) {
        if (!tags.includes(tag) && tags.length < 4) {
          tags.push(tag)
        }
      }
    }
  }

  // Type-specific fallbacks only if no content-based tags were found
  if (tags.length === 0) {
    switch (type) {
      case 'voice':
        return ['#spoken', '#memo']
      case 'link':
        return ['#bookmark', '#saved']
      case 'image':
        return ['#visual', '#capture']
      default:
        return ['#memory']
    }
  }

  return tags
}

// ---------- main Dashboard ----------

export default function Dashboard() {
  const { memories, activeFilter, collectionFilter, setSelectedMemoryId, setCurrentView, collections, searchQuery, setSearchQuery } = useAetherStore()
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  // Get the active collection name for empty state messaging
  const activeCollection = useMemo(
    () => (collectionFilter ? collections.find((c) => c.id === collectionFilter) : null),
    [collectionFilter, collections]
  )

  // Extract actionable tasks from memory content
  const extractedTasks = useMemo(() => {
    const taskPatterns = [
      /(?:i\s+)?need\s+to\s+(.+?)(?:\.|$)/gi,
      /(?:i\s+)?should\s+(.+?)(?:\.|$)/gi,
      /(?:i\s+)?must\s+(.+?)(?:\.|$)/gi,
      /(?:i\s+)?have\s+to\s+(.+?)(?:\.|$)/gi,
      /todo:?\s*(.+?)(?:\.|$)/gi,
      /follow\s+up\s+(?:with\s+)?(.+?)(?:\.|$)/gi,
      /(?:don't\s+)?forget\s+(?:to\s+)?(.+?)(?:\.|$)/gi,
      /remind\s+me\s+(?:to\s+)?(.+?)(?:\.|$)/gi,
    ]
    const tasks: { id: string; text: string; memoryId: string; memoryTitle: string }[] = []

    for (const mem of memories) {
      const content = mem.content || ''
      for (const pattern of taskPatterns) {
        pattern.lastIndex = 0
        let match
        while ((match = pattern.exec(content)) !== null && tasks.length < 8) {
          const text = match[1].trim()
          if (text.length >= 5) {
            const id = `task-${mem.id}-${tasks.length}`
            // Avoid duplicates
            if (!tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
              tasks.push({
                id,
                text: text.charAt(0).toUpperCase() + text.slice(1),
                memoryId: mem.id,
                memoryTitle: mem.title,
              })
            }
          }
        }
      }
    }
    return tasks
  }, [memories])

  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) next.delete(taskId)
      else next.add(taskId)
      return next
    })
  }, [])

  // Filter and sort memories (memoized)
  const sortedMemories = useMemo(() => {
    const filterType = FILTER_MAP[activeFilter]
    let filtered = filterType
      ? memories.filter((m) => m.type === filterType)
      : memories

    if (collectionFilter) {
      filtered = filtered.filter((m) => m.collectionId === collectionFilter)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [memories, activeFilter, collectionFilter, searchQuery])

  const handleMemoryClick = useCallback((id: string) => {
    setSelectedMemoryId(id)
    setCurrentView('memory-detail')
  }, [setSelectedMemoryId, setCurrentView])

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="shrink-0 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#9D8BA7]/30 focus:ring-2 focus:ring-[#9D8BA7]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="shrink-0 pb-4">
        <FilterBar />
      </div>

      {/* Extracted Tasks Section */}
      {extractedTasks.length > 0 && (
        <div className="shrink-0 mb-4">
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="size-4 text-[#9D8BA7]" />
              <h3 className="text-sm font-semibold text-foreground">Extracted Tasks</h3>
              <span className="text-xs text-muted-foreground ml-auto">
                {completedTasks.size}/{extractedTasks.length} done
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {extractedTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-start gap-2.5 text-left group"
                >
                  {completedTasks.has(task.id) ? (
                    <CheckSquare className="size-4 text-[#9D8BA7] shrink-0 mt-0.5" />
                  ) : (
                    <Square className="size-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-[#9D8BA7] transition-colors" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm leading-relaxed transition-colors ${completedTasks.has(task.id) ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.text}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">from: {task.memoryTitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
