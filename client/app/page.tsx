"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Code2,
  Eye,
  EyeOff,
  FileSearch,
  FileText,
  Mail,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { getToken, loginUser, registerUser, saveToken, saveUser } from "@/lib/api"

const PRODUCT_PILLARS = [
  {
    eyebrow: "Track",
    title: "Applications, statuses, deadlines, and pipeline visibility",
    description: "Replace messy sheets with a clean application workspace that shows stage progression, company type, and momentum.",
    icon: Briefcase,
    accent: "border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.12),rgba(15,15,24,0.94))]",
  },
  {
    eyebrow: "Prepare",
    title: "AI prep, mock interviews, and resume analysis",
    description: "Move from applying to actually getting ready with role-targeted prep plans, mock rounds, and resume feedback.",
    icon: Brain,
    accent: "border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),rgba(15,15,24,0.94))]",
  },
  {
    eyebrow: "Improve",
    title: "Analytics, skill gaps, and conversion insights",
    description: "See where your pipeline leaks, which roles perform best, and which skills are holding back interview conversion.",
    icon: TrendingUp,
    accent: "border-amber-500/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.12),rgba(15,15,24,0.94))]",
  },
]

const FEATURE_GRID = [
  {
    title: "Application Kanban",
    description: "Track applied, shortlisted, interview, offer, and rejected stages with company type and deadline context.",
    icon: Briefcase,
  },
  {
    title: "Advanced Analytics",
    description: "Trend charts, period comparisons, funnel leaks, top roles, and role-level success insights.",
    icon: BarChart3,
  },
  {
    title: "AI Prep Workspace",
    description: "Generate targeted interview questions, revision priorities, and 3-day prep plans per company.",
    icon: Sparkles,
  },
  {
    title: "Mock Interviews",
    description: "Practice technical, behavioral, custom, and resume-based rounds with AI-generated questions.",
    icon: Brain,
  },
  {
    title: "Resume Analyzer",
    description: "Upload or paste your resume and get company-role specific feedback, missing keywords, and quick wins.",
    icon: FileSearch,
  },
  {
    title: "Follow-up Emails",
    description: "Generate polished follow-up drafts based on the application stage and target role.",
    icon: Mail,
  },
  {
    title: "Interview Calendar",
    description: "Keep deadlines, interviews, and follow-ups visible in one planning surface.",
    icon: Calendar,
  },
  {
    title: "Skill Gap Analysis",
    description: "See which skills are most demanded across your applications and where you still have coverage gaps.",
    icon: Target,
  },
  {
    title: "Daily Practice",
    description: "Keep momentum with structured coding practice so prep does not stop after applying.",
    icon: Code2,
  },
  {
    title: "Interview Journal",
    description: "Capture what happened in rounds, what you learned, and what to improve before the next one.",
    icon: BookOpen,
  },
  {
    title: "Community Intel",
    description: "Browse shared interview experiences and external community signals inside the same workflow.",
    icon: Users,
  },
  {
    title: "Student-Friendly Setup",
    description: "One platform for internship hunting instead of juggling docs, sheets, notes, and prep tools separately.",
    icon: Zap,
  },
]

const WORKFLOW_STEPS = [
  {
    label: "01",
    title: "Capture every opportunity",
    text: "Save company, role, company type, deadline, and status the moment you apply.",
  },
  {
    label: "02",
    title: "Prep with context",
    text: "Generate tailored prep plans, resume suggestions, and follow-up emails for that exact role.",
  },
  {
    label: "03",
    title: "Review the pipeline",
    text: "Use analytics to see trends, drop-offs, top-performing roles, and company mix.",
  },
  {
    label: "04",
    title: "Improve every cycle",
    text: "Use skill gap analysis, daily practice, and journal notes to iterate with each application batch.",
  },
]

const SHOWCASE_TABS = [
  {
    label: "Pipeline",
    title: "A real internship CRM, not just a tracker",
    points: ["Status-aware application board", "Company type tagging", "Recent pipeline activity", "Cleaner dashboard hierarchy"],
    metrics: [
      { label: "Applications", value: "38", tone: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
      { label: "Interviews", value: "7", tone: "bg-violet-500/15 text-violet-300 border-violet-500/20" },
      { label: "Offers", value: "2", tone: "bg-green-500/15 text-green-300 border-green-500/20" },
    ],
  },
  {
    label: "Analytics",
    title: "See trends, comparisons, and conversion leaks",
    points: ["Applications over time", "This week vs last week", "Biggest drop-off insight", "Success rate by role"],
    metrics: [
      { label: "Response rate", value: "42%", tone: "bg-amber-500/15 text-amber-300 border-amber-500/20" },
      { label: "Best role", value: "SWE", tone: "bg-violet-500/15 text-violet-300 border-violet-500/20" },
      { label: "Top type", value: "Product", tone: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
    ],
  },
  {
    label: "AI Stack",
    title: "From resume to follow-up, AI is built into the workflow",
    points: ["Resume analyzer", "Mock interview rounds", "AI prep plans", "Follow-up email drafting"],
    metrics: [
      { label: "Questions", value: "10", tone: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
      { label: "Prep plan", value: "3 days", tone: "bg-violet-500/15 text-violet-300 border-violet-500/20" },
      { label: "Quick wins", value: "6", tone: "bg-green-500/15 text-green-300 border-green-500/20" },
    ],
  },
]

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeShowcase, setActiveShowcase] = useState(0)

  useEffect(() => {
    const token = getToken()
    if (token) window.location.href = "/dashboard"
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveShowcase((current) => (current + 1) % SHOWCASE_TABS.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = isLogin
        ? await loginUser(email, password)
        : await registerUser(name, email, password)

      if (data.token) {
        saveToken(data.token)
        saveUser(data.user)
        window.location.href = "/dashboard"
      } else {
        setError(data.message || "Something went wrong")
      }
    } catch {
      setError("Cannot connect to server.")
    }

    setLoading(false)
  }

  const activePanel = SHOWCASE_TABS[activeShowcase]

  if (showAuth) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080f] p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.28),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />

        <div className="relative z-10 w-full max-w-md">
          <button
            onClick={() => setShowAuth(false)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back
          </button>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(15,15,25,0.9)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)]">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-white">Tracktern</p>
                <p className="text-sm text-gray-500">Internship operating system</p>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white">{isLogin ? "Welcome back" : "Create your workspace"}</h2>
            <p className="mb-6 mt-1 text-sm text-gray-500">
              {isLogin ? "Sign in to manage applications, prep, and analytics." : "Start tracking applications and interview prep in one place."}
            </p>

            <div className="mb-5 flex rounded-xl border border-white/8 bg-white/5 p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${isLogin ? "bg-violet-600 text-white" : "text-gray-500 hover:text-white"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${!isLogin ? "bg-violet-600 text-white" : "text-gray-500 hover:text-white"}`}
              >
                Sign Up
              </button>
            </div>

            {error ? <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div> : null}

            <form className="space-y-3" onSubmit={handleSubmit}>
              {!isLogin ? (
                <Input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-600"
                />
              ) : null}

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-600"
                />
              </div>

              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 pr-10 text-white placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 transition-colors hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Free Account"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              {isLogin ? "No account? " : "Have an account? "}
              <button
                onClick={() => {
                  setIsLogin((current) => !current)
                  setError("")
                }}
                className="font-bold text-violet-400 transition-colors hover:text-violet-300"
              >
                {isLogin ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08080f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(59,130,246,0.14),transparent_22%),linear-gradient(180deg,#08080f_0%,#090913_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.12]" />

      <div className="relative z-10">
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-[rgba(8,8,15,0.78)] backdrop-blur-2xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)]">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-white">Tracktern</p>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Internship OS</p>
              </div>
            </div>

            <div className="hidden items-center gap-6 md:flex">
              <a href="#features" className="text-sm text-gray-400 transition-colors hover:text-white">Features</a>
              <a href="#platform" className="text-sm text-gray-400 transition-colors hover:text-white">Platform</a>
              <a href="#workflow" className="text-sm text-gray-400 transition-colors hover:text-white">Workflow</a>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowAuth(true)
                  setIsLogin(true)
                }}
                className="rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowAuth(true)
                  setIsLogin(false)
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_32px_rgba(124,58,237,0.32)] transition hover:scale-[1.02] hover:opacity-95"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </nav>

        <section className="px-6 pb-18 pt-32">
          <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-200">
                <span className="inline-block h-2 w-2 rounded-full bg-violet-400" />
                Built for internship pipelines
              </div>

              <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.04em] text-white sm:text-6xl xl:text-7xl">
                The SaaS workspace for
                <span className="block bg-[linear-gradient(135deg,#d8b4fe_0%,#93c5fd_52%,#67e8f9_100%)] bg-clip-text text-transparent">
                  applying, prepping, and improving
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
                Tracktern brings your application board, analytics, AI prep, resume feedback, follow-up drafts,
                calendar, practice, journal, and community intel into one focused workflow.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => {
                    setShowAuth(true)
                    setIsLogin(false)
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] px-8 py-4 text-base font-black text-white shadow-[0_18px_48px_rgba(124,58,237,0.3)] transition hover:scale-[1.02]"
                >
                  Create free account
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setShowAuth(true)
                    setIsLogin(true)
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-gray-200 transition hover:border-white/20 hover:bg-white/7"
                >
                  Sign in
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Track", text: "Applications, stages, deadlines, company type" },
                  { label: "Prepare", text: "AI prep plans, mock interviews, resume analyzer" },
                  { label: "Improve", text: "Analytics, skill gaps, journal, daily practice" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-[radial-gradient(circle,rgba(124,58,237,0.28),transparent_60%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(13,13,21,0.92)] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Tracktern workspace</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Product mock</p>
                  </div>
                  <div className="flex gap-2">
                    {SHOWCASE_TABS.map((tab, index) => (
                      <button
                        key={tab.label}
                        onClick={() => setActiveShowcase(index)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${activeShowcase === index ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:text-white"}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[0.28fr_0.72fr]">
                  <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Modules</p>
                    <div className="mt-4 space-y-2">
                      {[
                        "Dashboard",
                        "Applications",
                        "Analytics",
                        "AI Prep",
                        "Mock Interview",
                        "Resume",
                        "Follow-up",
                      ].map((item) => {
                        const isActive =
                          (activeShowcase === 0 && item === "Applications") ||
                          (activeShowcase === 1 && item === "Analytics") ||
                          (activeShowcase === 2 && item === "AI Prep")

                        return (
                          <div
                            key={item}
                            className={`rounded-2xl border px-3 py-2 text-sm transition ${
                              isActive
                                ? "border-violet-500/30 bg-violet-500/14 text-white"
                                : "border-white/6 bg-white/[0.02] text-gray-400"
                            }`}
                          >
                            {item}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Live surface</p>
                          <h3 className="mt-3 text-2xl font-bold text-white">{activePanel.title}</h3>
                        </div>
                        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-right">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Mode</p>
                          <p className="mt-1 text-sm font-semibold text-white">{activePanel.label}</p>
                        </div>
                      </div>

                      <div className="mt-5">
                        {activeShowcase === 0 ? <PipelineMock /> : null}
                        {activeShowcase === 1 ? <AnalyticsMock /> : null}
                        {activeShowcase === 2 ? <AIStackMock /> : null}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {activePanel.metrics.map((metric) => (
                        <div key={metric.label} className={`rounded-2xl border px-4 py-4 ${metric.tone}`}>
                          <p className="text-[11px] uppercase tracking-[0.18em]">{metric.label}</p>
                          <p className="mt-2 text-2xl font-black">{metric.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[24px] border border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.14),rgba(15,15,24,0.92))] p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-violet-200/70">What makes it different</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {activePanel.points.map((point) => (
                          <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-background/30 p-3">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-300" />
                            <p className="text-sm text-gray-300">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Platform</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                A broader product than the landing page used to show
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-400">
                The app already had many product surfaces that were invisible on the homepage. Now the landing page presents
                the product like a real SaaS suite instead of a single-page tracker.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {PRODUCT_PILLARS.map((pillar) => (
                <div key={pillar.title} className={`rounded-[28px] border p-6 ${pillar.accent}`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-background/35">
                    <pillar.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.2em] text-gray-500">{pillar.eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-300">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Feature Stack</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Everything the product actually ships today
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-gray-400">
                This section now mirrors the dashboard capabilities instead of hiding them. The goal is clearer recognition:
                visitors should understand this is an internship operating system.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {FEATURE_GRID.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 transition hover:-translate-y-1 hover:border-white/14"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="px-6 py-10">
          <div className="mx-auto max-w-7xl rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 sm:p-8 lg:p-10">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Workflow</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                How Tracktern fits the full internship cycle
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-400">
                The landing page now explains the operating model: capture opportunities, prep with context, review the
                pipeline, and improve the next batch using actual feedback loops.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              {WORKFLOW_STEPS.map((step) => (
                <div key={step.label} className="rounded-[24px] border border-white/8 bg-background/30 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">{step.label}</p>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-18">
          <div className="mx-auto max-w-6xl rounded-[36px] border border-violet-500/20 bg-[linear-gradient(135deg,rgba(124,58,237,0.18),rgba(59,130,246,0.08),rgba(15,15,24,0.95))] p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.32)] sm:p-12">
            <p className="text-xs uppercase tracking-[0.22em] text-violet-200/70">Ready to use the full platform?</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Stop stitching together five tools for one internship hunt
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-300">
              Track applications, understand the pipeline, prepare smarter, and improve every cycle from one SaaS-style workspace.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => {
                  setShowAuth(true)
                  setIsLogin(false)
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-black text-black transition hover:opacity-90"
              >
                Start free
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setShowAuth(true)
                  setIsLogin(true)
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Sign in
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function PipelineMock() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Applied", value: "38", tone: "border-blue-500/20 bg-blue-500/10 text-blue-300" },
          { label: "Interview", value: "7", tone: "border-violet-500/20 bg-violet-500/10 text-violet-300" },
          { label: "Offer", value: "2", tone: "border-green-500/20 bg-green-500/10 text-green-300" },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl border p-4 ${item.tone}`}>
            <p className="text-[11px] uppercase tracking-[0.18em]">{item.label}</p>
            <p className="mt-2 text-2xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            title: "Applied",
            tone: "border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.12),rgba(17,17,24,0.92))]",
            cards: ["Google · SWE", "Notion · PM"],
          },
          {
            title: "Interview",
            tone: "border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),rgba(17,17,24,0.92))]",
            cards: ["Razorpay · SDE", "Adobe · Intern"],
          },
          {
            title: "Offer",
            tone: "border-green-500/20 bg-[linear-gradient(180deg,rgba(34,197,94,0.12),rgba(17,17,24,0.92))]",
            cards: ["Postman · SWE"],
          },
        ].map((column) => (
          <div key={column.title} className={`rounded-2xl border p-3 ${column.tone}`}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{column.title}</p>
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-gray-300">{column.cards.length}</span>
            </div>
            <div className="space-y-2">
              {column.cards.map((card) => (
                <div key={card} className="rounded-xl border border-white/8 bg-background/35 p-3">
                  <p className="text-sm font-medium text-white">{card}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-gray-500">Company type tagged</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsMock() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.12),rgba(17,17,24,0.92))] p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-blue-200/70">Applications over time</p>
              <p className="mt-2 text-sm text-white">Trend view</p>
            </div>
            <p className="text-xs text-blue-200/70">Last 30 days</p>
          </div>
          <div className="mt-4 flex h-32 items-end gap-2">
            {[28, 44, 39, 52, 48, 61, 58, 72].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-xl bg-blue-400/80 transition-all duration-500" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Comparison</p>
            <p className="mt-2 text-2xl font-black text-white">+20%</p>
            <p className="mt-1 text-sm text-gray-400">Applications vs last month</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">Biggest drop-off</p>
            <p className="mt-2 text-lg font-bold text-white">60% after application</p>
            <p className="mt-1 text-sm text-gray-300">Tighten resume targeting</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { role: "SWE", rate: "40%" },
          { role: "Product", rate: "28%" },
          { role: "Data", rate: "18%" },
        ].map((item) => (
          <div key={item.role} className="rounded-2xl border border-white/8 bg-background/35 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{item.role}</p>
            <p className="mt-2 text-xl font-bold text-white">{item.rate}</p>
            <div className="mt-3 h-2 rounded-full bg-white/8">
              <div className="h-2 rounded-full bg-violet-400" style={{ width: item.rate }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AIStackMock() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),rgba(17,17,24,0.92))] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-violet-200/70">AI prep plan</p>
          <div className="mt-4 space-y-3">
            {["Revise JavaScript closures", "Mock interview on projects", "Follow-up email for recruiter"].map((task, index) => (
              <div key={task} className="flex items-start gap-3 rounded-xl border border-white/8 bg-background/35 p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-200">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-200">{task}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-blue-300">Resume analyzer</p>
            <p className="mt-2 text-lg font-bold text-white">ATS score 84</p>
            <p className="mt-1 text-sm text-gray-300">Missing: metrics, TypeScript, system design</p>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-green-300">Follow-up draft</p>
            <p className="mt-2 text-sm leading-6 text-gray-200">
              “Thanks again for the interview. I enjoyed discussing my project work and wanted to reiterate my interest...”
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {["Mock Interview", "Resume Review", "Skill Gaps", "Journal Notes"].map((item) => (
          <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
            <p className="text-sm font-semibold text-white">{item}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-gray-500">Integrated</p>
          </div>
        ))}
      </div>
    </div>
  )
}
