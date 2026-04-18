"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  FileText,
  Mail,
  Rocket,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { getToken, loginUser, registerUser, saveToken, saveUser, verifyOtp } from "@/lib/api"

// ─── DATA ────────────────────────────────────────────────────────────────────

const HERO_STATS = [
  { value: "11+", label: "workflow modules" },
  { value: "AI", label: "career + prep assistance" },
  { value: "1", label: "dashboard for the full internship hunt" },
]

const SHOWCASE_ITEMS = [
  {
    id: "career",
    label: "Career Predictor",
    spanClass: "md:col-span-2 md:row-span-2",
    imageHeight: "h-[24rem] md:h-full",
    title: "AI career path prediction with job-search shortcuts",
    description:
      "Match skills to career paths, see gaps, copy recruiter-ready pitches, and jump straight to LinkedIn, Naukri, Internshala, and Indeed.",
    image: "/screenshots/career-path.png",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    spanClass: "md:col-span-1",
    imageHeight: "h-48 md:h-full",
    title: "A dashboard that tells you where your pipeline actually stands",
    description:
      "Track applications, offers, interview rate, response rate, and momentum without digging through sheets or scattered notes.",
    image: "/screenshots/dashboard.png",
  },
  {
    id: "applications",
    label: "Applications",
    spanClass: "md:col-span-1",
    imageHeight: "h-48 md:h-full",
    title: "Kanban application tracking that stays easy to update",
    description:
      "Move roles through wishlist, applied, shortlisted, interview, offer, and rejected with a cleaner visual workflow.",
    image: "/screenshots/applications.png",
  },
  {
    id: "analytics",
    label: "Analytics",
    spanClass: "md:col-span-1",
    imageHeight: "h-48 md:h-full",
    title: "See what is working across companies, roles, and time windows",
    description:
      "Understand where your funnel leaks, which roles convert best, and how your effort is trending week by week.",
    image: "/screenshots/analytics.png",
  },
]

const FEATURE_CARDS = [
  {
    icon: Compass,
    title: "AI Career Path Predictor",
    desc: "Predict best-fit roles, spot skill gaps, get a roadmap, and add wishlist cards instantly.",
    image: "/screenshots/career-results.png",
  },
  {
    icon: Brain,
    title: "AI Prep + Mock Interviews",
    desc: "Generate prep plans, role-specific questions, and realistic interview practice inside the same flow.",
    image: "/screenshots/mock-interview.png",
  },
  {
    icon: BarChart3,
    title: "Analytics That Matter",
    desc: "Track pipeline health, company-type performance, response trends, and interview conversion in one place.",
    image: "/screenshots/analytics.png",
  },
  {
    icon: Target,
    title: "Skill Gap + Practice",
    desc: "See the skills you are missing, then build consistency with daily DSA practice and progress heatmaps.",
    image: "/screenshots/practice.png",
  },
  {
    icon: Mail,
    title: "Follow-ups + Calendar",
    desc: "Stay on top of deadlines, reminders, follow-up drafts, and application timing without another tool.",
    image: "/screenshots/ai-prep.png",
  },
  {
    icon: Users,
    title: "Community + Experiences",
    desc: "Browse real interview experiences and community signals while planning your next application move.",
    image: "/screenshots/community.png",
  },
]

const WORKFLOW_STEPS = [
  {
    number: "01",
    title: "Track every target",
    body: "Add companies, keep statuses updated, and stop losing your internship hunt across Excel, email, and memory.",
  },
  {
    number: "02",
    title: "Prepare with AI",
    body: "Use prep plans, mock interviews, skill-gap analysis, and career predictions to make each application smarter.",
  },
  {
    number: "03",
    title: "Convert more interviews",
    body: "See analytics, follow up on time, and move the right roles forward with a clearer system behind you.",
  },
]

const SOCIAL_PROOF_TAGS = [
  "Application tracker",
  "Career path predictor",
  "AI prep generator",
  "Mock interviews",
  "Skill gap analysis",
  "Daily practice",
  "Interview calendar",
  "Community insights",
]

const WHY_TRACKTERN = [
  {
    icon: "🗂️",
    heading: "One place, zero tabs",
    body: "Applications, prep, analytics, follow-ups, and career planning — all connected. No more switching between tools.",
  },
  {
    icon: "🤖",
    heading: "AI that actually helps",
    body: "Not just a chatbot. Tracktern gives you prep plans, career predictions, and skill gap reports built around your profile.",
  },
  {
    icon: "📊",
    heading: "Know where you stand",
    body: "Pipeline analytics show you exactly where applications drop off so you can fix the leak, not just apply more.",
  },
  {
    icon: "🔥",
    heading: "Stay consistent",
    body: "Daily DSA practice, streaks, and an interview journal keep you sharp across the whole placement season.",
  },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("")
  const [activeShowcase, setActiveShowcase] = useState(SHOWCASE_ITEMS[0].id)

  const isVerifying = Boolean(pendingVerificationEmail) && !isLogin
  const activeItem = SHOWCASE_ITEMS.find((item) => item.id === activeShowcase) || SHOWCASE_ITEMS[0]

  useEffect(() => {
    const token = getToken()
    if (token) window.location.href = "/dashboard"
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isVerifying) {
        const data = await verifyOtp(pendingVerificationEmail, otp)
        if (data.token) {
          saveToken(data.token)
          saveUser(data.user)
          window.location.href = "/dashboard"
          return
        }
        setError(data.message || "Invalid OTP")
        return
      }

      const data = isLogin
        ? await loginUser(email, password)
        : await registerUser(name, email, password)

      if (data.token) {
        saveToken(data.token)
        saveUser(data.user)
        window.location.href = "/dashboard"
      } else if (!isLogin && data.message) {
        setPendingVerificationEmail(email)
        setOtp("")
        setSuccess("OTP sent to your email. Enter it below to verify your account.")
      } else {
        setError(data.message || "Something went wrong")
      }
    } catch {
      setError("Cannot connect to server.")
    } finally {
      setLoading(false)
    }
  }

  const openSignUp = () => { setShowAuth(true); setIsLogin(false) }
  const openSignIn = () => { setShowAuth(true); setIsLogin(true) }
  const resetAuth = () => {
    setPendingVerificationEmail("")
    setOtp("")
    setError("")
    setSuccess("")
  }

  // ── AUTH SCREEN ────────────────────────────────────────────────────────────
  if (showAuth) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070d] px-4 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.28),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.16),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,13,0.16),#07070d_72%)]" />

        <div className="relative z-10 w-full max-w-md">
          <button
            onClick={() => setShowAuth(false)}
            className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to homepage
          </button>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(14,14,22,0.92)] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-white">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">Tracktern</p>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">AI internship workspace</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white">
              {isLogin ? "Welcome back" : isVerifying ? "Verify your account" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              {isLogin
                ? "Pick up your internship pipeline where you left off."
                : isVerifying
                  ? `We sent an OTP to ${pendingVerificationEmail}`
                  : "Start free. Organize applications, prep, analytics, and career planning in one place."}
            </p>

            <div className="mt-6 flex rounded-2xl border border-white/8 bg-white/5 p-1">
              <button
                onClick={() => { setIsLogin(true); resetAuth() }}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${isLogin ? "bg-violet-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(""); setSuccess("") }}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${!isLogin ? "bg-violet-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"}`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </div>
            )}

            <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
              {!isLogin && !isVerifying && (
                <Input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-600"
                />
              )}

              {!isVerifying ? (
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-2xl border-white/10 bg-white/5 pl-10 text-sm text-white placeholder:text-zinc-600"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                  Verifying account for <span className="font-semibold text-white">{pendingVerificationEmail}</span>
                </div>
              )}

              {isVerifying ? (
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-600"
                />
              ) : (
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 rounded-2xl border-white/10 bg-white/5 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              )}

              {isLogin && !isVerifying && (
                <div className="mt-2 text-right">
                  <Link href="/auth/forgot-password" className="text-xs text-zinc-400 transition hover:text-white">
                    Forgot Password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-sm font-bold text-white transition hover:scale-[1.01] hover:opacity-95 disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Sign In"
                    : isVerifying
                      ? "Verify OTP"
                      : "Create Free Account"}
              </button>
            </form>

            {!isVerifying ? (
              <p className="mt-4 text-center text-sm text-zinc-500">
                {isLogin ? "No account? " : "Have an account? "}
                <button
                  onClick={() => { setIsLogin(!isLogin); resetAuth() }}
                  className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
                >
                  {isLogin ? "Sign up free" : "Sign in"}
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={resetAuth}
                className="mt-4 w-full text-center text-sm font-semibold text-violet-400 transition-colors hover:text-violet-300"
              >
                Edit email and sign up again
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── LANDING PAGE ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07070d] text-white">
      {/* Global background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.24),transparent_30%),radial-gradient(circle_at_75%_10%,rgba(56,189,248,0.14),transparent_22%),linear-gradient(180deg,#07070d_0%,#090913_100%)]" />

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-white/6 bg-[rgba(7,7,13,0.72)] backdrop-blur-2xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-white shadow-[0_10px_35px_rgba(124,58,237,0.35)]">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">Tracktern</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Internship command center</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openSignIn}
              className="rounded-xl px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Sign In
            </button>
            <button
              onClick={openSignUp}
              className="rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(124,58,237,0.32)] transition hover:scale-[1.03]"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative px-6 pb-16 pt-14 lg:pt-20">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
              <Sparkles className="h-3.5 w-3.5" />
              Built for the full internship journey
            </div>

            {/* ✅ NEW: Relatable pain → solution headline */}
            <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.0] tracking-tight text-white sm:text-6xl lg:text-7xl">
              It starts with a WhatsApp forward.
              <span className="mt-2 block bg-[linear-gradient(135deg,#c4b5fd,#818cf8,#67e8f9)] bg-clip-text text-transparent">
                Then placement season hits.
              </span>
            </h1>

            {/* ✅ NEW: Subheading that earns the CTA */}
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400 sm:text-xl">
              Twelve tabs open. Three deadlines missed. An Excel sheet nobody's updated in two weeks.
              <br /><br />
              <span className="font-semibold text-white">Tracktern is what you needed from Day 1.</span>{" "}
              One AI-powered workspace to track applications, prep for interviews, discover career paths, and close skill gaps — built for placement season, not against it.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={openSignUp}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] px-7 py-4 text-base font-semibold text-white shadow-[0_18px_50px_rgba(124,58,237,0.35)] transition hover:scale-[1.02]"
              >
                Get organized — it's free
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveShowcase("career")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-7 py-4 text-base font-semibold text-zinc-200 transition hover:border-white/18 hover:bg-white/7"
              >
                See Career Predictor
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Social trust */}
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["A", "R", "M", "S"].map((label, i) => (
                    <div
                      key={label}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#07070d] text-xs font-bold text-white"
                      style={{ background: ["#7c3aed", "#4f46e5", "#0ea5e9", "#10b981"][i] }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <span>Built for placement-focused students</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1">Track everything in one place</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {HERO_STATS.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/8 bg-white/4 p-5">
                  <p className="text-3xl font-bold text-white">{item.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshot grid */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-[36px] bg-[radial-gradient(circle,rgba(124,58,237,0.24),transparent_62%)] blur-3xl" />
            <div className="relative grid gap-4 md:grid-cols-3">
              {SHOWCASE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveShowcase(item.id)}
                  className={`${item.spanClass} group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#10101a] text-left shadow-[0_22px_70px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-white/18`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1600}
                    height={1000}
                    placeholder="empty"
                    className={`w-full object-cover transition duration-500 group-hover:scale-[1.02] ${item.imageHeight}`}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,7,13,0.88))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE TAGS STRIP ── */}
      <section className="border-y border-white/6 bg-white/[0.03] px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {SOCIAL_PROOF_TAGS.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              <span className="text-sm font-medium text-zinc-400">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY TRACKTERN (replaces "Why this converts") ── */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Why students switch</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Stop juggling tools. Start actually landing interviews.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">
              Most students don't fail placement season because they didn't work hard enough.
              They fail because their system was scattered. Tracktern puts it all in one place so every decision is clearer and every application is stronger.
            </p>

            {/* ✅ NEW: User-facing benefit cards */}
            <div className="mt-8 space-y-3">
              {WHY_TRACKTERN.map((item) => (
                <div key={item.heading} className="flex items-start gap-4 rounded-2xl border border-white/7 bg-white/4 px-4 py-4">
                  <span className="mt-0.5 text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.heading}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive showcase */}
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(124,58,237,0.12),rgba(15,15,24,0.94))] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
            <div className="flex flex-wrap gap-2 border-b border-white/8 pb-4">
              {SHOWCASE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveShowcase(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeShowcase === item.id
                      ? "bg-violet-500 text-white"
                      : "bg-white/5 text-zinc-400 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">{activeItem.label}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{activeItem.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">{activeItem.description}</p>

                <div className="mt-6 space-y-3">
                  {[
                    "Built around real internship workflows",
                    "Designed to reduce manual effort",
                    "Strong visual storytelling for demos",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-3 text-sm text-zinc-300">
                      <span className="h-2 w-2 rounded-full bg-violet-400" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0e0e16]">
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  width={1600}
                  height={1000}
                  placeholder="empty"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Feature stack</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Everything you need between "I found a role" and "I got the offer."
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-400">
              Track, prepare, analyze, grow, and apply smarter — all inside one workspace that connects the dots for you.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {FEATURE_CARDS.map((feature) => (
              <div
                key={feature.title}
                className="group overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(15,15,22,0.98))] shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/18"
              >
                <div className="relative h-56 overflow-hidden border-b border-white/8 bg-[#11111a]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={1600}
                    height={1000}
                    placeholder="empty"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,7,13,0.7))]" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/12 text-violet-300">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-zinc-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">How it works</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Three steps from chaos to offer letter.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.number} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8">
                <div className="inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-violet-200">
                  {step.number}
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-base leading-8 text-zinc-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GMAIL SYNC COMING SOON ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(234,67,53,0.08),rgba(66,133,244,0.08),rgba(12,12,20,0.97))] p-10 sm:p-14">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">

              {/* Left: copy */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                  Coming Soon
                </div>

                <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Gmail Sync —
                  <span className="block bg-[linear-gradient(135deg,#fca5a5,#f87171,#fb923c)] bg-clip-text text-transparent">
                    your inbox updates your tracker.
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-400">
                  Connect Gmail once. Tracktern automatically detects offer letters, rejection emails, and interview invites — and updates your pipeline without you lifting a finger.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    { icon: "📬", text: "Auto-detect offers, rejections, and interview invites" },
                    { icon: "🔔", text: "Get notified the moment a company replies" },
                    { icon: "🗂️", text: "Full company email history inside each application card" },
                    { icon: "✅", text: "Zero manual updates — ever" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 text-sm text-zinc-300">
                      <span className="text-base">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    onClick={openSignUp}
                    className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20 hover:border-amber-500/50"
                  >
                    Get early access
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right: mock inbox preview */}
              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-[radial-gradient(circle,rgba(234,67,53,0.15),transparent_65%)] blur-2xl" />
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0e0e16] p-5">

                  {/* Fake browser bar */}
                  <div className="mb-4 flex items-center gap-2 border-b border-white/8 pb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500/70" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/70" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
                    <div className="ml-3 flex-1 rounded-lg bg-white/5 px-3 py-1 text-xs text-zinc-500">
                      tracktern.com/dashboard
                    </div>
                  </div>

                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Gmail Sync — auto-synced from your inbox
                  </p>

                  {/* Mock email items */}
                  {[
                    { emoji: "🎉", company: "Microsoft", preview: "Congratulations! We're excited to offer...", time: "2m ago", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
                    { emoji: "📅", company: "Google", preview: "Interview scheduled for Thursday, Apr 24...", time: "1h ago", color: "text-sky-400", bg: "bg-sky-500/8 border-sky-500/20" },
                    { emoji: "🔥", company: "Razorpay", preview: "Moving you to the next round — details...", time: "3h ago", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20" },
                    { emoji: "✅", company: "Flipkart", preview: "We received your application and will...", time: "1d ago", color: "text-zinc-400", bg: "bg-white/4 border-white/8" },
                  ].map((item) => (
                    <div
                      key={item.company}
                      className={`mb-2 flex items-start gap-3 rounded-2xl border px-4 py-3 ${item.bg}`}
                    >
                      <span className="mt-0.5 text-lg">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-semibold ${item.color}`}>{item.company}</p>
                          <p className="shrink-0 text-xs text-zinc-600">{item.time}</p>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-zinc-500">{item.preview}</p>
                      </div>
                    </div>
                  ))}

                  <p className="mt-3 text-center text-xs text-zinc-600">
                    Tracker updated automatically · No manual entry
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,58,237,0.18),rgba(56,189,248,0.08),rgba(12,12,20,0.98))] p-10 shadow-[0_35px_120px_rgba(0,0,0,0.38)] sm:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Ready when you are</p>

              {/* ✅ NEW: Actual user-facing CTA copy */}
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Your placement season
                <span className="block bg-[linear-gradient(135deg,#c4b5fd,#818cf8,#67e8f9)] bg-clip-text text-transparent">
                  starts here.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300/80">
                Stop guessing which companies you applied to. Stop missing follow-up windows.
                Stop preparing at the last minute. Tracktern gives you the structure to show up to every interview confident and prepared — for free.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  100% free, no credit card
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Set up in under 2 minutes
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Built by a student, for students
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                onClick={openSignUp}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-black transition hover:scale-[1.02]"
              >
                Start tracking — it's free
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={openSignIn}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/6 px-6 py-6 text-center text-sm text-zinc-500">
        Tracktern — Built by Ayush &nbsp;·&nbsp;{" "}
        <Link href="/community" className="text-zinc-400 transition hover:text-white">
          Community
        </Link>
      </footer>
    </div>
  )
}