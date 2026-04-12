"use client"

import { useState, useEffect } from "react"
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, Users, Zap, BarChart3, Brain, CheckCircle, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { loginUser, registerUser, saveToken, saveUser, getToken } from "@/lib/api"

const SLIDES = [
  {
    label: "Dashboard",
    url: "tracktern-ten.vercel.app/dashboard",
    content: (
      <div className="p-5" style={{background: "#0a0a14"}}>
        <div className="flex items-center justify-between mb-5">
          <div><div className="text-white font-semibold">Hey Ayush 👋</div><div className="text-gray-500 text-xs">Track your internship journey</div></div>
          <div className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-orange-400" style={{background: "rgba(255,255,255,0.04)"}}>🔥 3 day streak</div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[["12","Applied","#7c3aed"],["4","Shortlisted","#0ea5e9"],["2","Interview","#f59e0b"],["1","Offer 🎉","#10b981"]].map(([v,l,c])=>(
            <div key={l} className="rounded-xl border border-white/5 p-3" style={{background:"rgba(255,255,255,0.03)"}}>
              <div className="text-2xl font-black text-white">{v}</div>
              <div className="text-xs text-gray-500 mt-0.5">{l}</div>
              <div className="mt-2 h-1 rounded-full" style={{background:`${c}30`}}><div className="h-1 rounded-full w-3/5" style={{background:c}}/></div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/5 overflow-hidden" style={{background:"rgba(255,255,255,0.02)"}}>
          <div className="grid grid-cols-4 px-4 py-2 text-xs text-gray-600 border-b border-white/5 uppercase tracking-wider"><span>Company</span><span>Role</span><span>Date</span><span>Status</span></div>
          {[["Google","SWE Intern","Apr 10","Interview","#f59e0b"],["Microsoft","PM Intern","Apr 8","Shortlisted","#0ea5e9"],["Flipkart","SDE Intern","Apr 5","Applied","#7c3aed"],["Razorpay","Backend","Apr 3","Offer","#10b981"]].map(([c,r,d,s,col])=>(
            <div key={c} className="grid grid-cols-4 px-4 py-2.5 border-b border-white/5 items-center">
              <span className="text-white text-sm font-medium">{c}</span>
              <span className="text-gray-400 text-sm">{r}</span>
              <span className="text-gray-600 text-xs">{d}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full w-fit" style={{background:`${col}20`,color:col}}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    label: "AI Interview Prep",
    url: "tracktern-ten.vercel.app/ai-prep",
    content: (
      <div className="p-5" style={{background:"#0a0a14"}}>
        <div className="text-white font-semibold mb-1">AI Prep for Google</div>
        <div className="text-gray-500 text-xs mb-4">SWE Intern</div>
        <div className="rounded-xl border border-white/5 p-4 mb-3" style={{background:"rgba(255,255,255,0.02)"}}>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Top 10 Interview Questions</div>
          {["How would you design a URL shortener?","Explain the difference between TCP and UDP","What is the time complexity of quicksort?","How does garbage collection work in Java?"].map((q,i)=>(
            <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5">
              <span className="text-violet-400 text-xs font-bold w-4">{i+1}</span>
              <span className="text-gray-300 text-xs">{q}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["Data Structures","System Design","Algorithms","OS Concepts"].map(s=>(
            <span key={s} className="px-2 py-1 rounded-full text-xs border border-violet-500/30 text-violet-400" style={{background:"rgba(124,58,237,0.1)"}}>{s}</span>
          ))}
        </div>
      </div>
    )
  },
  {
    label: "Skill Gap Analysis",
    url: "tracktern-ten.vercel.app/skill-gap",
    content: (
      <div className="p-5" style={{background:"#0a0a14"}}>
        <div className="text-white font-semibold mb-4">Skill Gap Analysis</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/5 p-4" style={{background:"rgba(255,255,255,0.02)"}}>
            <div className="text-xs text-gray-500 mb-3">Your Skills</div>
            {["React","Python","SQL","Git","Node.js"].map(s=>(
              <span key={s} className="inline-block px-2 py-0.5 rounded-full text-xs border border-green-500/30 text-green-400 mr-1 mb-1" style={{background:"rgba(16,185,129,0.1)"}}>{s}</span>
            ))}
          </div>
          <div className="rounded-xl border border-red-500/20 p-4" style={{background:"rgba(239,68,68,0.04)"}}>
            <div className="text-xs text-gray-500 mb-3">Missing Skills</div>
            {[["AWS","4 companies"],["TypeScript","3 companies"],["Docker","2 companies"]].map(([s,c])=>(
              <div key={s} className="flex justify-between items-center mb-2">
                <span className="text-red-400 text-xs">{s}</span>
                <span className="text-gray-600 text-xs">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    label: "Daily Practice",
    url: "tracktern-ten.vercel.app/practice",
    content: (
      <div className="p-5" style={{background:"#0a0a14"}}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-white font-semibold">Daily Practice</div>
          <span className="text-primary text-sm font-bold">12<span className="text-gray-500 font-normal">/569</span></span>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[["Array","34","#3b82f6"],["Binary Search","41","#f59e0b"],["Trees","73","#10b981"],["DP","166","#ef4444"]].map(([t,n,c])=>(
            <div key={t} className="rounded-lg p-2 border border-white/5" style={{background:"rgba(255,255,255,0.03)"}}>
              <div className="text-xs font-bold" style={{color:c}}>{t}</div>
              <div className="text-white text-sm font-bold mt-1">0/{n}</div>
              <div className="mt-1.5 h-1 rounded-full bg-white/10"><div className="h-1 rounded-full w-0" style={{background:c}}/></div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-violet-500/20 p-3" style={{background:"rgba(124,58,237,0.05)"}}>
          <div className="text-xs text-gray-500 mb-1">Problem of the Day</div>
          <div className="text-white text-sm font-medium">Longest Substring Without Repeating Characters</div>
          <span className="text-xs px-2 py-0.5 rounded-full mt-2 inline-block" style={{background:"rgba(245,158,11,0.2)",color:"#f59e0b"}}>Medium</span>
        </div>
      </div>
    )
  },
  {
    label: "Community",
    url: "tracktern-ten.vercel.app/community",
    content: (
      <div className="p-5" style={{background:"#0a0a14"}}>
        <div className="text-white font-semibold mb-4">Community Experiences</div>
        <div className="flex gap-2 mb-4">
          {["Google","Amazon","Microsoft","Meta"].map(c=>(
            <span key={c} className="px-3 py-1 rounded-full text-xs border border-white/10 text-gray-400 cursor-pointer hover:border-violet-500/50">{c}</span>
          ))}
        </div>
        {[{c:"Google",r:"SWE Intern",q:"System design: Design YouTube",t:"technical",s:"Cleared"},
          {c:"Amazon",r:"SDE Intern",q:"LRU Cache + Linked List problem",t:"technical",s:"Rejected"}].map((e,i)=>(
          <div key={i} className="rounded-xl border border-white/5 p-3 mb-2" style={{background:"rgba(255,255,255,0.02)"}}>
            <div className="flex justify-between items-start mb-1">
              <div><span className="text-white text-sm font-medium">{e.c}</span><span className="text-gray-500 text-xs ml-2">{e.r}</span></div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{background:e.s==="Cleared"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)",color:e.s==="Cleared"?"#10b981":"#ef4444"}}>{e.s}</span>
            </div>
            <div className="text-gray-400 text-xs">{e.q}</div>
          </div>
        ))}
      </div>
    )
  }
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
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const token = getToken()
    if (token) window.location.href = "/dashboard"
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length)
    }, 3000)
    return () => clearInterval(interval)
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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{background:"radial-gradient(ellipse at 60% 0%, #3b1f6e 0%, #0a0a0f 60%)"}}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20" style={{background:"radial-gradient(circle, #7c3aed, transparent 70%)"}}/>
        </div>
        <div className="w-full max-w-md relative z-10">
          <button onClick={() => setShowAuth(false)} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">← Back to home</button>
          <div className="rounded-2xl border border-white/10 p-8" style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)"}}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg, #7c3aed, #4f46e5)"}}>
                <Rocket className="w-4 h-4 text-white"/>
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
              {!isLogin && <Input type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"/>}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                <Input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"/>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                <Input type={showPassword?"text":"password"} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"/>
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full h-11 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50" style={{background:"linear-gradient(135deg, #7c3aed, #4f46e5)"}}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
            <p className="text-gray-500 text-sm text-center mt-5">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={()=>{setIsLogin(!isLogin);setError("")}} className="text-violet-400 hover:text-violet-300 font-medium">{isLogin?"Sign up free":"Sign in"}</button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{background:"#08080f",color:"#e8e8f0"}}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{background:"rgba(8,8,15,0.85)",backdropFilter:"blur(20px)"}}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg, #7c3aed, #4f46e5)"}}>
              <Rocket className="w-4 h-4 text-white"/>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Tracktern</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>{setShowAuth(true);setIsLogin(true)}} className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Sign In</button>
            <button onClick={()=>{setShowAuth(true);setIsLogin(false)}} className="text-sm font-semibold text-white px-4 py-2 rounded-xl hover:opacity-90" style={{background:"linear-gradient(135deg, #7c3aed, #4f46e5)"}}>Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20" style={{background:"radial-gradient(ellipse, #7c3aed 0%, transparent 70%)"}}/>
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",backgroundSize:"60px 60px"}}/>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 text-violet-400 text-xs font-semibold mb-8 uppercase tracking-widest" style={{background:"rgba(124,58,237,0.1)"}}>
            <Zap className="w-3 h-3"/> AI-Powered Internship Tracker
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.95] tracking-tight">
            Land your<br/>
            <span style={{background:"linear-gradient(135deg, #a78bfa, #818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>dream internship</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Stop losing track on Excel sheets and WhatsApp.<br/>Tracktern organizes everything in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button onClick={()=>{setShowAuth(true);setIsLogin(false)}} className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base hover:scale-105 transition-all" style={{background:"linear-gradient(135deg, #7c3aed, #4f46e5)",boxShadow:"0 0 40px rgba(124,58,237,0.4)"}}>
              Get Started Free <ArrowRight className="w-5 h-5"/>
            </button>
            <button onClick={()=>{setShowAuth(true);setIsLogin(true)}} className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all" style={{background:"rgba(255,255,255,0.04)"}}>
              Sign In
            </button>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex -space-x-2">
              {["A","R","P","S","K"].map((l,i)=>(
                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white" style={{background:["#7c3aed","#4f46e5","#0ea5e9","#10b981","#f59e0b"][i]}}>{l}</div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_,i)=><Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
              <span className="text-gray-400 text-sm ml-1">Loved by students</span>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Carousel */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl" style={{background:"linear-gradient(135deg, #7c3aed, #4f46e5)"}}/>
          <div className="relative rounded-2xl border border-white/10 overflow-hidden" style={{background:"rgba(255,255,255,0.02)"}}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60"/>
                <div className="w-3 h-3 rounded-full bg-yellow-500/60"/>
                <div className="w-3 h-3 rounded-full bg-green-500/60"/>
              </div>
              <div className="flex-1 mx-3 h-6 rounded-md text-xs text-gray-600 flex items-center px-3 border border-white/5" style={{background:"rgba(255,255,255,0.03)"}}>
                {SLIDES[currentSlide].url}
              </div>
              <span className="text-xs text-gray-600">{SLIDES[currentSlide].label}</span>
            </div>
            <div className="relative overflow-hidden" style={{minHeight:"280px"}}>
              {SLIDES.map((slide,i)=>(
                <div key={i} className="absolute inset-0 transition-opacity duration-700" style={{opacity:i===currentSlide?1:0,pointerEvents:i===currentSlide?"auto":"none"}}>
                  {slide.content}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 py-3 border-t border-white/5">
              {SLIDES.map((_,i)=>(
                <button key={i} onClick={()=>setCurrentSlide(i)}>
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${i===currentSlide?"w-6 bg-violet-500":"w-1.5 bg-white/20"}`}/>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 border-y border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[["100%","Free Forever"],["700+","Practice Problems"],["∞","Applications"]].map(([v,l])=>(
            <div key={l}>
              <div className="text-4xl font-black mb-1" style={{background:"linear-gradient(135deg, #a78bfa, #818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{v}</div>
              <div className="text-gray-500 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="px-6 py-24 border-b border-white/5">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-red-500/20 p-8" style={{background:"rgba(239,68,68,0.04)"}}>
            <div className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4">The Problem</div>
            <h3 className="text-white text-2xl font-bold mb-4">Managing applications is a mess</h3>
            <ul className="space-y-3">
              {["Lost in WhatsApp and email threads","Excel sheets that get outdated instantly","Forgetting follow-ups and deadlines","No idea where each application stands"].map((item,i)=>(
                <li key={i} className="flex items-start gap-2 text-gray-400 text-sm"><span className="text-red-400 mt-0.5 shrink-0">✕</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-violet-500/20 p-8" style={{background:"rgba(124,58,237,0.04)"}}>
            <div className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-4">The Solution</div>
            <h3 className="text-white text-2xl font-bold mb-4">Tracktern keeps it all organized</h3>
            <ul className="space-y-3">
              {["One dashboard for all your applications","AI-powered interview prep per company","Never miss a follow-up with smart tracking","See exactly where you stand at a glance"].map((item,i)=>(
                <li key={i} className="flex items-start gap-2 text-gray-400 text-sm"><span className="text-violet-400 mt-0.5 shrink-0">✓</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Built for students,<br/>by a student</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {icon:BarChart3,color:"#7c3aed",title:"Application Tracker",tag:"Core",desc:"Kanban board across Applied → Shortlisted → Interview → Offer. Know exactly where every application stands."},
              {icon:Brain,color:"#0ea5e9",title:"AI Interview Prep",tag:"AI",desc:"Top 10 questions, skills to revise, and a personalized 3-day prep plan for any company you apply to."},
              {icon:Mail,color:"#10b981",title:"Gmail Sync",tag:"Coming Soon",desc:"Auto-detect offer, rejection and interview emails from companies. Your tracker updates itself automatically."},
              {icon:Zap,color:"#f59e0b",title:"Skill Gap Analyzer",tag:"Smart",desc:"See exactly which skills your target companies need and what you are missing. Bridge the gap faster."},
              {icon:Users,color:"#f472b6",title:"Community Experiences",tag:"Community",desc:"Real interview experiences from LeetCode Discuss and fellow students. Know what to expect before you walk in."},
              {icon:CheckCircle,color:"#a78bfa",title:"Daily Practice",tag:"Practice",desc:"Pattern-wise DSA sheets with 700+ problems across 22 topics. Track progress."},
            ].map(f=>(
              <div key={f.title} className="rounded-2xl border p-6 hover:scale-[1.01] transition-all duration-200 group" style={{background:`${f.color}08`,borderColor:`${f.color}30`}}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${f.color}20`}}>
                    <f.icon className="w-5 h-5" style={{color:f.color}}/>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background:`${f.color}15`,color:f.color}}>{f.tag}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-15" style={{background:"radial-gradient(ellipse, #7c3aed, transparent 70%)"}}/>
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
            Ready to land<br/>
            <span style={{background:"linear-gradient(135deg, #a78bfa, #818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>your internship?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">Join students who stopped guessing and started tracking.</p>
          <button onClick={()=>{setShowAuth(true);setIsLogin(false)}} className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all" style={{background:"linear-gradient(135deg, #7c3aed, #4f46e5)",boxShadow:"0 0 60px rgba(124,58,237,0.5)"}}>
            Start Tracking Free <ArrowRight className="w-5 h-5"/>
          </button>
          <p className="text-gray-600 text-sm mt-4">No credit card required · Free forever</p>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{background:"linear-gradient(135deg, #7c3aed, #4f46e5)"}}>
              <Rocket className="w-3 h-3 text-white"/>
            </div>
            <span className="text-gray-500 text-sm">Tracktern — Built by Ayush</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <button onClick={()=>{setShowAuth(true);setIsLogin(false)}} className="hover:text-gray-300 transition-colors">Sign Up</button>
            <button onClick={()=>{setShowAuth(true);setIsLogin(true)}} className="hover:text-gray-300 transition-colors">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
