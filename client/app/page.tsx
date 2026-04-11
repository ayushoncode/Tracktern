"use client"

import { useState, useEffect } from "react"
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Zap, Brain, BarChart3, Github } from "lucide-react"
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

  useEffect(() => {
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
    } catch (err) {
      setError("Cannot connect to server. Try again.")
    }
    setLoading(false)
  }

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="glass-card rounded-2xl p-8 w-full max-w-md relative z-10">
          <button onClick={() => setShowAuth(false)} className="text-muted-foreground hover:text-foreground text-sm mb-4 flex items-center gap-1">
            ← Back
          </button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Tracktern</span>
          </div>
          <p className="text-muted-foreground text-center mb-8">Your internship hunt, organized.</p>
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Sign In
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Sign Up
            </button>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <Input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-purple hover:opacity-90 text-primary-foreground">
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
          <p className="text-muted-foreground text-sm text-center mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError("") }} className="text-primary hover:text-primary/80 font-medium">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Tracktern</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/ayushoncode/Tracktern" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <button onClick={() => { setShowAuth(true); setIsLogin(true) }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </button>
            <button onClick={() => { setShowAuth(true); setIsLogin(false) }} className="px-4 py-2 rounded-lg gradient-purple text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Internship Tracker
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            From Applied to
            <span className="text-primary"> Offered</span>
            <br />Every Step Tracked.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Stop managing your internship hunt on WhatsApp and Excel sheets. Tracktern organizes every application, preps you with AI, and tracks your journey to your dream internship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => { setShowAuth(true); setIsLogin(false) }} className="px-8 py-4 rounded-xl gradient-purple text-primary-foreground text-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 justify-center">
              Start Tracking Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <a href="https://github.com/ayushoncode/Tracktern" target="_blank" className="px-8 py-4 rounded-xl border border-border text-foreground text-lg font-medium hover:bg-secondary transition-colors flex items-center gap-2 justify-center">
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "100%", label: "Free Forever" },
            { value: "AI", label: "Powered Prep" },
            { value: "∞", label: "Applications" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything you need to land your internship</h2>
            <p className="text-muted-foreground text-lg">Built by a student, for students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: "Kanban Board", desc: "Track every application across Applied, Shortlisted, Interview, Offer and Rejected stages.", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: Brain, title: "AI Interview Prep", desc: "Get top 10 interview questions, skills to revise, and a 3-day prep plan for every company.", color: "text-purple-400", bg: "bg-purple-500/10" },
              { icon: Mail, title: "Gmail Integration", desc: "Auto-detect offer and rejection emails. Your tracker updates itself. (Coming soon)", color: "text-green-400", bg: "bg-green-500/10" },
              { icon: Zap, title: "Skill Gap Analyzer", desc: "See which skills your target companies need and what you're missing.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
              { icon: CheckCircle, title: "Interview Journal", desc: "Log questions asked, difficulty rating, and outcomes after every interview.", color: "text-pink-400", bg: "bg-pink-500/10" },
              { icon: BarChart3, title: "Analytics Dashboard", desc: "Visual funnel showing your conversion rate from applied to offer.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
            ].map((feature) => (
              <div key={feature.title} className="glass-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors">
                <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center glass-card rounded-2xl p-12 border border-border">
          <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to land your internship?</h2>
          <p className="text-muted-foreground mb-8">Join students who are organizing their internship hunt with Tracktern.</p>
          <button onClick={() => { setShowAuth(true); setIsLogin(false) }} className="px-8 py-4 rounded-xl gradient-purple text-primary-foreground text-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-purple flex items-center justify-center">
              <Rocket className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Tracktern — Built by Ayush</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="https://github.com/ayushoncode/Tracktern" target="_blank" className="hover:text-foreground transition-colors">GitHub</a>
            <button onClick={() => { setShowAuth(true); setIsLogin(false) }} className="hover:text-foreground transition-colors">Sign Up</button>
            <button onClick={() => { setShowAuth(true); setIsLogin(true) }} className="hover:text-foreground transition-colors">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
