'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, CheckCircle2, Circle, Calendar, TrendingUp, Clock, Sparkles, Mic, Link2, Image as ImageIcon, FileText } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useAetherStore } from '@/store/aether-store'

const mockTasks = [
  { id: 't1', text: 'Review Q2 product roadmap notes', completed: true },
  { id: 't2', text: 'Follow up with Sarah about book recommendation', completed: false },
  { id: 't3', text: 'Research fintech micro-lending platforms', completed: false },
]

const weekDays = [
  { day: 'Mon', activity: 3, memories: 3 },
  { day: 'Tue', activity: 5, memories: 5 },
  { day: 'Wed', activity: 7, memories: 7, isHighlight: true },
  { day: 'Thu', activity: 4, memories: 4 },
  { day: 'Fri', activity: 2, memories: 2 },
  { day: 'Sat', activity: 1, memories: 1 },
  { day: 'Sun', activity: 0, memories: 0 },
]

const topThemes = [
  { name: '#startup', count: 3 },
  { name: '#ideas', count: 4 },
  { name: '#work', count: 5 },
  { name: '#ai', count: 2 },
]

const nostalgicMemory = {
  title: 'First whiteboard session of the year',
  content: 'Kicked off January with a brainstorm about the new product direction. The energy in the room was electric — everyone excited about the AI-powered features roadmap.',
  date: 'Dec 15, 2024',
}

export function Recaps() {
  const { recapView, setRecapView, memories } = useAetherStore()
  const [tasks, setTasks] = useState(mockTasks)

  const today = new Date()
  const todayStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const recentMemories = memories.slice(0, 4)

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    )
  }

  const maxActivity = Math.max(...weekDays.map((d) => d.activity), 1)

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
              Recaps
            </h1>
            <p className="text-sm mt-1 text-muted-foreground">
              Your memory at a glance
            </p>
          </div>

          {/* Toggle */}
          <div
            className="flex rounded-full p-1 bg-[#9D8BA7]/10"
          >
            <button
              onClick={() => setRecapView('daily')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                recapView === 'daily'
                  ? 'shadow-sm bg-[#9D8BA7] text-white'
                  : 'text-foreground'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setRecapView('weekly')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                recapView === 'weekly'
                  ? 'shadow-sm bg-[#9D8BA7] text-white'
                  : 'text-foreground'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {recapView === 'daily' ? (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Today's Brief Card */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-1">
                <Calendar className="size-5" style={{ color: '#9D8BA7' }} />
                <h2
                  className="text-lg font-bold text-foreground"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Today&apos;s Brief
                </h2>
              </div>
              <p className="text-sm ml-8 text-muted-foreground">
                {todayStr}
              </p>
            </div>

            {/* Key Memories */}
            <div>
              <h3
                className="text-lg font-bold mb-3 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Key Memories
              </h3>
              <div className="space-y-3">
                {recentMemories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.25 }}
                    className="bg-card rounded-2xl p-4 shadow-sm border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="size-8 rounded-lg flex items-center justify-center shrink-0 bg-[#9D8BA7]/12"
                      >
                        {memory.type === 'voice' ? <Mic className="size-4" style={{ color: '#9D8BA7' }} /> : memory.type === 'link' ? <Link2 className="size-4" style={{ color: '#9D8BA7' }} /> : memory.type === 'image' ? <ImageIcon className="size-4" style={{ color: '#9D8BA7' }} /> : <FileText className="size-4" style={{ color: '#9D8BA7' }} />}
                      </div>
                      <div className="min-w-0">
                        <h4
                          className="font-semibold text-sm truncate text-foreground"
                        >
                          {memory.title}
                        </h4>
                        <p
                          className="text-xs mt-0.5 line-clamp-2 text-muted-foreground"
                        >
                          {memory.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tasks Extracted */}
            <div>
              <h3
                className="text-lg font-bold mb-3 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Tasks Extracted
              </h3>
              <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="shrink-0"
                    />
                    <span
                      className={`text-sm transition-all text-foreground ${
                        task.completed ? 'line-through opacity-50' : ''
                      }`}
                    >
                      {task.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Insight Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="bg-card rounded-2xl p-5 shadow-sm border-l-4"
              style={{ borderLeftColor: '#9D8BA7' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-[#9D8BA7]/12"
                >
                  <Brain className="size-5" style={{ color: '#9D8BA7' }} />
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm mb-1"
                    style={{ color: '#9D8BA7' }}
                  >
                    AI Insight
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground">
                    You saved 4 ideas about your startup today — you seem to be in a
                    creative flow. This is your most productive day this week for idea
                    generation.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="weekly"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Week Overview Timeline */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h2
                className="text-lg font-bold mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Week Overview
              </h2>
              <div className="flex items-end justify-between gap-2 sm:gap-4">
                {weekDays.map((d) => (
                  <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                    <span
                      className={`text-xs font-medium ${d.isHighlight ? 'text-[#9D8BA7]' : 'text-muted-foreground'}`}
                    >
                      {d.memories}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((d.activity / maxActivity) * 80, 4)}px` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="w-full rounded-t-lg"
                      style={{
                        backgroundColor: d.isHighlight
                          ? '#9D8BA7'
                          : 'rgba(157, 139, 167, 0.2)',
                        maxWidth: 40,
                      }}
                    />
                    <span
                      className={`text-xs font-medium ${d.isHighlight ? 'font-bold text-[#9D8BA7]' : 'text-muted-foreground'}`}
                    >
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Themes */}
            <div>
              <h3
                className="text-lg font-bold mb-3 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Top Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {topThemes.map((theme) => (
                  <span
                    key={theme.name}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#9D8BA7]/10 text-foreground"
                  >
                    {theme.name}
                    <span className="ml-1 opacity-50">({theme.count})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Most Active Day */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border"
            >
              <div className="flex items-start gap-3">
                <div
                  className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-[#9D8BA7]/12"
                >
                  <TrendingUp className="size-5" style={{ color: '#9D8BA7' }} />
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm mb-0.5"
                    style={{ color: '#9D8BA7' }}
                  >
                    Most Active Day
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground">
                    Wednesday was your most productive day with 7 memories
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Memory Lane */}
            <div>
              <h3
                className="text-lg font-bold mb-3 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <Sparkles className="inline size-5 mr-1.5 -mt-0.5" style={{ color: '#9D8BA7' }} />
                Memory Lane
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="bg-card rounded-2xl p-5 shadow-sm border border-border"
              >
                <p className="text-xs mb-2 font-medium" style={{ color: '#9D8BA7' }}>
                  One month ago today...
                </p>
                <h4
                  className="font-bold text-sm mb-1 text-foreground"
                >
                  {nostalgicMemory.title}
                </h4>
                <p
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {nostalgicMemory.content}
                </p>
                <p
                  className="text-xs mt-2 flex items-center gap-1 text-muted-foreground"
                >
                  <Clock className="size-3" />
                  {nostalgicMemory.date}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
