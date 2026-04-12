"use client"

import { useState, useEffect, useRef } from "react"
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, Users, Zap, BarChart3, Brain, CheckCircle, Star, ChevronRight, Code2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { loginUser, registerUser, saveToken, saveUser, getToken } from "@/lib/api"

const SCREENSHOTS = [
  { src: "/screenshots/dashboard.png", label: "Dashboard", desc: "Track all applications at a glance" },
  { src: "/screenshots/applications.png", label: "Kanban Board", desc: "Visualize your pipeline" },
  { src: "/screenshots/ai-prep.png", label: "AI Interview Prep", desc: "Top 10 questions per company" },
  { src: "/screenshots/ai-prep2.png", label: "3-Day Prep Plan", desc: "Personalized study roadmap" },
  { src: "/screenshots/skill-gap.png", label: "Skill Gap Analyzer", desc: "Know what skills to build" },
  { src: "/screenshots/practice.png", label: "Daily Practice", desc: "Pattern-wise DSA mastery" },
  { src: "/screenshots/patterns.png", label: "22 DSA Topics", desc: "700+ curated problems" },
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
  const [activeSlide, setActiveSlide] = useState(0)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    const token = getToken()
    if (token) window.location.href = "/dashboard"
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide(p => (p + 1) % SCREENSHOTS.length)
    }, 2800)
    return () => clearInterval(intervalRef.current)
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
      setError("Cannot connect to server.")
    }
    setLoading(false)
  }

  // AUTH PAGE
  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{background: "radial-gradient(ellipse at 60% 0%, #2d1b69 0%, #080810 60%)"}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20" style={{background:"radial-gradient(circle,#7c3aed,transparent 70%)"}}/>
        </div>
        <div className="w-full max-w-md relative z-10">
          <button onClick={() => setShowAuth(false)} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
            ← Back
          </button>
          <div className="rounded-2xl border border-white/10 p-8" style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)"}}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>
                <Rocket className="w-4 h-4 text-white"/>
              </div>
              <span className="text-white font-bold text-lg">Tracktern</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">{isLogin ? "Welcome back" : "Join Tracktern"}</h2>
            <p className="text-gray-400 text-sm mb-6">{isLogin ? "Sign in to your dashboard" : "Start landing your dream internship"}</p>
            <div className="flex bg-white/5 rounded-xl p-1 mb-5 border border-white/10">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin?"bg-violet-600 text-white":"text-gray-400 hover:text-white"}`}>Sign In</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin?"bg-violet-600 text-white":"text-gray-400 hover:text-white"}`}>Sign Up</button>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
            <form className="space-y-3" onSubmit={handleSubmit}>
              {!isLogin && (
                <Input type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"/>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                <Input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required
                  className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"/>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                <Input type={showPassword?"text":"password"} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required
                  className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"/>
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 mt-1"
                style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>
                {loading?"Please wait...":(isLogin?"Sign In →":"Create Free Account →")}
              </button>
            </form>
            <p className="text-gray-500 text-sm text-center mt-4">
              {isLogin?"No account? ":"Have an account? "}
              <button onClick={()=>{setIsLogin(!isLogin);setError("")}} className="text-violet-400 hover:text-violet-300 font-semibold">
                {isLogin?"Sign up free":"Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{background:"#080810",color:"#e2e2f0"}}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{background:"rgba(8,8,16,0.85)",backdropFilter:"blur(20px)"}}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>
              <Rocket className="w-4 h-4 text-white"/>
            </div>
            <span className="text-white font-black text-lg tracking-tight">Tracktern</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>{setShowAuth(true);setIsLogin(true)}} className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Sign In
            </button>
            <button onClick={()=>{setShowAuth(true);setIsLogin(false)}}
              className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all hover:scale-105"
              style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",boxShadow:"0 0 20px rgba(124,58,237,0.4)"}}>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="pt-36 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20" style={{background:"radial-gradient(ellipse,#7c3aed 0%,transparent 65%)"}}/>
          <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",backgroundSize:"50px 50px"}}/>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 text-violet-300 text-xs font-bold mb-8 uppercase tracking-widest"
              style={{background:"rgba(124,58,237,0.12)"}}>
              <Zap className="w-3 h-3"/> AI-Powered · Free Forever · Built for Students
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight">
              Stop losing track.<br/>
              <span style={{background:"linear-gradient(135deg,#c4b5fd,#818cf8,#67e8f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                Start landing offers.
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Tracktern organizes every internship application, preps you with AI,
              and tracks your journey — all in one beautiful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <button onClick={()=>{setShowAuth(true);setIsLogin(false)}}
                className="flex items-center gap-2.5 px-10 py-5 rounded-2xl text-white font-black text-lg transition-all hover:scale-105 hover:shadow-2xl"
                style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",boxShadow:"0 0 50px rgba(124,58,237,0.5)"}}>
                Start Tracking Free
                <ArrowRight className="w-5 h-5"/>
              </button>
              <button onClick={()=>{setShowAuth(true);setIsLogin(true)}}
                className="flex items-center gap-2 px-8 py-5 rounded-2xl font-bold text-base border border-white/10 text-gray-300 hover:text-white hover:border-white/25 transition-all"
                style={{background:"rgba(255,255,255,0.04)"}}>
                Sign In <ChevronRight className="w-4 h-4"/>
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {["A","R","P","S","K","M"].map((l,i)=>(
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-black text-white"
                    style={{background:["#7c3aed","#4f46e5","#0ea5e9","#10b981","#f59e0b","#ec4899"][i]}}>
                    {l}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_,i)=><Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400"/>)}
              </div>
              <span className="text-gray-500 text-sm">Used by 100+ students</span>
            </div>
          </div>

          {/* ══ AUTO-SCROLLING SCREENSHOT CAROUSEL ══ */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-1 rounded-3xl opacity-30 blur-2xl" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}/>

            {/* Browser frame */}
            <div className="relative rounded-2xl border border-white/10 overflow-hidden" style={{background:"rgba(255,255,255,0.02)"}}>
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{background:"rgba(255,255,255,0.03)"}}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"/>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"/>
                </div>
                <div className="flex-1 mx-3 h-6 rounded-md flex items-center px-3 border border-white/5 text-xs text-gray-600" style={{background:"rgba(255,255,255,0.03)"}}>
                  tracktern-ten.vercel.app/{["dashboard","applications","ai-prep","ai-prep","skill-gap","practice","practice"][activeSlide]}
                </div>
                <div className="flex gap-2">
                  {SCREENSHOTS.map((_,i)=>(
                    <button key={i} onClick={()=>setActiveSlide(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i===activeSlide?"bg-violet-500 w-4":"bg-white/20 hover:bg-white/40"}`}/>
                  ))}
                </div>
              </div>

              {/* Screenshot display */}
              <div className="relative overflow-hidden" style={{height:"520px"}}>
                {SCREENSHOTS.map((s,i)=>(
                  <div key={i} className="absolute inset-0 transition-all duration-700"
                    style={{opacity:i===activeSlide?1:0,transform:`scale(${i===activeSlide?1:1.02})`,zIndex:i===activeSlide?1:0}}>
                    <img src={s.src} alt={s.label} className="w-full h-full object-cover object-top"/>
                  </div>
                ))}

                {/* Label overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/10" style={{background:"rgba(8,8,16,0.85)",backdropFilter:"blur(12px)"}}>
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"/>
                    <div>
                      <div className="text-white text-sm font-bold">{SCREENSHOTS[activeSlide].label}</div>
                      <div className="text-gray-400 text-xs">{SCREENSHOTS[activeSlide].desc}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 px-3 py-1.5 rounded-lg border border-white/5" style={{background:"rgba(8,8,16,0.8)"}}>
                    {activeSlide+1} / {SCREENSHOTS.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab nav below carousel */}
            <div className="flex gap-2 mt-4 justify-center flex-wrap">
              {SCREENSHOTS.map((s,i)=>(
                <button key={i} onClick={()=>setActiveSlide(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    i===activeSlide
                      ?"text-white border border-violet-500/50"
                      :"text-gray-500 border border-white/5 hover:text-gray-300"
                  }`}
                  style={i===activeSlide?{background:"rgba(124,58,237,0.2)"}:{background:"rgba(255,255,255,0.02)"}}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ STATS BAR ══════ */}
      <section className="px-6 py-10 border-y border-white/5 my-8" style={{background:"rgba(255,255,255,0.015)"}}>
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-6 text-center">
          {[
            {value:"100%", label:"Free Forever"},
            {value:"7+", label:"Powerful Features"},
            {value:"700+", label:"Practice Problems"},
            {value:"AI", label:"Interview Prep"},
          ].map(s=>(
            <div key={s.label}>
              <div className="text-3xl font-black mb-1" style={{background:"linear-gradient(135deg,#c4b5fd,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                {s.value}
              </div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ PROBLEM → SOLUTION ══════ */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
              Sound familiar?
            </h2>
            <p className="text-gray-400 text-lg">Every student faces this. Most never fix it.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-red-500/15 p-8" style={{background:"rgba(239,68,68,0.04)"}}>
              <div className="text-red-400 text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">✕</span>
                Without Tracktern
              </div>
              {[
                "Applications scattered across WhatsApp, email, notes",
                "Forgetting to follow up after interviews",
                "No idea which skills you're missing",
                "Zero prep strategy before interviews",
                "Losing opportunities to disorganization",
              ].map((item,i)=>(
                <div key={i} className="flex items-start gap-3 py-3 border-b border-red-500/10 last:border-0">
                  <span className="text-red-500 mt-0.5 shrink-0 font-bold">✕</span>
                  <span className="text-gray-400 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-violet-500/20 p-8" style={{background:"rgba(124,58,237,0.05)"}}>
              <div className="text-violet-400 text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">✓</span>
                With Tracktern
              </div>
              {[
                "One dashboard — every application, every status",
                "Smart tracking so nothing falls through the cracks",
                "Skill Gap Analyzer shows exactly what to learn",
                "AI generates a 3-day prep plan per company",
                "Land more interviews, convert more to offers",
              ].map((item,i)=>(
                <div key={i} className="flex items-start gap-3 py-3 border-b border-violet-500/10 last:border-0">
                  <span className="text-violet-400 mt-0.5 shrink-0 font-bold">✓</span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-violet-400 text-xs font-black uppercase tracking-widest mb-3">Everything included · Free</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              One app.<br/>Every tool you need.
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Built by a student who felt every one of these problems personally</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {icon:BarChart3,color:"#7c3aed",title:"Application Tracker",tag:"Core",
               desc:"Kanban board — Applied → Shortlisted → Interview → Offer → Rejected. Never lose track of where you stand.",
               screenshot:"/screenshots/applications.png"},
              {icon:Brain,color:"#0ea5e9",title:"AI Interview Prep",tag:"AI ✨",
               desc:"Get top 10 interview questions + skills to revise + a personalized 3-day prep plan for any company.",
               screenshot:"/screenshots/ai-prep.png"},
              {icon:Mail,color:"#10b981",title:"Gmail Sync",tag:"Coming Soon",
               desc:"Auto-detect offer, rejection & interview emails from companies. Your tracker updates itself automatically.",
               screenshot:null},
              {icon:Zap,color:"#f59e0b",title:"Skill Gap Analyzer",tag:"Smart",
               desc:"Add your skills. See exactly what skills companies need. Bridge the gap before you apply.",
               screenshot:"/screenshots/skill-gap.png"},
              {icon:Code2,color:"#a78bfa",title:"Daily Practice",tag:"DSA",
               desc:"22 pattern-wise topics. 700+ curated problems. Track your progress like a pro. Beat any coding interview.",
               screenshot:"/screenshots/practice.png"},
              {icon:Users,color:"#f472b6",title:"Community Experiences",tag:"Community",
               desc:"Real interview questions from real students. Know what Google, Microsoft, Flipkart asked — before you walk in.",
               screenshot:null},
            ].map((f,i)=>(
              <div key={i} className="rounded-2xl border p-6 transition-all duration-200 hover:scale-[1.02] group relative overflow-hidden"
                style={{background:`rgba(${f.color==="#7c3aed"?"124,58,237":f.color==="#0ea5e9"?"14,165,233":f.color==="#10b981"?"16,185,129":f.color==="#f59e0b"?"245,158,11":f.color==="#a78bfa"?"167,139,250":"244,114,182"},0.05)`,borderColor:`${f.color}25`}}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${f.color}18`}}>
                    <f.icon className="w-5 h-5" style={{color:f.color}}/>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{background:`${f.color}18`,color:f.color}}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-white font-black text-lg mb-2 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ GMAIL HIGHLIGHT SECTION ══════ */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-emerald-500/20 overflow-hidden" style={{background:"rgba(16,185,129,0.04)"}}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 text-xs font-black mb-6 w-fit uppercase tracking-widest"
                  style={{background:"rgba(16,185,129,0.1)"}}>
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"/> Coming Soon
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  Gmail Auto-Detection
                </h3>
                <p className="text-gray-400 text-base leading-relaxed mb-6">
                  Connect your Gmail and Tracktern automatically detects offer letters, rejection emails, 
                  and interview invites — updating your tracker without you lifting a finger.
                </p>
                <ul className="space-y-3">
                  {[
                    "Auto-detect offer & rejection emails",
                    "Interview invite notifications",
                    "Company email history in one place",
                    "Zero manual updates needed",
                  ].map((item,i)=>(
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/>
                      {item}
                    </li>
                  ))}
                </ul>
                <button onClick={()=>{setShowAuth(true);setIsLogin(false)}}
                  className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm w-fit transition-all hover:scale-105"
                  style={{background:"linear-gradient(135deg,#10b981,#059669)"}}>
                  Get Early Access <ArrowRight className="w-4 h-4"/>
                </button>
              </div>

              {/* Gmail Mock UI */}
              <div className="p-6 flex items-center justify-center border-l border-white/5">
                <div className="w-full max-w-xs rounded-2xl border border-white/10 overflow-hidden" style={{background:"rgba(8,8,16,0.8)"}}>
                  <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-400"/>
                      <span className="text-white text-sm font-bold">Gmail Sync</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-bold" style={{background:"rgba(245,158,11,0.15)",color:"#f59e0b"}}>
                      Coming Soon
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      {company:"Google",type:"Interview Invite",color:"#f59e0b",icon:"📅"},
                      {company:"Microsoft",type:"Offer Letter 🎉",color:"#10b981",icon:"🎊"},
                      {company:"Flipkart",type:"Application Received",color:"#7c3aed",icon:"✅"},
                      {company:"Razorpay",type:"Next Round",color:"#0ea5e9",icon:"🔥"},
                    ].map((item,i)=>(
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                        style={{background:"rgba(255,255,255,0.03)"}}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{background:`${item.color}20`}}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-xs font-bold">{item.company}</div>
                          <div className="text-xs truncate" style={{color:item.color}}>{item.type}</div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:item.color}}/>
                      </div>
                    ))}
                    <div className="text-center py-2 text-xs text-gray-600">Auto-detected from your inbox</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="px-6 py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-15"
            style={{background:"radial-gradient(ellipse,#7c3aed,transparent 70%)"}}/>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 text-violet-300 text-xs font-black mb-8 uppercase tracking-widest"
            style={{background:"rgba(124,58,237,0.1)"}}>
            🚀 Start for free — no credit card
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9] mb-6">
            Your dream internship<br/>
            <span style={{background:"linear-gradient(135deg,#c4b5fd,#818cf8,#67e8f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              starts here.
            </span>
          </h2>
          <p className="text-gray-400 text-xl mb-10 leading-relaxed">
            Join students who stopped guessing and started tracking.<br/>
            It takes 30 seconds to set up.
          </p>
          <button onClick={()=>{setShowAuth(true);setIsLogin(false)}}
            className="inline-flex items-center gap-3 px-12 py-6 rounded-2xl text-white font-black text-xl transition-all hover:scale-105"
            style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",boxShadow:"0 0 80px rgba(124,58,237,0.5)"}}>
            Get Started Free
            <ArrowRight className="w-6 h-6"/>
          </button>
          <p className="text-gray-600 text-sm mt-5">100% free · No credit card · Built by a student for students</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>
              <Rocket className="w-3 h-3 text-white"/>
            </div>
            <span className="text-gray-500 text-sm">Tracktern — Built by Ayush </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <button onClick={()=>{setShowAuth(true);setIsLogin(false)}} className="hover:text-gray-300 transition-colors">Sign Up</button>
            <button onClick={()=>{setShowAuth(true);setIsLogin(true)}} className="hover:text-gray-300 transition-colors">Sign In</button>
            <a href="/community" className="hover:text-gray-300 transition-colors flex items-center gap-1">
              <Users className="w-3.5 h-3.5"/> Community
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
