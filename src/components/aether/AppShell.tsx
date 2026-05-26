'use client'

import { ReactNode, memo, useMemo } from 'react'
import { Brain, FolderOpen, Settings, Search, Plus, Home } from 'lucide-react'
import { useAetherStore } from '@/store/aether-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AetherLogo } from '@/components/aether/AetherLogo'
import type { AppView } from '@/components/aether/types'

/* ─────────── Navigation Configuration ─────────── */
interface NavItem {
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  view: AppView
  isCapture?: boolean
}

const desktopNavItems: NavItem[] = [
  { label: 'Home', icon: Home, view: 'dashboard' },
  { label: 'Ask Aether', icon: Brain, view: 'ask-aether' },
  { label: 'Collections', icon: FolderOpen, view: 'collections' },
  { label: 'Settings', icon: Settings, view: 'settings' },
]

const mobileNavItems: NavItem[] = [
  { label: 'Home', icon: Home, view: 'dashboard' },
  { label: 'Ask', icon: Brain, view: 'ask-aether' },
  { label: 'Capture', icon: Plus, view: 'dashboard', isCapture: true },
  { label: 'Collections', icon: FolderOpen, view: 'collections' },
  { label: 'Settings', icon: Settings, view: 'settings' },
]

/* ─────────── Sidebar Nav Item (Desktop) ─────────── */
const SidebarNavItem = memo(function SidebarNavItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem
  isActive: boolean
  onClick: () => void
}) {
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5
        text-sm font-medium transition-colors duration-150
        ${
          isActive
            ? 'bg-[#9D8BA7]/10 text-[#9D8BA7] dark:bg-[#9D8BA7]/20 dark:text-[#B8A8C4]'
            : 'text-muted-foreground hover:text-foreground hover:bg-[#9D8BA7]/5 dark:hover:bg-[#9D8BA7]/10'
        }
      `}
    >
      {/* Active left border accent */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#9D8BA7]" />
      )}

      <Icon
        size={20}
        className={`flex-shrink-0 transition-colors duration-150 ${
          isActive ? 'text-[#9D8BA7]' : 'text-muted-foreground group-hover:text-foreground'
        }`}
      />
      <span className="truncate">{item.label}</span>
    </button>
  )
})

/* ─────────── Bottom Nav Item (Mobile) ─────────── */
const BottomNavItem = memo(function BottomNavItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem
  isActive: boolean
  onClick: () => void
}) {
  const Icon = item.icon

  return (
    <button
      onClick={onClick}
      className={`
        tap-feedback relative flex flex-col items-center justify-center gap-0.5
        min-w-[48px] min-h-[44px] transition-all duration-150
        ${
          isActive
            ? 'text-[#9D8BA7] scale-[1.05]'
            : 'text-muted-foreground active:text-foreground'
        }
      `}
    >
      <Icon size={22} className="transition-colors duration-150" />
      <span className="text-[10px] font-medium leading-tight">{item.label}</span>
    </button>
  )
})

/* ─────────── Main AppShell Component ─────────── */
export default function AppShell({ children }: { children: ReactNode }) {
  const { currentView, setCurrentView, setCaptureModalOpen, profile } = useAetherStore()

  // Determine which nav item is active based on current view
  const activeNavView = useMemo((): AppView => {
    if (currentView === 'memory-detail') return 'dashboard'
    if (currentView === 'landing') return 'dashboard'
    return currentView
  }, [currentView])

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left Sidebar (Desktop) */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-card border-r border-border fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
          <AetherLogo size={36} showText />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {desktopNavItems.map((item) => (
            <SidebarNavItem
              key={item.view}
              item={item}
              isActive={activeNavView === item.view}
              onClick={() => setCurrentView(item.view)}
            />
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-[#9D8BA7]/20">
              <AvatarFallback className="bg-[#9D8BA7]/10 text-[#9D8BA7] text-sm font-semibold">
                {profile.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground truncate">Bloom Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header - Mobile (simplified) */}
        <header className="md:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-3 px-4 h-12 safe-area-top">
            {/* Brain logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <AetherLogo size={28} />
            </div>

            {/* Compact search pill - tappable to open Ask Aether */}
            <button
              onClick={() => setCurrentView('ask-aether')}
              className="flex-1 flex items-center gap-2 bg-muted/60 border border-border/50 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:border-[#9D8BA7]/30 hover:bg-muted transition-all duration-200 group"
            >
              <Search
                size={14}
                className="flex-shrink-0 text-[#9D8BA7]/60 group-hover:text-[#9D8BA7] transition-colors duration-150"
              />
              <span className="truncate text-xs">Ask Aether...</span>
            </button>
          </div>
        </header>

        {/* Top Header - Desktop */}
        <header className="hidden md:block sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-4 px-6 h-14">
            {/* Search Bar */}
            <button
              onClick={() => setCurrentView('ask-aether')}
              className="flex-1 max-w-xl mx-auto flex items-center gap-3 bg-background border border-border rounded-full px-4 py-2 text-sm text-muted-foreground hover:border-[#9D8BA7]/30 hover:bg-card transition-all duration-200 group"
            >
              <Search
                size={16}
                className="flex-shrink-0 text-[#9D8BA7]/60 group-hover:text-[#9D8BA7] transition-colors duration-150"
              />
              <span className="truncate">Ask Aether anything...</span>
            </button>

            {/* Avatar (Desktop) */}
            <div className="flex-shrink-0">
              <Avatar className="h-8 w-8 border border-[#9D8BA7]/20 cursor-pointer hover:border-[#9D8BA7]/40 transition-colors duration-150">
                <AvatarFallback className="bg-[#9D8BA7]/10 text-[#9D8BA7] text-xs font-semibold">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Desktop FAB (subtle) - only on md+ */}
      <button
        onClick={() => setCaptureModalOpen(true)}
        className="hidden md:flex fixed z-40 bottom-8 right-8 h-12 w-12 rounded-full bg-[#9D8BA7] text-white items-center justify-center shadow-lg shadow-[#9D8BA7]/25 hover:shadow-xl hover:shadow-[#9D8BA7]/35 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Quick capture"
      >
        <Plus size={22} className="stroke-[2.5]" />
      </button>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/85 backdrop-blur-lg border-t border-border/60 mobile-gpu">
        <div className="relative flex items-end justify-around px-1 pt-1.5" style={{ height: 'calc(64px + env(safe-area-inset-bottom, 0px))', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {mobileNavItems.map((item, index) => {
            // Center Capture button - raised and prominent
            if (item.isCapture) {
              return (
                <button
                  key={item.view}
                  onClick={() => setCaptureModalOpen(true)}
                  className="tap-feedback relative flex flex-col items-center justify-center -mt-5 z-10"
                >
                  {/* Raised circular lavender button */}
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#9D8BA7] to-[#7A6B85] flex items-center justify-center shadow-lg shadow-[#9D8BA7]/40 ring-4 ring-background/80 transition-all duration-200 hover:shadow-xl hover:shadow-[#9D8BA7]/50 active:scale-95">
                    <Plus size={26} className="stroke-[2.5] text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-[#9D8BA7] mt-1 leading-tight">Capture</span>
                </button>
              )
            }

            // Regular nav items
            return (
              <BottomNavItem
                key={item.view}
                item={item}
                isActive={activeNavView === item.view}
                onClick={() => setCurrentView(item.view)}
              />
            )
          })}
        </div>
      </nav>
    </div>
  )
}
