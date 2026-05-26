'use client'

import { useAetherStore } from '@/store/aether-store'
import AppShell from '@/components/aether/AppShell'
import Dashboard from '@/components/aether/Dashboard'
import { MemoryDetail } from '@/components/aether/MemoryDetail'
import { AskAether } from '@/components/aether/AskAether'
import { Collections } from '@/components/aether/Collections'
import { Recaps } from '@/components/aether/Recaps'
import { Settings } from '@/components/aether/Settings'

/* ─────────── Landing Page ─────────── */
function LandingPage() {
  const { setCurrentView } = useAetherStore()

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      {/* Landing hero — simplified version with CTA to enter app */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-[#9D8BA7]/5 blur-[120px] animate-float" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-[#E0F2F1]/30 blur-[100px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#9D8BA7]/3 blur-[150px] animate-float-slow" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#9D8BA7] to-[#7A6B85] shadow-lg shadow-[#9D8BA7]/20 overflow-hidden">
              <img
                src="/aether-logo.png"
                alt="Aether"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-serif text-2xl font-bold text-[#1a1a2e]">
              Aether
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#1a1a2e] leading-[1.1] tracking-tight mb-6">
            Forget{' '}
            <span className="bg-gradient-to-r from-[#9D8BA7] to-[#B8A8C4] bg-clip-text text-transparent">
              forgetting
            </span>
            .
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#1a1a2e]/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Aether is your AI-powered second brain. It remembers everything—so you don&apos;t have to.
          </p>

          {/* CTA */}
          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center gap-2 bg-[#9D8BA7] hover:bg-[#7A6B85] text-white rounded-full px-8 py-4 text-base font-medium shadow-xl shadow-[#9D8BA7]/25 transition-all duration-300 hover:shadow-2xl hover:shadow-[#9D8BA7]/35 hover:-translate-y-1"
          >
            Enter Aether
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>

          <p className="text-sm text-[#1a1a2e]/30 mt-6">
            No sign-up required for demo
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─────────── App Content Router ─────────── */
function AppContent() {
  const { currentView } = useAetherStore()

  switch (currentView) {
    case 'dashboard':
      return <Dashboard />
    case 'memory-detail':
      return <MemoryDetail />
    case 'ask-aether':
      return <AskAether />
    case 'collections':
      return <Collections />
    case 'recaps':
      return <Recaps />
    case 'settings':
      return <Settings />
    default:
      return <Dashboard />
  }
}

/* ─────────── Main Page ─────────── */
export default function Home() {
  const { currentView } = useAetherStore()

  if (currentView === 'landing') {
    return <LandingPage />
  }

  return (
    <AppShell>
      <AppContent />
    </AppShell>
  )
}
