'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Send,
  Mic,
  FileText,
  Mic as MicIcon,
  Link2,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAetherStore } from '@/store/aether-store'
import { mockAiResponses } from '@/components/aether/mock-data'
import type { ChatMessage, MemoryType } from '@/components/aether/types'

const starterQuestions = [
  'What ideas did I save this week?',
  'What was that book recommendation?',
  'Show me everything about my travel plans',
]

const typeIconMap: Record<MemoryType, typeof FileText> = {
  text: FileText,
  voice: MicIcon,
  link: Link2,
  image: ImageIcon,
}

/* ─────────── Typing Indicator ─────────── */
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-card rounded-2xl rounded-bl-md px-5 py-3.5 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#9D8BA7] to-[#6D597A] flex items-center justify-center">
            <Brain size={10} className="text-white" />
          </div>
          <span className="text-[10px] font-semibold text-[#9D8BA7] uppercase tracking-wider">
            Aether
          </span>
        </div>
        <div className="flex items-center gap-1.5 py-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-[#9D8BA7]/40"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────── Inline Memory Card (in chat) ─────────── */
function InlineMemoryCard({ memory }: { memory: { id: string; title: string; content: string; type: MemoryType } }) {
  const Icon = typeIconMap[memory.type]
  return (
    <div className="rounded-xl border border-border bg-background p-3 mt-2 hover:border-[#9D8BA7]/20 transition-all duration-300">
      <div className="flex items-start gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-[#9D8BA7]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={13} className="text-[#9D8BA7]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{memory.title}</p>
          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">{memory.content}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Chat Message Bubble ─────────── */
function ChatBubble({
  message,
  memories,
}: {
  message: ChatMessage
  memories: { id: string; title: string; content: string; type: MemoryType }[]
}) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex justify-end"
      >
        <div className="bg-[#9D8BA7] text-white rounded-2xl rounded-br-md px-5 py-3 max-w-[85%] sm:max-w-[70%] shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </motion.div>
    )
  }

  // Assistant message
  const referencedMems = message.referencedMemories
    ? memories.filter((m) => message.referencedMemories?.includes(m.id))
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex justify-start"
    >
      <div className="bg-card rounded-2xl rounded-bl-md px-5 py-4 max-w-[90%] sm:max-w-[80%] border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#9D8BA7] to-[#6D597A] flex items-center justify-center">
            <Brain size={12} className="text-white" />
          </div>
          <span className="text-[10px] font-semibold text-[#9D8BA7] uppercase tracking-wider">
            Aether
          </span>
        </div>

        {/* Answer text */}
        <p className="text-sm text-foreground leading-relaxed">{message.content}</p>

        {/* Referenced memories */}
        {referencedMems.length > 0 && (
          <div className="mt-3 space-y-2">
            {referencedMems.map((mem) => (
              <InlineMemoryCard key={mem.id} memory={mem} />
            ))}
          </div>
        )}

        {/* Sources tag */}
        {message.sourcesCount && message.sourcesCount > 0 && (
          <div className="mt-3 pt-2 border-t border-border">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#9D8BA7]/70">
              <FileText size={10} />
              Sources: {message.sourcesCount} memories
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─────────── Ask Aether ─────────── */
export function AskAether() {
  const { chatMessages, addChatMessage, isChatThinking, setChatThinking, memories } = useAetherStore()
  const [input, setInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Memoize the memory list for lookup
  const memoryLookup = useMemo(
    () =>
      memories.map((m) => ({
        id: m.id,
        title: m.title,
        content: m.content,
        type: m.type,
      })),
    [memories]
  )

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isChatThinking])

  const processMessage = (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }
    addChatMessage(userMsg)
    setInput('')

    // Determine response key
    const lower = text.toLowerCase()
    let responseKey = 'default'
    if (lower.includes('idea')) responseKey = 'ideas'
    else if (lower.includes('book')) responseKey = 'book'
    else if (lower.includes('travel')) responseKey = 'travel'

    const mockResponse = mockAiResponses[responseKey]

    // Simulate thinking
    setChatThinking(true)
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: mockResponse.answer,
        referencedMemories: mockResponse.referencedIds,
        sourcesCount: mockResponse.sources,
        timestamp: new Date().toISOString(),
      }
      addChatMessage(assistantMsg)
      setChatThinking(false)
    }, 1500)
  }

  const handleSend = () => {
    processMessage(input)
  }

  const handleStarterClick = (question: string) => {
    processMessage(question)
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 sm:px-6 pt-6 pb-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <motion.div
              className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#9D8BA7] to-[#6D597A] flex items-center justify-center shadow-lg shadow-[#9D8BA7]/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Brain size={20} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Ask Aether</h1>
              <p className="text-xs text-muted-foreground">
                Ask anything about your memories in natural language
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Starter questions — only show when no messages */}
          {chatMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <p className="text-center text-sm text-muted-foreground mb-2">Try asking...</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                {starterQuestions.map((question, i) => (
                  <motion.button
                    key={question}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                    onClick={() => handleStarterClick(question)}
                    className="text-left px-4 py-3 rounded-2xl border border-[#9D8BA7]/15 bg-card text-sm text-foreground hover:bg-[#9D8BA7]/5 hover:border-[#9D8BA7]/30 transition-all duration-300 group shadow-sm"
                  >
                    <span className="text-[#9D8BA7] mr-1.5">&ldquo;</span>
                    {question.replace(/^"|"$/g, '')}
                    <span className="text-[#9D8BA7] ml-1">&rdquo;</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat messages */}
          <AnimatePresence mode="popLayout">
            {chatMessages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} memories={memoryLookup} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isChatThinking && <TypingIndicator />}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* ── Input Bar ── */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask Aether anything..."
                disabled={isChatThinking}
                className="w-full bg-background rounded-2xl border border-border px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#9D8BA7]/30 focus:ring-2 focus:ring-[#9D8BA7]/10 transition-all duration-300 disabled:opacity-50 shadow-sm"
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isChatThinking}
              size="icon"
              className="h-11 w-11 rounded-2xl bg-[#9D8BA7] hover:bg-[#6D597A] text-white shadow-lg shadow-[#9D8BA7]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#9D8BA7]/30 disabled:opacity-40 disabled:shadow-none"
            >
              <Send size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-2xl border-border text-muted-foreground hover:text-[#9D8BA7] hover:border-[#9D8BA7]/20 hover:bg-[#9D8BA7]/5 transition-all duration-300"
            >
              <Mic size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
