"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  ChevronRight,
  Code2,
  Eye,
  EyeOff,
  FileSearch,
  FileText,
  Mail,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { getToken, loginUser, registerUser, saveToken, saveUser } from "@/lib/api"

const PREVIEW_TABS = ["Dashboard", "Applications", "AI Prep", "Analytics", "Resume", "Follow-up", "Calendar", "Practice"]

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const token = getToken()
    if (token) window.location.href = "/dashboard"
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((prev) => (prev + 1) % PREVIEW_TABS.length), 3200)
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

  if (showAuth) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
        style={{ background: "radial-gradient(ellipse at 50% -20%, #3b1f6e 0%, #080810 55%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 opacity-30"
            style={{ background: "radial-gradient(ellipse,#7c3aed,transparent 70%)" }}
          />
        </div>
        <div className="relative z-10 w-full max-w-md">
          <button
            onClick={() => setShowAuth(false)}
            className="mb-6 flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
          >
            ← Back
          </button>
          <div
            className="rounded-2xl border border-white/10 p-8"
            style={{ background: "rgba(15,15,25,0.9)", backdropFilter: "blur(24px)" }}
          >
            <div className="mb-6 flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
              >
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">Tracktern</span>
            </div>
            <h2 className="mb-1 text-2xl font-black text-white">{isLogin ? "Welcome back" : "Create your account"}</h2>
            <p className="mb-6 text-sm text-gray-500">
              {isLogin ? "Sign in to your dashboard" : "Free forever. No credit card needed."}
            </p>
            <div className="mb-5 flex rounded-xl border border-white/8 bg-white/5 p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${isLogin ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${!isLogin ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
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
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-sm text-white placeholder:text-gray-600"
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
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-sm text-white placeholder:text-gray-600"
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
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 pr-10 text-sm text-white placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-xl text-sm font-black text-white transition-all hover:scale-[1.01] hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 8px 32px rgba(124,58,237,0.4)" }}
              >
                {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Free Account →"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              {isLogin ? "No account? " : "Have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
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
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#08080f", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes pulse-glow { 0%,100% { box-shadow:0 0 40px rgba(124,58,237,0.3); } 50% { box-shadow:0 0 80px rgba(124,58,237,0.6); } }
        .fade-up-1 { animation: fadeUp 0.7s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.2s both; }
        .fade-up-3 { animation: fadeUp 0.7s ease 0.3s both; }
        .fade-up-4 { animation: fadeUp 0.7s ease 0.4s both; }
        .ticker-wrap { overflow:hidden; }
        .ticker-track { display:flex; animation: ticker 25s linear infinite; white-space:nowrap; }
        .card-hover { transition: transform 0.2s ease, border-color 0.2s ease; }
        .card-hover:hover { transform: translateY(-3px); }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(8,8,15,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">Tracktern</span>
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
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pt-32 pb-8" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.25) 0%,transparent 65%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(124,58,237,0.08) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to top,#08080f,transparent)" }} />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <div className="mb-12 text-center">
            <div
              className="fade-up-1 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest"
              style={{ background: "rgba(124,58,237,0.12)", borderColor: "rgba(124,58,237,0.35)", color: "#c4b5fd" }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              AI-Powered Internship Tracker
            </div>

            <h1 className="fade-up-2 mb-6 font-black leading-[0.92] tracking-tight text-white" style={{ fontSize: "clamp(52px,8vw,96px)" }}>
              Land your
              <br />
              <span style={{ background: "linear-gradient(135deg,#c4b5fd 0%,#818cf8 50%,#67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                dream internship
              </span>
            </h1>

            <p className="fade-up-3 mx-auto mb-10 max-w-[620px] text-gray-400 leading-relaxed" style={{ fontSize: "clamp(16px,2vw,20px)" }}>
              Stop losing track on Excel sheets and WhatsApp.
              <br />
              Tracktern organizes applications, prep, analytics, and follow-ups in one place.
            </p>

            <div className="fade-up-4 mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => {
                  setShowAuth(true)
                  setIsLogin(false)
                }}
                className="flex items-center gap-2.5 rounded-2xl px-9 py-4 text-lg font-black text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 50px rgba(124,58,237,0.45)", animation: "pulse-glow 3s ease-in-out infinite" }}
              >
                Get Started Free <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setShowAuth(true)
                  setIsLogin(true)
                }}
                className="flex items-center gap-2 rounded-2xl border px-7 py-4 text-base font-bold text-gray-300 transition-all hover:border-white/25 hover:text-white"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
              >
                Sign In <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="fade-up-4 mb-14 flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {[["A", "#7c3aed"], ["R", "#4f46e5"], ["P", "#0ea5e9"], ["S", "#10b981"], ["K", "#f59e0b"], ["M", "#ec4899"]].map(([label, color], index) => (
                  <div key={index} className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black text-white" style={{ background: color, borderColor: "#08080f" }}>
                    {label}
                  </div>
                ))}
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm text-gray-500">Loved by 100+ students</span>
            </div>
          </div>

          <div className="relative mx-auto" style={{ maxWidth: "940px" }}>
            <div className="absolute -inset-2 rounded-3xl opacity-40 blur-2xl" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }} />
            <div className="relative overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(12,12,22,0.95)", backdropFilter: "blur(10px)" }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
                  <div className="h-3 w-3 rounded-full" style={{ background: "#ffbd2e" }} />
                  <div className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
                </div>
                <div className="mx-4 flex h-6 flex-1 items-center rounded-lg px-3 text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
                  tracktern.com/dashboard
                </div>
                <div className="flex gap-2">
                  {PREVIEW_TABS.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className="cursor-pointer rounded-full transition-all"
                      style={{ width: index === activeSlide ? "20px" : "6px", height: "6px", background: index === activeSlide ? "#7c3aed" : "rgba(255,255,255,0.2)" }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-6" style={{ minHeight: "430px" }}>
                {activeSlide === 0 ? <DashboardSlide /> : null}
                {activeSlide === 1 ? <ApplicationsSlide /> : null}
                {activeSlide === 2 ? <AIPrepSlide /> : null}
                {activeSlide === 3 ? <AnalyticsSlide /> : null}
                {activeSlide === 4 ? <ResumeSlide /> : null}
                {activeSlide === 5 ? <FollowUpSlide /> : null}
                {activeSlide === 6 ? <CalendarSlide /> : null}
                {activeSlide === 7 ? <PracticeSlide /> : null}
              </div>

              <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                {PREVIEW_TABS.map((label, index) => (
                  <button
                    key={label}
                    onClick={() => setActiveSlide(index)}
                    className="rounded-full px-3 py-1.5 text-xs font-bold transition-all"
                    style={{
                      background: index === activeSlide ? "rgba(124,58,237,0.25)" : "transparent",
                      color: index === activeSlide ? "#c4b5fd" : "rgba(255,255,255,0.3)",
                      border: index === activeSlide ? "1px solid rgba(124,58,237,0.4)" : "1px solid transparent",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y py-4" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...Array(2)].map((_, rep) => (
              <div key={rep} className="flex items-center gap-8 px-4">
                {[
                  "Application Tracker",
                  "AI Interview Prep",
                  "Resume Analyzer",
                  "Follow-up Emails",
                  "Interview Calendar",
                  "Advanced Analytics",
                  "Skill Gap Analyzer",
                  "Daily Practice",
                  "Community Experiences",
                  "Interview Journal",
                  "100% Free",
                ].map((item) => (
                  <div key={item} className="flex shrink-0 items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#7c3aed" }} />
                    <span className="whitespace-nowrap text-sm font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
          {[
            { value: "100%", label: "Free Forever" },
            { value: "11+", label: "Powerful Features" },
            { value: "700+", label: "DSA Problems" },
            { value: "AI", label: "Powered Prep" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="mb-1 text-3xl font-black" style={{ background: "linear-gradient(135deg,#c4b5fd,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-white font-black tracking-tight" style={{ fontSize: "clamp(32px,5vw,52px)" }}>Sound familiar?</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px" }}>Every student faces this. Most never fix it.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-hover rounded-2xl p-8" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <div className="mb-5 text-xs font-black uppercase tracking-widest" style={{ color: "#f87171" }}>😓 Without Tracktern</div>
              {[
                "Applications lost in WhatsApp & email",
                "Excel sheets nobody updates",
                "Missing deadlines and follow-ups",
                "Zero prep strategy before interviews",
                "No clue which skills you're missing",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3 py-3" style={{ borderBottom: index < 4 ? "1px solid rgba(239,68,68,0.08)" : "none" }}>
                  <span className="mt-0.5 shrink-0 font-black" style={{ color: "#ef4444" }}>✕</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="card-hover rounded-2xl p-8" style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <div className="mb-5 text-xs font-black uppercase tracking-widest" style={{ color: "#a78bfa" }}>✅ With Tracktern</div>
              {[
                "One dashboard — every application tracked",
                "AI prep, resume help, and follow-up drafts",
                "Analytics so you see pipeline leaks",
                "Know exactly which skills to build",
                "Land more interviews, convert more offers",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3 py-3" style={{ borderBottom: index < 4 ? "1px solid rgba(124,58,237,0.08)" : "none" }}>
                  <span className="mt-0.5 shrink-0 font-black" style={{ color: "#7c3aed" }}>✓</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-black uppercase tracking-widest" style={{ color: "#7c3aed" }}>Everything included · Free</p>
            <h2 className="font-black tracking-tight text-white" style={{ fontSize: "clamp(32px,5vw,52px)" }}>
              One app. Every tool
              <br />
              you need.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: BarChart3, color: "#7c3aed", title: "Application Tracker", tag: "Core", desc: "Kanban board with status flow, company type, deadlines, and a cleaner dashboard overview." },
              { icon: Brain, color: "#0ea5e9", title: "AI Interview Prep", tag: "AI ✨", desc: "Top questions, skills to revise, and personalized prep plans for any company and role." },
              { icon: TrendingUp, color: "#f59e0b", title: "Advanced Analytics", tag: "Smart", desc: "Trends, comparisons, funnel leaks, top-performing roles, and company-type insights." },
              { icon: FileSearch, color: "#10b981", title: "Resume Analyzer", tag: "AI", desc: "Upload or paste your resume to get targeted feedback, missing keywords, and quick wins." },
              { icon: Mail, color: "#14b8a6", title: "Follow-up Emails", tag: "Workflow", desc: "Generate polished follow-up drafts that match the company, role, and application stage." },
              { icon: Calendar, color: "#6366f1", title: "Interview Calendar", tag: "Planning", desc: "See deadlines, interviews, and follow-ups in one place instead of juggling reminders." },
              { icon: Target, color: "#ef4444", title: "Skill Gap Analyzer", tag: "Growth", desc: "See exactly which skills companies want and where you still need to improve." },
              { icon: Code2, color: "#a78bfa", title: "Daily Practice", tag: "DSA", desc: "Pattern-wise practice with 700+ curated problems so preparation stays consistent." },
              { icon: BookOpen, color: "#f97316", title: "Interview Journal", tag: "Reflection", desc: "Write down what happened in rounds so every interview improves the next one." },
              { icon: Users, color: "#ec4899", title: "Community", tag: "Social", desc: "Explore real interview experiences and community signals inside the same workflow." },
              { icon: Sparkles, color: "#22c55e", title: "AI Mock Interview", tag: "Practice", desc: "Practice technical, behavioral, custom, and resume-based rounds with AI." },
              { icon: Zap, color: "#facc15", title: "Gmail Sync", tag: "Coming Soon", desc: "Auto-detect offers, interviews, and rejections so your tracker updates itself." },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card-hover rounded-2xl p-6"
                style={{
                  background: `linear-gradient(180deg,${feature.color}12,rgba(255,255,255,0.03))`,
                  border: `1px solid ${feature.color}25`,
                }}
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${feature.color}18` }}>
                    <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-xs font-black" style={{ background: `${feature.color}18`, color: feature.color }}>{feature.tag}</span>
                </div>
                <h3 className="mb-2 text-lg font-black text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div
            className="relative overflow-hidden rounded-3xl p-10"
            style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))", border: "1px solid rgba(16,185,129,0.15)" }}
          >
            <div className="absolute top-0 right-0 h-64 w-64 opacity-10" style={{ background: "radial-gradient(circle,#10b981,transparent 70%)" }} />
            <div className="relative z-10 grid items-center gap-10 md:grid-cols-2">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-widest" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Coming Soon
                </div>
                <h3 className="mb-4 font-black tracking-tight text-white" style={{ fontSize: "clamp(28px,4vw,40px)" }}>Gmail Auto-Detection</h3>
                <p className="mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Connect Gmail and Tracktern automatically detects offer letters, rejection emails,
                  and interview invites — updating your tracker without lifting a finger.
                </p>
                {[
                  "Auto-detect offers & rejections",
                  "Interview invite notifications",
                  "Full company email history",
                  "Zero manual updates ever",
                ].map((item) => (
                  <div key={item} className="mb-2.5 flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#10b981" }} />
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{item}</span>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setShowAuth(true)
                    setIsLogin(false)
                  }}
                  className="mt-6 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
                >
                  Get Early Access <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl" style={{ background: "rgba(8,8,15,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" style={{ color: "#10b981" }} />
                    <span className="text-sm font-black text-white">Gmail Sync</span>
                  </div>
                  <span className="rounded-full px-2 py-1 text-xs font-bold" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>Coming Soon</span>
                </div>
                <div className="space-y-2.5 p-4">
                  {[
                    { company: "Google", message: "Interview scheduled for...", color: "#f59e0b", icon: "📅", time: "2m ago" },
                    { company: "Microsoft", message: "Congratulations! Offer...", color: "#10b981", icon: "🎉", time: "1h ago" },
                    { company: "Flipkart", message: "Application received...", color: "#7c3aed", icon: "✅", time: "3h ago" },
                    { company: "Razorpay", message: "Moving to next round...", color: "#0ea5e9", icon: "🔥", time: "1d ago" },
                  ].map((item) => (
                    <div key={item.company} className="flex items-center gap-3 rounded-xl p-3 transition-colors" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base" style={{ background: `${item.color}18` }}>
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-white">{item.company}</div>
                        <div className="truncate text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{item.message}</div>
                      </div>
                      <div className="shrink-0 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>{item.time}</div>
                    </div>
                  ))}
                  <div className="pt-1 text-center text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Auto-synced from your inbox</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-15" style={{ background: "radial-gradient(ellipse,#7c3aed,transparent 65%)" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="mb-5 font-black leading-[0.92] tracking-tight text-white" style={{ fontSize: "clamp(40px,7vw,72px)" }}>
            Ready to land
            <br />
            <span style={{ background: "linear-gradient(135deg,#c4b5fd,#818cf8,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              your internship?
            </span>
          </h2>
          <p className="mb-10 text-lg" style={{ color: "rgba(255,255,255,0.4)" }}>
            Join students who stopped guessing and started tracking.
          </p>
          <button
            onClick={() => {
              setShowAuth(true)
              setIsLogin(false)
            }}
            className="inline-flex items-center gap-3 rounded-2xl px-12 py-5 text-xl font-black text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 0 80px rgba(124,58,237,0.5)" }}
          >
            Start Tracking Free <ArrowRight className="h-6 w-6" />
          </button>
          <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>No credit card · Free forever · Built by a student</p>
        </div>
      </section>

      <footer className="px-6 py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              <Rocket className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Tracktern — Built by Ayush</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            <button onClick={() => { setShowAuth(true); setIsLogin(false) }} className="transition-colors hover:text-white">Sign Up</button>
            <button onClick={() => { setShowAuth(true); setIsLogin(true) }} className="transition-colors hover:text-white">Sign In</button>
            <a href="/community" className="flex items-center gap-1 transition-colors hover:text-white">
              <Users className="h-3.5 w-3.5" /> Community
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function DashboardSlide() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-lg font-black text-white">Hey Ayush 👋</div>
          <div className="text-sm text-gray-500">Your internship dashboard</div>
        </div>
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
          🔥 3 day streak
        </div>
      </div>
      <div className="mb-5 grid grid-cols-4 gap-3">
        {[
          { value: "12", label: "Applied", color: "#7c3aed", progress: 60 },
          { value: "4", label: "Shortlisted", color: "#0ea5e9", progress: 33 },
          { value: "2", label: "Interview", color: "#f59e0b", progress: 17 },
          { value: "1", label: "Offer 🎉", color: "#10b981", progress: 8 },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="mb-1 text-2xl font-black text-white">{item.value}</div>
            <div className="mb-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.label}</div>
            <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-1 rounded-full" style={{ width: `${item.progress}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="grid grid-cols-4 px-4 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)" }}>
          <span>Company</span><span>Role</span><span>Date</span><span>Status</span>
        </div>
        {[
          { company: "Google", role: "SWE Intern", date: "Apr 10", status: "Interview", color: "#f59e0b" },
          { company: "Microsoft", role: "PM Intern", date: "Apr 8", status: "Shortlisted", color: "#0ea5e9" },
          { company: "Flipkart", role: "SDE Intern", date: "Apr 5", status: "Applied", color: "#7c3aed" },
          { company: "Razorpay", role: "Backend", date: "Apr 3", status: "Offer", color: "#10b981" },
        ].map((row) => (
          <div key={row.company} className="grid grid-cols-4 items-center px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <span className="text-sm font-bold text-white">{row.company}</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{row.role}</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>{row.date}</span>
            <span className="w-fit rounded-full px-2.5 py-1 text-xs font-black" style={{ background: `${row.color}20`, color: row.color }}>{row.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApplicationsSlide() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-lg font-black text-white">Applications</div>
          <div className="text-sm text-gray-500">Kanban board view</div>
        </div>
        <div className="rounded-lg px-3 py-1.5 text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>+ Add Company</div>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {[
          { title: "Applied", dot: "#3b82f6", cards: ["Google — ML", "Amazon — SDE"] },
          { title: "Shortlisted", dot: "#f59e0b", cards: ["Microsoft — PM"] },
          { title: "Interview", dot: "#8b5cf6", cards: ["JPMorgan — SWE"] },
          { title: "Offer", dot: "#10b981", cards: ["Postman — SWE"] },
          { title: "Rejected", dot: "#ef4444", cards: [] },
        ].map((column) => (
          <div key={column.title}>
            <div className="mb-2 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ background: column.dot }} />
              <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>{column.title}</span>
            </div>
            <div className="space-y-2">
              {column.cards.map((card) => (
                <div key={card} className="rounded-lg p-2.5 text-xs font-medium text-white" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {card}
                  <div className="mt-1 text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Type tagged</div>
                </div>
              ))}
              {column.cards.length === 0 ? (
                <div className="rounded-lg p-3 text-center text-xs" style={{ border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.2)" }}>Empty</div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AIPrepSlide() {
  return (
    <div>
      <div className="mb-1 text-lg font-black text-white">AI Prep for Google</div>
      <div className="mb-5 text-sm text-gray-500">Software Engineer Intern</div>
      <div className="mb-4">
        <div className="mb-3 text-xs font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Top 10 Interview Questions</div>
        <div className="space-y-2">
          {[
            "Design a URL shortener like bit.ly",
            "Explain system design for WhatsApp",
            "What is consistent hashing?",
            "How does garbage collection work?",
            "Design an LRU cache",
          ].map((question, index) => (
            <div key={question} className="flex items-center gap-3 rounded-xl p-3 text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-black" style={{ background: "rgba(124,58,237,0.3)", color: "#c4b5fd" }}>{index + 1}</span>
              <span style={{ color: "rgba(255,255,255,0.8)" }}>{question}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-xs font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Skills to Revise</div>
        <div className="flex flex-wrap gap-2">
          {["System Design", "DSA", "OS", "DBMS", "Networking"].map((skill) => (
            <span key={skill} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(124,58,237,0.2)", color: "#c4b5fd", border: "1px solid rgba(124,58,237,0.3)" }}>{skill}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsSlide() {
  return (
    <div>
      <div className="mb-1 text-lg font-black text-white">Advanced Analytics</div>
      <div className="mb-5 text-sm text-gray-500">Trends, comparisons, and conversion insights</div>
      <div className="grid grid-cols-[1.3fr_0.7fr] gap-4">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="mb-3 text-xs font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Applications over time</div>
          <div className="flex h-36 items-end gap-2">
            {[35, 48, 44, 52, 57, 61, 54, 70].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-xl" style={{ height: `${height}%`, background: "linear-gradient(180deg,#3b82f6,#8b5cf6)" }} />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl p-4" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <div className="text-xs font-black uppercase tracking-wider" style={{ color: "#93c5fd" }}>Response rate</div>
            <div className="mt-2 text-2xl font-black text-white">42%</div>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <div className="text-xs font-black uppercase tracking-wider" style={{ color: "#fcd34d" }}>Biggest drop-off</div>
            <div className="mt-2 text-sm font-bold text-white">60% after application</div>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div className="text-xs font-black uppercase tracking-wider" style={{ color: "#c4b5fd" }}>Best role</div>
            <div className="mt-2 text-sm font-bold text-white">SWE — 40% response</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResumeSlide() {
  return (
    <div>
      <div className="mb-1 text-lg font-black text-white">Resume Analyzer</div>
      <div className="mb-5 text-sm text-gray-500">Company-role specific feedback</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="mb-3 text-xs font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Scores</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Overall", value: "84", color: "#10b981" },
              { label: "ATS", value: "79", color: "#3b82f6" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg p-3" style={{ background: `${item.color}14`, border: `1px solid ${item.color}25` }}>
                <div className="text-xs font-bold" style={{ color: item.color }}>{item.label}</div>
                <div className="mt-1 text-2xl font-black text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="mb-3 text-xs font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Missing Keywords</div>
          <div className="flex flex-wrap gap-2">
            {["TypeScript", "Metrics", "System Design", "Leadership"].map((item) => (
              <span key={item} className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
                {item}
              </span>
            ))}
          </div>
          <div className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            Quick wins: add quantified impact, tools used, and role-specific keywords.
          </div>
        </div>
      </div>
    </div>
  )
}

function FollowUpSlide() {
  return (
    <div>
      <div className="mb-1 text-lg font-black text-white">Follow-up Emails</div>
      <div className="mb-5 text-sm text-gray-500">Polished drafts in one click</div>
      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Draft preview</div>
          <span className="rounded-full px-2 py-1 text-xs font-bold" style={{ background: "rgba(16,185,129,0.14)", color: "#10b981" }}>Ready to send</span>
        </div>
        <div className="space-y-3 text-sm leading-7" style={{ color: "rgba(255,255,255,0.75)" }}>
          <p>Subject: Follow-up on Software Engineer Intern application at Google</p>
          <p>Hi team, I wanted to follow up regarding my application and reiterate my interest in the role...</p>
          <p>Best regards,<br />Ayush</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {["Subject ready", "Body generated", "Copy in 1 click"].map((item) => (
          <div key={item} className="rounded-lg p-3 text-center text-xs font-bold text-white" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.18)" }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarSlide() {
  return (
    <div>
      <div className="mb-1 text-lg font-black text-white">Interview Calendar</div>
      <div className="mb-5 text-sm text-gray-500">Deadlines, interviews, and follow-ups</div>
      <div className="grid grid-cols-[1fr_0.9fr] gap-4">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="mb-3 text-xs font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Week view</div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
              <div key={day} className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>{day}</div>
            ))}
            {[14, 15, 16, 17, 18, 19, 20].map((date, index) => (
              <div
                key={date}
                className="rounded-lg px-2 py-3 text-sm font-bold"
                style={{
                  background: index === 2 ? "rgba(124,58,237,0.2)" : index === 4 ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {date}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {[
            { title: "Google interview", color: "#8b5cf6" },
            { title: "Razorpay follow-up", color: "#10b981" },
            { title: "Adobe deadline", color: "#f59e0b" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl p-4" style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
              <div className="text-sm font-black text-white">{item.title}</div>
              <div className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Everything in one timeline</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PracticeSlide() {
  return (
    <div>
      <div className="mb-1 text-lg font-black text-white">Daily Practice</div>
      <div className="mb-5 text-sm text-gray-500">Pattern-Wise Mastery — 22 topics</div>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {[
          { title: "Array + Hashing", patterns: 2, score: "0/34" },
          { title: "Binary Search", patterns: 6, score: "0/41" },
          { title: "Dynamic Programming", patterns: 12, score: "0/166" },
          { title: "Trees", patterns: 12, score: "0/73" },
        ].map((card) => (
          <div key={card.title} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="mb-1 text-xs font-black leading-tight text-white">{card.title}</div>
            <div className="mb-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{card.patterns} patterns</div>
            <div className="mb-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-1 rounded-full" style={{ width: "5%", background: "#7c3aed" }} />
            </div>
            <div className="text-xs font-bold" style={{ color: "#c4b5fd" }}>{card.score}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-4" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
        <div className="mb-2 text-xs font-black uppercase tracking-wider" style={{ color: "rgba(196,181,253,0.7)" }}>Today's Problem</div>
        <div className="font-black text-white">Climbing Stairs</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981" }}>Easy</span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Dynamic Programming</span>
        </div>
      </div>
    </div>
  )
}
