'use client'

import { ReactNode, memo, useMemo } from 'react'
import { Brain, FolderOpen, CalendarDays, Settings, Search, Plus, Home } from 'lucide-react'
import { useAetherStore } from '@/store/aether-store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { AppView } from '@/components/aether/types'

/* ─────────── Navigation Configuration ─────────── */
interface NavItem {
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  view: AppView
}

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, view: 'dashboard' },
  { label: 'Ask Aether', icon: Brain, view: 'ask-aether' },
  { label: 'Collections', icon: FolderOpen, view: 'collections' },
  { label: 'Recaps', icon: CalendarDays, view: 'recaps' },
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
        relative flex flex-col items-center justify-center gap-1
        min-w-[56px] min-h-[44px] rounded-lg transition-colors duration-150
        ${
          isActive
            ? 'text-[#9D8BA7]'
            : 'text-muted-foreground active:text-foreground'
        }
      `}
    >
      {isActive && (
        <div className="absolute -top-0.5 h-1 w-1 rounded-full bg-[#9D8BA7]" />
      )}
      <Icon size={22} className="transition-colors duration-150" />
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
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6D597A] to-[#9D8BA7] flex items-center justify-center shadow-lg shadow-[#9D8BA7]/20">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-serif text-xl font-bold text-foreground tracking-tight">
            Aether
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
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
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-4 px-4 md:px-6 h-14">
            {/* Mobile logo */}
            <div className="md:hidden flex items-center gap-2 flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#6D597A] to-[#9D8BA7] flex items-center justify-center shadow-md shadow-[#9D8BA7]/20">
                <Brain size={14} className="text-white" />
              </div>
            </div>

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
            <div className="hidden md:block flex-shrink-0">
              <Avatar className="h-8 w-8 border border-[#9D8BA7]/20 cursor-pointer hover:border-[#9D8BA7]/40 transition-colors duration-150">
                <AvatarFallback className="bg-[#9D8BA7]/10 text-[#9D8BA7] text-xs font-semibold">
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area - instant swap, no animation delay */}
        <main className="flex-1 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Floating Quick Capture Button */}
      <button
        onClick={() => setCaptureModalOpen(true)}
        className="fixed z-50 bottom-24 right-5 md:bottom-8 md:right-auto md:left-[calc(50%+8rem)] md:-translate-x-1/2 h-14 w-14 rounded-full bg-[#9D8BA7] text-white flex items-center justify-center shadow-lg shadow-[#9D8BA7]/30 hover:shadow-xl hover:shadow-[#9D8BA7]/40 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Plus size={24} className="stroke-[2.5]" />
      </button>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border safe-area-pb">
        <div className="flex items-center justify-around px-2 h-16" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {navItems.map((item) => (
            <BottomNavItem
              key={item.view}
              item={item}
              isActive={activeNavView === item.view}
              onClick={() => setCurrentView(item.view)}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}
