'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Cpu,
  Sparkles,
  Crown,
  Download,
  Trash2,
  Check,
  X,
  Loader2,
  LogOut,
  AlertTriangle,
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
import { signOut, updateProfile, exportAllMemories } from '@/lib/supabase/data'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
    user,
    setCurrentView,
  } = useAetherStore()

  const { toast } = useToast()

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile.name)
  const [editEmail, setEditEmail] = useState(profile.email)

  // Export loading state
  const [isExporting, setIsExporting] = useState(false)

  // Delete account dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // ──── Dark mode: sync class on mount ────
  useEffect(() => {
    const saved = localStorage.getItem('aether-dark-mode') === 'true'
    if (saved) {
      document.documentElement.classList.add('dark')
    }
  }, [])

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

  const handleEditSave = async () => {
    const trimmedName = editName.trim()
    const trimmedEmail = editEmail.trim()
    if (!trimmedName || !trimmedEmail) return

    // Compute initials from name
    const parts = trimmedName.split(' ')
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : trimmedName.slice(0, 2).toUpperCase()

    try {
      // Save to Supabase if we have a user ID
      if (user?.id) {
        await updateProfile(user.id, { name: trimmedName })
      }

      setProfile({ ...profile, name: trimmedName, email: trimmedEmail, initials })
      setIsEditing(false)
      toast({ title: 'Profile updated!', description: 'Your changes have been saved.' })
    } catch (err) {
      console.error('Failed to update profile:', err)
      toast({ title: 'Update failed', description: 'Could not save your profile. Please try again.', variant: 'destructive' })
    }
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

  // ──── Bloom upgrade handler ────
  const handleBloomUpgrade = useCallback(() => {
    toast({
      title: 'Bloom plan coming soon!',
      description: 'Stay tuned for unlimited memories and premium features.',
    })
  }, [toast])

  // ──── Delete account handler ────
  const handleDeleteAccount = useCallback(async () => {
    try {
      await signOut()
      setCurrentView('landing')
      toast({ title: 'Signed out', description: 'Your account session has been ended.' })
    } catch (err) {
      console.error('Sign out failed:', err)
      toast({ title: 'Error', description: 'Could not sign out. Please try again.', variant: 'destructive' })
    }
  }, [setCurrentView, toast])

  // ──── Export handler ────
  const handleExport = useCallback(async () => {
    setIsExporting(true)
    try {
      const jsonString = await exportAllMemories()
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `aether-memories-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: 'Export complete!',
        description: 'All memories exported as JSON from Supabase.',
      })
    } catch (err) {
      console.error('Export failed:', err)
      toast({
        title: 'Export failed',
        description: 'Could not export your memories. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }, [toast])

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
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditStart}
                    className="rounded-full text-xs text-[#9D8BA7] hover:text-[#7A6B85] hover:bg-[#9D8BA7]/5"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await signOut()
                      setCurrentView('landing')
                    }}
                    className="rounded-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="size-3.5 mr-1" />
                    Sign Out
                  </Button>
                </div>
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
                    {user?.plan === 'pro' ? 'Bloom (Pro)' : 'Seed (Free)'}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#9D8BA7]/10 text-[#9D8BA7]">
                    Current
                  </span>
                </div>
                <p className="text-xs mt-0.5 text-muted-foreground">
                  {user?.plan === 'pro'
                    ? `${memories.length} memories · Unlimited`
                    : `${memories.length} out of 50 memories`}
                </p>
              </div>
            </div>
            {user?.plan !== 'pro' && (
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
                    onClick={handleBloomUpgrade}
                  >
                    $5.99/mo
                  </Button>
                </div>
              </div>
            )}
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
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete account
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Delete Account Confirmation Dialog ── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your memories, collections, and
              personal data will be permanently deleted. Are you sure you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
