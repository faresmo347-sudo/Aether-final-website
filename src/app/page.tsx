'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Mic,
  Search,
  Tag,
  Shield,
  Link2,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Menu,
  X,
  ChevronRight,
  Zap,
  BookOpen,
  MessageCircle,
  Lightbulb,
  Clock,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─────────── Animated Background Canvas ─────────── */
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const orbs: {
      x: number; y: number; radius: number; dx: number; dy: number; opacity: number; color: string
    }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create floating orbs
    for (let i = 0; i < 8; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 80,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.08 + 0.03,
        color:
          i % 3 === 0
            ? '109, 89, 122'
            : i % 3 === 1
              ? '224, 242, 241'
              : '139, 115, 153',
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbs.forEach((orb) => {
        orb.x += orb.dx
        orb.y += orb.dy

        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        )
        gradient.addColorStop(0, `rgba(${orb.color}, ${orb.opacity})`)
        gradient.addColorStop(1, `rgba(${orb.color}, 0)`)

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 1 }}
    />
  )
}

/* ─────────── Seeded PRNG for SSR-safe randomness ─────────── */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

/* ─────────── Floating Particles ─────────── */
function FloatingParticles() {
  const rand = useMemo(() => seededRandom(42), [])
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: rand() * 100,
        y: rand() * 100,
        size: rand() * 3 + 1,
        duration: rand() * 20 + 15,
        delay: rand() * 10,
      })),
    [rand]
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#6D597A]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ─────────── Section Wrapper with Scroll Animation ─────────── */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────── Navbar ─────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_20px_rgba(109,89,122,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-[#6D597A] to-[#8B7399] shadow-lg shadow-[#6D597A]/20 transition-transform duration-300 group-hover:scale-110">
            <img
              src="/aether-logo.png"
              alt="Aether"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-serif text-xl font-bold text-[#212529] tracking-tight">
            Aether
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#6c757d] transition-colors duration-300 hover:text-[#6D597A] relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6D597A] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-sm font-medium text-[#6c757d] hover:text-[#6D597A] hover:bg-[#6D597A]/5"
          >
            Log In
          </Button>
          <Button className="bg-[#6D597A] hover:bg-[#544560] text-white rounded-full px-6 shadow-lg shadow-[#6D597A]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#6D597A]/30 hover:-translate-y-0.5">
            Get Started Free
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[#212529]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-[#6D597A]/10"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-[#6c757d] hover:text-[#6D597A]"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-sm"
                >
                  Log In
                </Button>
                <Button className="w-full bg-[#6D597A] hover:bg-[#544560] text-white rounded-full">
                  Get Started Free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/* ─────────── Hero Section ─────────── */
function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-[#6D597A]/5 blur-[120px] animate-float" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-[#E0F2F1]/30 blur-[100px] animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#6D597A]/3 blur-[150px] animate-float-slow" />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#6D597A]/20 bg-white/60 backdrop-blur-sm px-4 py-2 mb-8 shadow-sm"
        >
          <Sparkles size={14} className="text-[#6D597A]" />
          <span className="text-xs font-medium text-[#6D597A] tracking-wide uppercase">
            AI-Powered Second Brain
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#212529] leading-[1.1] tracking-tight mb-6"
        >
          Forget{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-[#6D597A] to-[#8B7399] bg-clip-text text-transparent">
              forgetting
            </span>
            <motion.span
              className="absolute -bottom-2 left-0 h-3 bg-[#6D597A]/10 rounded-full -z-0"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 1.2 }}
            />
          </span>
          .
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-[#6c757d] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Aether is your AI-powered second brain. It remembers everything—so you
          don&apos;t have to.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            className="bg-[#6D597A] hover:bg-[#544560] text-white rounded-full px-8 py-6 text-base font-medium shadow-xl shadow-[#6D597A]/25 transition-all duration-300 hover:shadow-2xl hover:shadow-[#6D597A]/35 hover:-translate-y-1 group"
          >
            Start Your Free Brain
            <ArrowRight
              size={18}
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 text-base font-medium border-[#6D597A]/20 text-[#6D597A] hover:bg-[#6D597A]/5 hover:border-[#6D597A]/40 transition-all duration-300"
          >
            <MessageCircle size={18} className="mr-2" />
            Watch it in action
          </Button>
        </motion.div>

        {/* Hero Visual - Glowing Core Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative mx-auto max-w-3xl"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#6D597A]/15 border border-white/50 bg-white/50 backdrop-blur-sm">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#F8F9FA] border-b border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded-lg px-4 py-1 text-xs text-[#6c757d] border border-gray-100 w-64 text-center">
                  aether.app/dashboard
                </div>
              </div>
            </div>
            {/* App mockup content */}
            <div className="p-6 bg-gradient-to-br from-white to-[#F8F9FA]">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-[#6D597A]/10 flex items-center justify-center">
                  <Search size={18} className="text-[#6D597A]" />
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-[#6c757d] shadow-sm">
                  What would you like to remember?
                </div>
              </div>
              {/* Mock memory cards */}
              <div className="space-y-3">
                {[
                  {
                    icon: Mic,
                    tag: 'Voice',
                    tagColor: 'bg-[#6D597A]/10 text-[#6D597A]',
                    text: 'Remind me to check out that new coffee shop downtown',
                    time: '2 min ago',
                  },
                  {
                    icon: Link2,
                    tag: 'Link',
                    tagColor: 'bg-[#E0F2F1] text-[#544560]',
                    text: 'Article: "The Future of AI in Personal Knowledge..."',
                    time: '1 hour ago',
                  },
                  {
                    icon: Lightbulb,
                    tag: 'Idea',
                    tagColor: 'bg-amber-50 text-amber-700',
                    text: 'Fintech for Artisans — micro-lending integration idea',
                    time: 'Yesterday',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + i * 0.15 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#6D597A]/5 flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} className="text-[#6D597A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.tagColor}`}
                        >
                          {item.tag}
                        </span>
                        <span className="text-[10px] text-[#6c757d]">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#212529] truncate">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative glow behind the mockup */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#6D597A]/5 via-[#E0F2F1]/10 to-[#6D597A]/5 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#6D597A]/20 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-[#6D597A]/40" />
        </div>
      </motion.div>
    </section>
  )
}

/* ─────────── Features Grid ─────────── */
function FeaturesGrid() {
  const features = [
    {
      icon: Mic,
      title: 'Voice to Wisdom',
      description:
        'Record voice notes with real-time transcription. AI summarizes and extracts key action items instantly.',
      gradient: 'from-[#6D597A]/10 to-[#8B7399]/10',
    },
    {
      icon: Search,
      title: 'Instant Retrieval',
      description:
        'Ask in natural language and get contextual answers, not just search results. "What was that book Sarah mentioned?"',
      gradient: 'from-[#E0F2F1]/40 to-[#80CBC4]/20',
    },
    {
      icon: Tag,
      title: 'Smart Categorization',
      description:
        'AI auto-tags every memory with relevant labels. No manual sorting required—everything finds its place.',
      gradient: 'from-amber-50/50 to-amber-100/30',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description:
        'Your memories are encrypted and private. Aether never shares your data. Your mind, your rules.',
      gradient: 'from-emerald-50/50 to-emerald-100/30',
    },
    {
      icon: Link2,
      title: 'Link Intelligence',
      description:
        'Paste a URL and Aether auto-scrapes metadata, generates summaries, and makes content instantly searchable.',
      gradient: 'from-sky-50/50 to-sky-100/30',
    },
    {
      icon: BookOpen,
      title: 'Daily Recaps',
      description:
        'Wake up to a personalized Morning Brief. Weekly recaps surface patterns and resurface forgotten gems.',
      gradient: 'from-rose-50/50 to-rose-100/30',
    },
  ]

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#6D597A] uppercase tracking-widest mb-4">
            <Zap size={12} />
            Core Features
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            Your mind,{' '}
            <span className="bg-gradient-to-r from-[#6D597A] to-[#8B7399] bg-clip-text text-transparent">
              expanded
            </span>
          </h2>
          <p className="text-[#6c757d] text-lg max-w-xl mx-auto">
            Everything you need to capture, organize, and retrieve your thoughts
            — powered by AI.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 0.1}>
              <div className="group relative h-full rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-[#6D597A]/5 transition-all duration-500 hover:-translate-y-1">
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-[#6D597A]/8 flex items-center justify-center mb-4 group-hover:bg-[#6D597A]/12 transition-colors duration-300">
                    <feature.icon
                      size={22}
                      className="text-[#6D597A]"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#212529] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#6c757d] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── How It Works ─────────── */
function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Capture',
      subtitle: 'Text, Voice, Image',
      description:
        'Whisper a thought, paste a link, snap a photo. Aether captures it all with zero friction.',
      icon: Mic,
      color: '#6D597A',
    },
    {
      number: '02',
      title: 'Aether Indexes',
      subtitle: 'AI Processing',
      description:
        'Our AI transcribes, summarizes, tags, and connects your memories into a knowledge graph.',
      icon: Brain,
      color: '#8B7399',
    },
    {
      number: '03',
      title: 'Recall',
      subtitle: 'Ask in Natural Language',
      description:
        '"What was that startup idea I had last Tuesday?" — Get answers, not search results.',
      icon: MessageCircle,
      color: '#544560',
    },
  ]

  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F8F9FA] to-white"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #6D597A08 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="relative max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#6D597A] uppercase tracking-widest mb-4">
            <Clock size={12} />
            Simple as 1-2-3
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            How it works
          </h2>
          <p className="text-[#6c757d] text-lg max-w-xl mx-auto">
            Three simple steps from thought to retrieval.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-[#6D597A]/20 via-[#6D597A]/40 to-[#6D597A]/20" />

          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.2}>
              <div className="relative text-center group">
                {/* Step number orb */}
                <div className="relative mx-auto mb-8">
                  <div
                    className="h-20 w-20 rounded-full mx-auto flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}15, ${step.color}25)`,
                      boxShadow: `0 0 0 4px ${step.color}08`,
                    }}
                  >
                    <step.icon size={28} style={{ color: step.color }} />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                    style={{ background: step.color }}
                  >
                    {step.number}
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#212529] mb-1">
                  {step.title}
                </h3>
                <p className="text-xs font-medium text-[#6D597A] uppercase tracking-wider mb-3">
                  {step.subtitle}
                </p>
                <p className="text-sm text-[#6c757d] leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── AI Chat Demo ─────────── */
function AIChatDemo() {
  const [query, setQuery] = useState('')
  const [showResponse, setShowResponse] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const demoQueries = [
    'What was that restaurant Alex recommended?',
    'What was the idea I had last Tuesday?',
    'Show me all my travel notes from December',
  ]

  const handleQueryClick = (q: string) => {
    setQuery(q)
    setShowResponse(false)
    setTimeout(() => setShowResponse(true), 600)
  }

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#6D597A]/3 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#E0F2F1]/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#6D597A] uppercase tracking-widest mb-4">
            <Sparkles size={12} />
            The &ldquo;Wow&rdquo; Moment
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            Retrieval at the{' '}
            <span className="bg-gradient-to-r from-[#6D597A] to-[#8B7399] bg-clip-text text-transparent">
              speed of thought
            </span>
          </h2>
          <p className="text-[#6c757d] text-lg max-w-xl mx-auto">
            Ask naturally. Get synthesized, contextual answers—not just a list of notes.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-2xl mx-auto">
            {/* Chat Interface */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-xl shadow-[#6D597A]/5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6D597A] to-[#8B7399] flex items-center justify-center">
                  <Brain size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#212529]">
                    Ask Aether
                  </p>
                  <p className="text-[10px] text-[#6c757d]">
                    AI-Powered Retrieval
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Online
                  </span>
                </div>
              </div>

              {/* Chat Area */}
              <div className="p-6 min-h-[280px]">
                {/* Suggestion chips */}
                {!query && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#6c757d] text-center mb-4">
                      Try asking...
                    </p>
                    <div className="flex flex-col gap-2">
                      {demoQueries.map((q, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={
                            isInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -20 }
                          }
                          transition={{ delay: 0.4 + i * 0.1 }}
                          onClick={() => handleQueryClick(q)}
                          className="text-left px-4 py-3 rounded-xl border border-[#6D597A]/10 text-sm text-[#212529] hover:bg-[#6D597A]/5 hover:border-[#6D597A]/20 transition-all duration-300 group"
                        >
                          <span className="text-[#6D597A] mr-2">&ldquo;</span>
                          {q}
                          <span className="text-[#6D597A] ml-1">&rdquo;</span>
                          <ChevronRight
                            size={14}
                            className="inline ml-2 text-[#6D597A]/40 group-hover:text-[#6D597A] group-hover:translate-x-1 transition-all duration-300"
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Query + Response */}
                {query && (
                  <div className="space-y-4">
                    {/* User query */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-[#6D597A] text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[80%]">
                        {query}
                      </div>
                    </motion.div>

                    {/* AI Response */}
                    {showResponse && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-start"
                      >
                        <div className="bg-[#F8F9FA] rounded-2xl rounded-bl-md px-4 py-3 text-sm text-[#212529] max-w-[85%] border border-gray-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain
                              size={14}
                              className="text-[#6D597A]"
                            />
                            <span className="text-[10px] font-semibold text-[#6D597A] uppercase tracking-wider">
                              Aether
                            </span>
                          </div>
                          <p className="leading-relaxed">
                            {query.includes('Alex')
                              ? 'Alex recommended "The Mill" downtown — you saved it on March 15th. You also noted their espresso was exceptional. Want me to pull up the location?'
                              : query.includes('Tuesday')
                                ? 'You were thinking about a "Fintech for Artisans" platform while walking downtown. You noted the key differentiator would be micro-lending integration. I also found a related link you saved about digital wallets in emerging markets.'
                                : 'You have 4 travel notes from December: a hotel booking in San Francisco, a packing list, a trip recommendation from Sarah, and a restaurant list for NYC. Want me to compile these?'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <div className="px-6 py-4 border-t border-gray-50 bg-[#F8F9FA]/50">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Ask Aether anything..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && query.trim()) {
                        setShowResponse(false)
                        setTimeout(() => setShowResponse(true), 600)
                      }
                    }}
                    className="flex-1 bg-white rounded-xl border border-gray-100 px-4 py-2.5 text-sm text-[#212529] placeholder:text-[#6c757d]/60 focus:outline-none focus:border-[#6D597A]/30 focus:ring-2 focus:ring-[#6D597A]/10 transition-all duration-300"
                  />
                  <Button
                    size="sm"
                    className="bg-[#6D597A] hover:bg-[#544560] text-white rounded-xl px-4 shadow-md shadow-[#6D597A]/15"
                    onClick={() => {
                      if (query.trim()) {
                        setShowResponse(false)
                        setTimeout(() => setShowResponse(true), 600)
                      }
                    }}
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

/* ─────────── Testimonials ─────────── */
function Testimonials() {
  const testimonials = [
    {
      quote:
        'Aether changed how I work. I used to lose ideas constantly — now I just speak them and they\'re organized before I even think about it.',
      name: 'Layla Hassan',
      role: 'Creative Director',
      rating: 5,
    },
    {
      quote:
        'As a PhD student, I juggle hundreds of papers and notes. Asking Aether "What was that methodology paper from last month?" and getting an instant answer is magical.',
      name: 'Omar El-Sayed',
      role: 'PhD Student, Computer Science',
      rating: 5,
    },
    {
      quote:
        'I save links, voice notes, meeting takeaways — everything. Aether connects dots I didn\'t even know were related. It\'s like having a brilliant research assistant.',
      name: 'Mona Fathy',
      role: 'Startup Founder',
      rating: 5,
    },
  ]

  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-white to-[#F8F9FA]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#6D597A] uppercase tracking-widest mb-4">
            <Star size={12} />
            Loved by Early Users
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            What people are saying
          </h2>
          <p className="text-[#6c757d] text-lg max-w-xl mx-auto">
            Real stories from people who stopped forgetting and started
            remembering.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.15}>
              <div className="h-full rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:shadow-[#6D597A]/5 transition-all duration-500 hover:-translate-y-1">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-[#212529] leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6D597A]/20 to-[#8B7399]/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#6D597A]">
                      {t.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#212529]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#6c757d]">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Pricing ─────────── */
function Pricing() {
  const plans = [
    {
      name: 'Seed',
      subtitle: 'Free Tier',
      price: '0',
      currency: '$',
      period: '/month',
      features: [
        { text: '50 memories per month', included: true },
        { text: 'Basic voice transcription', included: true },
        { text: 'Keyword-based search', included: true },
        { text: 'Monthly summary', included: true },
        { text: '100 MB storage', included: true },
        { text: 'View-only sharing', included: true },
        { text: 'Semantic search', included: false },
        { text: 'AI action items', included: false },
      ],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Bloom',
      subtitle: 'Premium Tier',
      price: '5.99',
      currency: '$',
      period: '/month',
      features: [
        { text: 'Unlimited memories', included: true },
        { text: 'Advanced AI summarization', included: true },
        { text: 'Full semantic & NL retrieval', included: true },
        { text: 'Daily, weekly & monthly recaps', included: true },
        { text: '10 GB storage', included: true },
        { text: 'Collaborative sharing', included: true },
        { text: 'AI action items extraction', included: true },
        { text: 'Priority support', included: true },
      ],
      cta: 'Start Bloom Trial',
      highlighted: true,
    },
  ]

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#6D597A]/3 blur-[200px]" />

      <div className="relative max-w-5xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#6D597A] uppercase tracking-widest mb-4">
            <Globe size={12} />
            Pricing
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            Start free,{' '}
            <span className="bg-gradient-to-r from-[#6D597A] to-[#8B7399] bg-clip-text text-transparent">
              bloom
            </span>{' '}
            when ready
          </h2>
          <p className="text-[#6c757d] text-lg max-w-xl mx-auto">
            No credit card required. Upgrade when you need more brain power.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <AnimatedSection key={plan.name} delay={i * 0.15}>
              <div
                className={`relative h-full rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-[#6D597A] to-[#544560] text-white shadow-2xl shadow-[#6D597A]/25 scale-[1.02]'
                    : 'bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-[#6D597A]/5'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-[#6D597A] text-xs font-bold px-4 py-1 rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p
                    className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                      plan.highlighted ? 'text-white/70' : 'text-[#6D597A]'
                    }`}
                  >
                    {plan.subtitle}
                  </p>
                  <h3
                    className={`font-serif text-3xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-[#212529]'
                    }`}
                  >
                    {plan.name}
                  </h3>
                </div>

                <div className="mb-8">
                  <span
                    className={`font-serif text-5xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-[#212529]'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      plan.highlighted ? 'text-white/60' : 'text-[#6c757d]'
                    }`}
                  >
                    {plan.currency}
                    {plan.period}
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature.text} className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          feature.included
                            ? plan.highlighted
                              ? 'bg-white/20'
                              : 'bg-[#6D597A]/10'
                            : plan.highlighted
                              ? 'bg-white/5'
                              : 'bg-gray-100'
                        }`}
                      >
                        <Check
                          size={12}
                          className={
                            feature.included
                              ? plan.highlighted
                                ? 'text-white'
                                : 'text-[#6D597A]'
                              : 'text-gray-300'
                          }
                        />
                      </div>
                      <span
                        className={`text-sm ${
                          feature.included
                            ? plan.highlighted
                              ? 'text-white'
                              : 'text-[#212529]'
                            : plan.highlighted
                              ? 'text-white/40'
                              : 'text-[#6c757d]/50'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full rounded-full py-6 font-medium transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-white text-[#6D597A] hover:bg-white/90 shadow-lg shadow-black/10 hover:-translate-y-0.5'
                      : 'bg-[#6D597A] hover:bg-[#544560] text-white shadow-md shadow-[#6D597A]/15 hover:-translate-y-0.5'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Final CTA ─────────── */
function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#6D597A] to-[#544560] p-12 sm:p-16 text-center overflow-hidden shadow-2xl shadow-[#6D597A]/20">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '30px 30px',
            }} />

            <div className="relative z-10">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to never forget again?
              </h2>
              <p className="text-white/70 text-lg max-w-lg mx-auto mb-8">
                Join thousands who&apos;ve upgraded their memory. Start free,
                no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-[#6D597A] hover:bg-white/90 rounded-full px-8 py-6 text-base font-semibold shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 group"
                >
                  Start Your Free Brain
                  <ArrowRight
                    size={18}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </div>
              <p className="text-white/40 text-xs mt-6">
                Free tier includes 50 memories/month • No credit card needed
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}

/* ─────────── Footer ─────────── */
function Footer() {
  const links = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Resources: ['Help Center', 'API Docs', 'Community', 'Status'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
  }

  return (
    <footer className="relative bg-[#212529] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6D597A] to-[#8B7399] overflow-hidden shadow-lg">
                <img
                  src="/aether-logo.png"
                  alt="Aether"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-serif text-xl font-bold">Aether</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-6">
              Your AI-powered second brain. Remember everything, retrieve
              anything.
            </p>
            <div className="flex gap-3">
              {['X', 'GH', 'LI', 'DC'].map((social) => (
                <div
                  key={social}
                  className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-white/50 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  {social}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Aether. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Made with care in San Francisco, CA
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─────────── Main Page ─────────── */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] relative">
      <AnimatedBackground />
      <FloatingParticles />
      <Navbar />
      <main className="flex-1 relative z-10">
        <HeroSection />
        <FeaturesGrid />
        <HowItWorks />
        <AIChatDemo />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
