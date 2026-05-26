'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Moon,
  Cpu,
  Sparkles,
  Crown,
  Download,
  Trash2,
  Check,
  X,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAetherStore } from '@/store/aether-store'
import { useToast } from '@/hooks/use-toast'
import type { CaptureTab } from './types'

export function Settings() {
  const {
    dailySummary,
    setDailySummary,
    weeklyRecap,
    setWeeklyRecap,
    autoTagging,
    setAutoTagging,
    defaultCapture,
    setDefaultCapture,
    darkMode,
    setDarkMode,
    profile,
    setProfile,
    memories,
  } = useAetherStore()

  const { toast } = useToast()

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile.name)
  const [editEmail, setEditEmail] = useState(profile.email)

  // Export loading state
  const [isExporting, setIsExporting] = useState(false)

  // ──── Profile handlers ────
  const handleEditStart = () => {
    setEditName(profile.name)
    setEditEmail(profile.email)
    setIsEditing(true)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditName(profile.name)
    setEditEmail(profile.email)
  }

  const handleEditSave = () => {
    const trimmedName = editName.trim()
    const trimmedEmail = editEmail.trim()
    if (!trimmedName || !trimmedEmail) return

    // Compute initials from name
    const parts = trimmedName.split(' ')
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : trimmedName.slice(0, 2).toUpperCase()

    setProfile({ name: trimmedName, email: trimmedEmail, initials })
    setIsEditing(false)
    toast({ title: 'Profile updated!', description: 'Your changes have been saved.' })
  }

  // ──── Dark mode handler ────
  const handleDarkModeToggle = useCallback((enabled: boolean) => {
    setDarkMode(enabled)
    if (enabled) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [setDarkMode])

  // ──── Export handler ────
  const handleExport = useCallback(() => {
    setIsExporting(true)

    // Simulate a brief processing delay for UX
    setTimeout(() => {
      const exportData = memories.map((m) => ({
        id: m.id,
        type: m.type,
        title: m.title,
        content: m.content,
        tags: m.tags,
        createdAt: m.createdAt,
        ...(m.source ? { source: m.source } : {}),
        ...(m.aiSummary ? { aiSummary: m.aiSummary } : {}),
        ...(m.collectionId ? { collectionId: m.collectionId } : {}),
      }))

      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `aether-memories-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setIsExporting(false)
      toast({
        title: 'Export complete!',
        description: `${memories.length} memories exported as JSON.`,
      })
    }, 800)
  }, [memories, toast])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
            Settings
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Manage your Aether experience
          </p>
        </div>

        <div className="space-y-6">
          {/* ── Profile Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            {isEditing ? (
              /* ── Edit Mode ── */
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="size-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 bg-[#9D8BA7]">
                    {editName.trim().split(' ').length >= 2
                      ? (editName.trim().split(' ')[0][0] + editName.trim().split(' ').pop()![0]).toUpperCase()
                      : editName.trim().slice(0, 2).toUpperCase() || 'AJ'
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Edit Profile</p>
                    <p className="text-xs text-muted-foreground">Update your name and email</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">
                    Name
                  </label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your name"
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditCancel}
                    className="rounded-xl"
                  >
                    <X className="size-3.5 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleEditSave}
                    disabled={!editName.trim() || !editEmail.trim()}
                    className="rounded-xl bg-[#9D8BA7] hover:bg-[#7A6B85] text-white"
                  >
                    <Check className="size-3.5 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              /* ── View Mode ── */
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 bg-[#9D8BA7]">
                  {profile.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-foreground">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditStart}
                  className="ml-auto rounded-full text-xs text-[#9D8BA7] hover:text-[#7A6B85] hover:bg-[#9D8BA7]/5"
                >
                  Edit
                </Button>
              </div>
            )}
          </motion.div>

          {/* ── Preferences Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.25 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-foreground">
              <Bell className="size-4 text-[#9D8BA7]" />
              Preferences
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Daily summary notifications
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    Get a recap of your day&apos;s memories
                  </p>
                </div>
                <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Weekly recap email
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    Receive a weekly digest every Sunday
                  </p>
                </div>
                <Switch checked={weeklyRecap} onCheckedChange={setWeeklyRecap} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Dark mode
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    Switch between light and dark theme
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
            </div>
          </motion.div>

          {/* ── Memory Preferences ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-foreground">
              <Cpu className="size-4 text-[#9D8BA7]" />
              Memory Preferences
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Default capture type
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    Opens first when you capture a memory
                  </p>
                </div>
                <Select
                  value={defaultCapture}
                  onValueChange={(v) => setDefaultCapture(v as CaptureTab)}
                >
                  <SelectTrigger className="w-[110px] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Auto-tagging
                  </p>
                  <p className="text-xs mt-0.5 text-muted-foreground">
                    Let AI automatically tag your memories
                  </p>
                </div>
                <Switch checked={autoTagging} onCheckedChange={setAutoTagging} />
              </div>
            </div>
          </motion.div>

          {/* ── Subscription Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-foreground">
              <Sparkles className="size-4 text-[#9D8BA7]" />
              Subscription
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">
                    Seed (Free)
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#9D8BA7]/10 text-[#9D8BA7]">
                    Current
                  </span>
                </div>
                <p className="text-xs mt-0.5 text-muted-foreground">
                  50 memories/month
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-[#9D8BA7]/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="size-4 text-[#9D8BA7]" />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Bloom
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Unlimited memories, AI insights, priority support
                    </p>
                  </div>
                </div>
                <Button
                  className="rounded-full text-xs shadow-sm bg-[#9D8BA7] hover:bg-[#7A6B85] text-white"
                  size="sm"
                >
                  $5.99/mo
                </Button>
              </div>
            </div>
          </motion.div>

          {/* ── Danger Zone ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-red-200/50"
          >
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-red-600">
              <Trash2 className="size-4" />
              Danger Zone
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={isExporting}
                className="w-full rounded-xl justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                size="sm"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Preparing export...
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    Export all memories
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                size="sm"
              >
                <Trash2 className="size-4" />
                Delete account
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
