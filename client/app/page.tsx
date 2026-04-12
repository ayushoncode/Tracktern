"use client"

import { useState, useEffect } from "react"
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, Users, Zap, BarChart3, Brain, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginUser, registerUser, saveToken, saveUser, getToken } from "@/lib/api"

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = getToken()
    if (token) window.location.href = "/dashboard"
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setError("Cannot connect to server. Try again.")
    }
    setLoading(false)
  }

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{background: "radial-gradient(ellipse at 60% 0%, #3b1f6e 0%, #0a0a0f 60%)"}}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20" style={{background: "radial-gradient(circle, #7c3aed, transparent 70%)"}} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10" style={{background: "radial-gradient(circle, #4f46e5, transparent 70%)"}} />
        </div>
        <div className="w-full max-w-md relative z-10">
          <button onClick={() => setShowAuth(false)} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
            ← Back to home
          </button>
          <div className="rounded-2xl border border-white/10 p-8" style={{background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)"}}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: "linear-gradient(135deg, #7c3aed, #4f46e5)"}}>
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">Tracktern</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{isLogin ? "Welcome back" : "Create account"}</h2>
            <p className="text-gray-400 text-sm mb-6">{isLogin ? "Sign in to your account" : "Start organizing your internship hunt"}</p>

            <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}>Sign In</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}>Sign Up</button>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

            <form className="space-y-3" onSubmit={handleSubmit}>
              {!isLogin && (
                <Input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-violet-500" />
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-violet-500" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-violet-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{background: "linear-gradient(135deg, #7c3aed, #4f46e5)"}}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-gray-500 text-sm text-center mt-5">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setError("") }} className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                {isLogin ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{background: "#08080f", color: "#e8e8f0"}}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{background: "rgba(8,8,15,0.8)", backdropFilter: "blur(20px)"}}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: "linear-gradient(135deg, #7c3aed, #4f46e5)"}}>
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Tracktern</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowAuth(true); setIsLogin(true) }}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Sign In
            </button>
            <button onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
              style={{background: "linear-gradient(135deg, #7c3aed, #4f46e5)"}}>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-25" style={{background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)"}} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 text-violet-400 text-xs font-semibold mb-8 uppercase tracking-widest"
            style={{background: "rgba(124,58,237,0.1)"}}>
            <Zap className="w-3 h-3" />
            AI-Powered Internship Tracker
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.95] tracking-tight">
            Land your<br />
            <span style={{background: "linear-gradient(135deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
              dream internship
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Stop losing track of applications on Excel sheets.<br />
            Tracktern keeps everything organized, in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all hover:scale-105 hover:shadow-2xl"
              style={{background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 40px rgba(124,58,237,0.4)"}}>
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => { setShowAuth(true); setIsLogin(true) }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all"
              style={{background: "rgba(255,255,255,0.04)"}}>
              Sign In
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <div className="flex -space-x-2">
              {["A","R","P","S","K"].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white"
                  style={{background: ["#7c3aed","#4f46e5","#0ea5e9","#10b981","#f59e0b"][i]}}>
                  {l}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
              <span className="text-gray-400 text-sm ml-1">Loved by students</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto relative">
          {/* Glow under card */}
          <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl" style={{background: "linear-gradient(135deg, #7c3aed, #4f46e5)"}} />

          <div className="relative rounded-2xl border border-white/10 overflow-hidden" style={{background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)"}}>
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{background: "rgba(255,255,255,0.02)"}}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-3 h-6 rounded-md text-xs text-gray-600 flex items-center px-3 border border-white/5" style={{background: "rgba(255,255,255,0.03)"}}>
                tracktern-ten.vercel.app/dashboard
              </div>
            </div>

            {/* Mock Dashboard UI */}
            <div className="p-6" style={{background: "rgba(10,10,20,0.8)"}}>
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-white font-semibold text-lg">Hey Ayush 👋</div>
                  <div className="text-gray-500 text-sm">Track your internship journey</div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-sm text-gray-400" style={{background: "rgba(255,255,255,0.04)"}}>
                  🔥 3 day streak
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Applied", value: "12", color: "#7c3aed" },
                  { label: "Shortlisted", value: "4", color: "#0ea5e9" },
                  { label: "Interview", value: "2", color: "#f59e0b" },
                  { label: "Offers", value: "1", color: "#10b981" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/5 p-3" style={{background: "rgba(255,255,255,0.03)"}}>
                    <div className="text-2xl font-black text-white mb-0.5">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                    <div className="mt-2 h-0.5 rounded-full w-full" style={{background: `${s.color}40`}}>
                      <div className="h-0.5 rounded-full" style={{width: "60%", background: s.color}} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-xl border border-white/5 overflow-hidden" style={{background: "rgba(255,255,255,0.02)"}}>
                <div className="grid grid-cols-4 px-4 py-2 text-xs text-gray-600 border-b border-white/5 uppercase tracking-wider">
                  <span>Company</span><span>Role</span><span>Date</span><span>Status</span>
                </div>
                {[
                  { company: "Google", role: "SWE Intern", date: "Apr 10", status: "Interview", color: "#f59e0b" },
                  { company: "Microsoft", role: "PM Intern", date: "Apr 8", status: "Shortlisted", color: "#0ea5e9" },
                  { company: "Flipkart", role: "SDE Intern", date: "Apr 5", status: "Applied", color: "#7c3aed" },
                  { company: "Razorpay", role: "Backend", date: "Apr 3", status: "Offer", color: "#10b981" },
                ].map((row) => (
                  <div key={row.company} className="grid grid-cols-4 px-4 py-3 border-b border-white/5 items-center hover:bg-white/2 transition-colors">
                    <span className="text-white text-sm font-medium">{row.company}</span>
                    <span className="text-gray-400 text-sm">{row.role}</span>
                    <span className="text-gray-600 text-sm">{row.date}</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full w-fit" style={{background: `${row.color}20`, color: row.color}}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM → SOLUTION ═══ */}
      <section className="px-6 py-24 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem */}
            <div className="rounded-2xl border border-red-500/20 p-8" style={{background: "rgba(239,68,68,0.04)"}}>
              <div className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4">😓 The Problem</div>
              <h3 className="text-white text-2xl font-bold mb-4">Managing applications is a mess</h3>
              <ul className="space-y-3">
                {[
                  "Lost in WhatsApp messages and email threads",
                  "Excel sheets that get outdated instantly",
                  "Forgetting follow-ups and deadlines",
                  "No idea where each application stands",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div className="rounded-2xl border border-violet-500/20 p-8" style={{background: "rgba(124,58,237,0.04)"}}>
              <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-4">✅ The Solution</div>
              <h3 className="text-white text-2xl font-bold mb-4">Tracktern keeps it all organized</h3>
              <ul className="space-y-3">
                {[
                  "One dashboard for all your applications",
                  "AI-powered interview prep for every company",
                  "Never miss a follow-up with smart tracking",
                  "See exactly where you stand at a glance",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-violet-400 mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Built for students,<br />by a student</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Every feature exists because we felt the pain first</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: BarChart3, color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.2)",
                title: "Application Tracker", tag: "Core",
                desc: "Kanban board across Applied → Shortlisted → Interview → Offer. Know exactly where every application stands."
              },
              {
                icon: Brain, color: "#0ea5e9", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)",
                title: "AI Interview Prep", tag: "AI",
                desc: "Get top questions, skills to revise, and a personalized 3-day prep plan for any company you apply to."
              },
              {
                icon: Zap, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)",
                title: "Skill Gap Analyzer", tag: "Smart",
                desc: "See exactly which skills your target companies need and what you're missing. Bridge the gap faster."
              },
              {
                icon: Users, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)",
                title: "Community Experiences", tag: "Community",
                desc: "Real interview experiences from real students. Know what questions to expect before you walk in."
              },
              {
                icon: CheckCircle, color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)",
                title: "Interview Journal", tag: "Reflect",
                desc: "Log every interview — questions asked, difficulty, outcome. Build your personal knowledge base."
              },
              {
                icon: BarChart3, color: "#f472b6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.2)",
                title: "Daily Practice", tag: "Practice",
                desc: "Pattern-wise DSA sheets with 700+ problems. Track progress topic by topic, just like CodeHurdle."
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border p-6 hover:scale-[1.01] transition-all duration-200 group"
                style={{background: f.bg, borderColor: f.border}}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: `${f.color}20`}}>
                    <f.icon className="w-5 h-5" style={{color: f.color}} />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background: `${f.color}15`, color: f.color}}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="px-6 py-12 border-y border-white/5" style={{background: "rgba(255,255,255,0.02)"}}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "100%", label: "Free Forever" },
            { value: "700+", label: "Practice Problems" },
            { value: "∞", label: "Applications" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-black mb-1" style={{background: "linear-gradient(135deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                {s.value}
              </div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="px-6 py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-15" style={{background: "radial-gradient(ellipse, #7c3aed, transparent 70%)"}} />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
            Ready to land<br />
            <span style={{background: "linear-gradient(135deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
              your internship?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join students who stopped guessing and started tracking.
          </p>
          <button onClick={() => { setShowAuth(true); setIsLogin(false) }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105"
            style={{background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 60px rgba(124,58,237,0.5)"}}>
            Start Tracking Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-gray-600 text-sm mt-4">No credit card required · Free forever</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{background: "linear-gradient(135deg, #7c3aed, #4f46e5)"}}>
              <Rocket className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-500 text-sm">Tracktern — Built by Ayush</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <button onClick={() => { setShowAuth(true); setIsLogin(false) }} className="hover:text-gray-300 transition-colors">Sign Up</button>
            <button onClick={() => { setShowAuth(true); setIsLogin(true) }} className="hover:text-gray-300 transition-colors">Sign In</button>
            <a href="/community" className="hover:text-gray-300 transition-colors flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Community
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
