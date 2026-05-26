'use client'

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
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAetherStore } from '@/store/aether-store'
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
    setCurrentView,
  } = useAetherStore()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFAF5' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e' }}
          >
            Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: '#1a1a2e', opacity: 0.5 }}>
            Manage your Aether experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50"
          >
            <div className="flex items-center gap-4">
              <div
                className="size-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: '#9D8BA7' }}
              >
                AJ
              </div>
              <div className="min-w-0">
                <h3
                  className="font-bold text-base"
                  style={{ color: '#1a1a2e' }}
                >
                  Alex Johnson
                </h3>
                <p className="text-sm" style={{ color: '#1a1a2e', opacity: 0.5 }}>
                  alex@aether.app
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto rounded-full text-xs"
                style={{ color: '#9D8BA7' }}
              >
                Edit
              </Button>
            </div>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50"
          >
            <h3
              className="font-bold text-sm mb-4 flex items-center gap-2"
              style={{ color: '#1a1a2e' }}
            >
              <Bell className="size-4" style={{ color: '#9D8BA7' }} />
              Preferences
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                    Daily summary notifications
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#1a1a2e', opacity: 0.4 }}>
                    Get a recap of your day&apos;s memories
                  </p>
                </div>
                <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                    Weekly recap email
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#1a1a2e', opacity: 0.4 }}>
                    Receive a weekly digest every Sunday
                  </p>
                </div>
                <Switch checked={weeklyRecap} onCheckedChange={setWeeklyRecap} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                    Dark mode
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#1a1a2e', opacity: 0.4 }}>
                    Coming soon
                  </p>
                </div>
                <Switch disabled />
              </div>
            </div>
          </motion.div>

          {/* Memory Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50"
          >
            <h3
              className="font-bold text-sm mb-4 flex items-center gap-2"
              style={{ color: '#1a1a2e' }}
            >
              <Cpu className="size-4" style={{ color: '#9D8BA7' }} />
              Memory Preferences
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                    Default capture type
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#1a1a2e', opacity: 0.4 }}>
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
                  <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>
                    Auto-tagging
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#1a1a2e', opacity: 0.4 }}>
                    Let AI automatically tag your memories
                  </p>
                </div>
                <Switch checked={autoTagging} onCheckedChange={setAutoTagging} />
              </div>
            </div>
          </motion.div>

          {/* Subscription Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50"
          >
            <h3
              className="font-bold text-sm mb-4 flex items-center gap-2"
              style={{ color: '#1a1a2e' }}
            >
              <Sparkles className="size-4" style={{ color: '#9D8BA7' }} />
              Subscription
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>
                    Seed (Free)
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: 'rgba(157, 139, 167, 0.1)', color: '#9D8BA7' }}
                  >
                    Current
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#1a1a2e', opacity: 0.4 }}>
                  50 memories/month
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(157, 139, 167, 0.06)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="size-4" style={{ color: '#9D8BA7' }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>
                      Bloom
                    </p>
                    <p className="text-xs" style={{ color: '#1a1a2e', opacity: 0.5 }}>
                      Unlimited memories, AI insights, priority support
                    </p>
                  </div>
                </div>
                <Button
                  className="rounded-full text-xs shadow-sm"
                  style={{ backgroundColor: '#9D8BA7', color: '#fff', border: 'none' }}
                  size="sm"
                >
                  $5.99/mo
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-red-100"
            style={{ backgroundColor: 'rgba(254, 242, 242, 0.5)' }}
          >
            <h3
              className="font-bold text-sm mb-4 flex items-center gap-2 text-red-600"
            >
              <Trash2 className="size-4" />
              Danger Zone
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-xl justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                size="sm"
              >
                <Download className="size-4" />
                Export all memories
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
