"use client"

import { useState, useEffect, useRef } from "react"
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, Users, Zap, BarChart3, Brain, CheckCircle, Star, Code2, ChevronRight } from "lucide-react"
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
  const [activeSlide, setActiveSlide] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (token) window.location.href = "/dashboard"
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveSlide(p => (p + 1) % 5), 3000)
    return () => clearInterval(t)
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

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{background:"radial-gradient(ellipse at 50% -20%, #3b1f6e 0%, #080810 55%)"}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30" style={{background:"radial-gradient(ellipse,#7c3aed,transparent 70%)"}}/>
        </div>
        <div className="w-full max-w-md relative z-10">
          <button onClick={() => setShowAuth(false)} className="text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
            ← Back
          </button>
          <div className="rounded-2xl border border-white/10 p-8" style={{background:"rgba(15,15,25,0.9)",backdropFilter:"blur(24px)"}}>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>
                <Rocket className="w-4 h-4 text-white"/>
              </div>
              <span className="text-white font-black text-xl tracking-tight">Tracktern</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">{isLogin ? "Welcome back" : "Create your account"}</h2>
            <p className="text-gray-500 text-sm mb-6">{isLogin ? "Sign in to your dashboard" : "Free forever. No credit card needed."}</p>
            <div className="flex bg-white/5 rounded-xl p-1 mb-5 border border-white/8">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}>Sign In</button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}>Sign Up</button>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
            <form className="space-y-3" onSubmit={handleSubmit}>
              {!isLogin && (
                <Input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl text-sm"/>
              )}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"/>
                <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl text-sm"/>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"/>
                <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl text-sm"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300">
                  {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-12 rounded-xl text-white font-black text-sm transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 mt-2"
                style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",boxShadow:"0 8px 32px rgba(124,58,237,0.4)"}}>
                {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Free Account →"}
              </button>
            </form>
            <p className="text-gray-600 text-sm text-center mt-4">
              {isLogin ? "No account? " : "Have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setError("") }} className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
                {isLogin ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{background:"#08080f",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes pulse-glow { 0%,100% { box-shadow:0 0 40px rgba(124,58,237,0.3); } 50% { box-shadow:0 0 80px rgba(124,58,237,0.6); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.7s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.2s both; }
        .fade-up-3 { animation: fadeUp 0.7s ease 0.3s both; }
        .fade-up-4 { animation: fadeUp 0.7s ease 0.4s both; }
        .ticker-wrap { overflow:hidden; }
        .ticker-track { display:flex; animation: ticker 25s linear infinite; white-space:nowrap; }
        .card-hover { transition: transform 0.2s ease, border-color 0.2s ease; }
        .card-hover:hover { transform: translateY(-3px); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{background:"rgba(8,8,15,0.8)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>
              <Rocket className="w-4 h-4 text-white"/>
            </div>
            <span className="font-black text-white text-lg tracking-tight">Tracktern</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowAuth(true); setIsLogin(true) }}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
              Sign In
            </button>
            <button onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all hover:scale-105 hover:shadow-lg"
              style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",boxShadow:"0 4px 20px rgba(124,58,237,0.35)"}}>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-8 px-6 relative overflow-hidden" style={{minHeight:"100vh",display:"flex",alignItems:"center"}}>
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]" style={{background:"radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.25) 0%,transparent 65%)"}}/>
          <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(rgba(124,58,237,0.08) 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{background:"linear-gradient(to top,#08080f,transparent)"}}/>
        </div>

        <div className="max-w-5xl mx-auto w-full relative z-10">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="fade-up-1 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest mb-8"
              style={{background:"rgba(124,58,237,0.12)",borderColor:"rgba(124,58,237,0.35)",color:"#c4b5fd"}}>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block"/>
              AI-Powered Internship Tracker
            </div>

            {/* Headline */}
            <h1 className="fade-up-2 font-black text-white leading-[0.92] tracking-tight mb-6"
              style={{fontSize:"clamp(52px,8vw,96px)"}}>
              Land your<br/>
              <span style={{background:"linear-gradient(135deg,#c4b5fd 0%,#818cf8 50%,#67e8f9 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                dream internship
              </span>
            </h1>

            <p className="fade-up-3 text-gray-400 mb-10 mx-auto leading-relaxed"
              style={{fontSize:"clamp(16px,2vw,20px)",maxWidth:"560px"}}>
              Stop losing track on Excel sheets and WhatsApp.<br/>
              Tracktern organizes everything in one place.
            </p>

            {/* CTAs */}
            <div className="fade-up-4 flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <button onClick={() => { setShowAuth(true); setIsLogin(false) }}
                className="flex items-center gap-2.5 px-9 py-4 rounded-2xl text-white font-black text-lg transition-all hover:scale-105"
                style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",boxShadow:"0 0 50px rgba(124,58,237,0.45)",animation:"pulse-glow 3s ease-in-out infinite"}}>
                Get Started Free <ArrowRight className="w-5 h-5"/>
              </button>
              <button onClick={() => { setShowAuth(true); setIsLogin(true) }}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-base border text-gray-300 hover:text-white transition-all hover:border-white/25"
                style={{background:"rgba(255,255,255,0.04)",borderColor:"rgba(255,255,255,0.1)"}}>
                Sign In <ChevronRight className="w-4 h-4"/>
              </button>
            </div>

            {/* Social proof */}
            <div className="fade-up-4 flex items-center justify-center gap-3 mb-14">
              <div className="flex -space-x-2">
                {[["A","#7c3aed"],["R","#4f46e5"],["P","#0ea5e9"],["S","#10b981"],["K","#f59e0b"],["M","#ec4899"]].map(([l,c],i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black text-white"
                    style={{background:c,borderColor:"#08080f"}}>
                    {l}
                  </div>
                ))}
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
              </div>
              <span className="text-gray-500 text-sm">Loved by 100+ students</span>
            </div>
          </div>

          {/* ── ANIMATED MOCK DASHBOARD ── */}
          <div className="relative mx-auto" style={{maxWidth:"900px"}}>
            <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-40" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}/>
            <div className="relative rounded-2xl overflow-hidden border" style={{borderColor:"rgba(255,255,255,0.1)",background:"rgba(12,12,22,0.95)",backdropFilter:"blur(10px)"}}>
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3" style={{background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{background:"#ff5f57"}}/>
                  <div className="w-3 h-3 rounded-full" style={{background:"#ffbd2e"}}/>
                  <div className="w-3 h-3 rounded-full" style={{background:"#28c840"}}/>
                </div>
                <div className="flex-1 mx-4 h-6 rounded-lg flex items-center px-3 text-xs" style={{background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.3)"}}>
                  tracktern.com/dashboard
                </div>
                <div className="flex gap-2">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} onClick={() => setActiveSlide(i)}
                      className="rounded-full cursor-pointer transition-all"
                      style={{width:i===activeSlide?"20px":"6px",height:"6px",background:i===activeSlide?"#7c3aed":"rgba(255,255,255,0.2)"}}/>
                  ))}
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6" style={{minHeight:"420px"}}>
                {/* Slide 0 — Dashboard overview */}
                {activeSlide === 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="text-white font-black text-lg">Hey Ayush 👋</div>
                        <div className="text-gray-500 text-sm">Your internship dashboard</div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold" style={{background:"rgba(245,158,11,0.15)",color:"#f59e0b"}}>
                        🔥 3 day streak
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {[{n:"12",l:"Applied",c:"#7c3aed",p:60},{n:"4",l:"Shortlisted",c:"#0ea5e9",p:33},{n:"2",l:"Interview",c:"#f59e0b",p:17},{n:"1",l:"Offer 🎉",c:"#10b981",p:8}].map(s => (
                        <div key={s.l} className="rounded-xl p-4" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                          <div className="text-2xl font-black text-white mb-1">{s.n}</div>
                          <div className="text-xs mb-2" style={{color:"rgba(255,255,255,0.4)"}}>{s.l}</div>
                          <div className="h-1 rounded-full" style={{background:"rgba(255,255,255,0.08)"}}>
                            <div className="h-1 rounded-full transition-all" style={{width:`${s.p}%`,background:s.c}}/>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl overflow-hidden" style={{border:"1px solid rgba(255,255,255,0.06)"}}>
                      <div className="grid grid-cols-4 px-4 py-2.5 text-xs font-bold uppercase tracking-wider" style={{background:"rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.3)"}}>
                        <span>Company</span><span>Role</span><span>Date</span><span>Status</span>
                      </div>
                      {[{c:"Google",r:"SWE Intern",d:"Apr 10",s:"Interview",col:"#f59e0b"},{c:"Microsoft",r:"PM Intern",d:"Apr 8",s:"Shortlisted",col:"#0ea5e9"},{c:"Flipkart",r:"SDE Intern",d:"Apr 5",s:"Applied",col:"#7c3aed"},{c:"Razorpay",r:"Backend",d:"Apr 3",s:"Offer",col:"#10b981"}].map((row,i) => (
                        <div key={i} className="grid grid-cols-4 px-4 py-3 items-center" style={{borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                          <span className="text-white text-sm font-bold">{row.c}</span>
                          <span className="text-sm" style={{color:"rgba(255,255,255,0.5)"}}>{row.r}</span>
                          <span className="text-sm" style={{color:"rgba(255,255,255,0.3)"}}>{row.d}</span>
                          <span className="text-xs font-black px-2.5 py-1 rounded-full w-fit" style={{background:`${row.col}20`,color:row.col}}>{row.s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Slide 1 — Kanban */}
                {activeSlide === 1 && (
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="text-white font-black text-lg">Applications</div>
                        <div className="text-gray-500 text-sm">Kanban board view</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>+ Add Company</div>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        {col:"Applied",dot:"#7c3aed",cards:["Google — ML","Amazon — SDE"]},
                        {col:"Shortlisted",dot:"#f59e0b",cards:["Microsoft — PM"]},
                        {col:"Interview",dot:"#0ea5e9",cards:["JPMorgan — SWE"]},
                        {col:"Offer",dot:"#10b981",cards:[]},
                        {col:"Rejected",dot:"#ef4444",cards:[]},
                      ].map(col => (
                        <div key={col.col}>
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-2 h-2 rounded-full" style={{background:col.dot}}/>
                            <span className="text-xs font-bold" style={{color:"rgba(255,255,255,0.5)"}}>{col.col}</span>
                          </div>
                          <div className="space-y-2">
                            {col.cards.map((card,i) => (
                              <div key={i} className="p-2.5 rounded-lg text-xs text-white font-medium" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)"}}>
                                {card}
                              </div>
                            ))}
                            {col.cards.length === 0 && (
                              <div className="p-3 rounded-lg text-xs text-center" style={{border:"1px dashed rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.2)"}}>Empty</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Slide 2 — AI Prep */}
                {activeSlide === 2 && (
                  <div>
                    <div className="text-white font-black text-lg mb-1">AI Prep for Google</div>
                    <div className="text-gray-500 text-sm mb-5">Software Engineer Intern</div>
                    <div className="mb-4">
                      <div className="text-xs font-black uppercase tracking-wider mb-3" style={{color:"rgba(255,255,255,0.4)"}}>Top 10 Interview Questions</div>
                      <div className="space-y-2">
                        {["Design a URL shortener like bit.ly","Explain system design for WhatsApp","What is consistent hashing?","How does garbage collection work?","Design an LRU cache"].map((q,i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{background:"rgba(124,58,237,0.3)",color:"#c4b5fd"}}>{i+1}</span>
                            <span style={{color:"rgba(255,255,255,0.8)"}}>{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider mb-2" style={{color:"rgba(255,255,255,0.4)"}}>Skills to Revise</div>
                      <div className="flex flex-wrap gap-2">
                        {["System Design","DSA","OS","DBMS","Networking"].map(s => (
                          <span key={s} className="px-3 py-1 rounded-full text-xs font-bold" style={{background:"rgba(124,58,237,0.2)",color:"#c4b5fd",border:"1px solid rgba(124,58,237,0.3)"}}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Slide 3 — Skill Gap */}
                {activeSlide === 3 && (
                  <div>
                    <div className="text-white font-black text-lg mb-1">Skill Gap Analysis</div>
                    <div className="text-gray-500 text-sm mb-5">Based on your 12 applications</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl p-4" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                        <div className="text-xs font-black uppercase tracking-wider mb-3" style={{color:"rgba(255,255,255,0.4)"}}>Your Skills</div>
                        <div className="flex flex-wrap gap-1.5">
                          {["JavaScript","React","Python","SQL","Git","Node.js"].map(s => (
                            <span key={s} className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{background:"rgba(16,185,129,0.15)",color:"#10b981",border:"1px solid rgba(16,185,129,0.2)"}}>
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl p-4" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                        <div className="text-xs font-black uppercase tracking-wider mb-3" style={{color:"rgba(255,255,255,0.4)"}}>Missing Skills</div>
                        <div className="space-y-2">
                          {[{s:"TypeScript",n:"3 companies"},{s:"AWS",n:"2 companies"},{s:"Docker",n:"2 companies"}].map(item => (
                            <div key={item.s} className="flex items-center justify-between p-2 rounded-lg" style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)"}}>
                              <span className="text-sm font-bold" style={{color:"#fca5a5"}}>⚠ {item.s}</span>
                              <span className="text-xs" style={{color:"rgba(252,165,165,0.6)"}}>{item.n}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Slide 4 — Daily Practice */}
                {activeSlide === 4 && (
                  <div>
                    <div className="text-white font-black text-lg mb-1">Daily Practice</div>
                    <div className="text-gray-500 text-sm mb-5">Pattern-Wise Mastery — 22 topics</div>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[{t:"Array + Hashing",p:2,s:"0/34"},{t:"Binary Search",p:6,s:"0/41"},{t:"Dynamic Programming",p:12,s:"0/166"},{t:"Trees",p:12,s:"0/73"}].map(card => (
                        <div key={card.t} className="p-3 rounded-xl" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)"}}>
                          <div className="text-xs font-black text-white mb-1 leading-tight">{card.t}</div>
                          <div className="text-xs mb-2" style={{color:"rgba(255,255,255,0.3)"}}>{card.p} patterns</div>
                          <div className="h-1 rounded-full mb-1" style={{background:"rgba(255,255,255,0.08)"}}>
                            <div className="h-1 rounded-full" style={{width:"5%",background:"#7c3aed"}}/>
                          </div>
                          <div className="text-xs font-bold" style={{color:"#c4b5fd"}}>{card.s}</div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-xl" style={{background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.2)"}}>
                      <div className="text-xs font-black uppercase tracking-wider mb-2" style={{color:"rgba(196,181,253,0.7)"}}>Today's Problem</div>
                      <div className="text-white font-black">Climbing Stairs</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{background:"rgba(16,185,129,0.2)",color:"#10b981"}}>Easy</span>
                        <span className="text-xs" style={{color:"rgba(255,255,255,0.4)"}}>Dynamic Programming</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Slide labels */}
              <div className="px-4 py-3 flex items-center gap-3" style={{borderTop:"1px solid rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.02)"}}>
                {["Dashboard","Applications","AI Prep","Skill Gap","Practice"].map((label,i) => (
                  <button key={i} onClick={() => setActiveSlide(i)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                    style={{
                      background:i===activeSlide?"rgba(124,58,237,0.25)":"transparent",
                      color:i===activeSlide?"#c4b5fd":"rgba(255,255,255,0.3)",
                      border:i===activeSlide?"1px solid rgba(124,58,237,0.4)":"1px solid transparent"
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="py-4 border-y overflow-hidden" style={{borderColor:"rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)"}}>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...Array(2)].map((_,rep) => (
              <div key={rep} className="flex items-center gap-8 px-4">
                {["Application Tracker","AI Interview Prep","Gmail Sync","Skill Gap Analyzer","Daily Practice","Community Experiences","Interview Journal","Pattern-Wise DSA","100% Free"].map((item,i) => (
                  <div key={i} className="flex items-center gap-3 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:"#7c3aed"}}/>
                    <span className="text-sm font-bold whitespace-nowrap" style={{color:"rgba(255,255,255,0.3)"}}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-6 text-center">
          {[{v:"100%",l:"Free Forever"},{v:"7+",l:"Powerful Features"},{v:"700+",l:"DSA Problems"},{v:"AI",l:"Powered Prep"}].map(s => (
            <div key={s.l} className="p-6 rounded-2xl" style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div className="text-3xl font-black mb-1" style={{background:"linear-gradient(135deg,#c4b5fd,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                {s.v}
              </div>
              <div className="text-sm" style={{color:"rgba(255,255,255,0.4)"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM VS SOLUTION ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-black text-white tracking-tight mb-3" style={{fontSize:"clamp(32px,5vw,52px)"}}>
              Sound familiar?
            </h2>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:"18px"}}>Every student faces this. Most never fix it.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-8 rounded-2xl card-hover" style={{background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)"}}>
              <div className="text-xs font-black uppercase tracking-widest mb-5" style={{color:"#f87171"}}>😓 Without Tracktern</div>
              {["Applications lost in WhatsApp & email","Excel sheets nobody updates","Missing deadlines and follow-ups","Zero prep strategy before interviews","No clue which skills you're missing"].map((item,i) => (
                <div key={i} className="flex items-start gap-3 py-3" style={{borderBottom:i<4?"1px solid rgba(239,68,68,0.08)":"none"}}>
                  <span className="font-black mt-0.5 shrink-0" style={{color:"#ef4444"}}>✕</span>
                  <span className="text-sm" style={{color:"rgba(255,255,255,0.5)"}}>{item}</span>
                </div>
              ))}
            </div>
            <div className="p-8 rounded-2xl card-hover" style={{background:"rgba(124,58,237,0.05)",border:"1px solid rgba(124,58,237,0.2)"}}>
              <div className="text-xs font-black uppercase tracking-widest mb-5" style={{color:"#a78bfa"}}>✅ With Tracktern</div>
              {["One dashboard — every application tracked","AI prep plan for every company you apply","Smart tracking so nothing falls through","Know exactly which skills to build","Land more interviews, convert more offers"].map((item,i) => (
                <div key={i} className="flex items-start gap-3 py-3" style={{borderBottom:i<4?"1px solid rgba(124,58,237,0.08)":"none"}}>
                  <span className="font-black mt-0.5 shrink-0" style={{color:"#7c3aed"}}>✓</span>
                  <span className="text-sm" style={{color:"rgba(255,255,255,0.7)"}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-6" style={{borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{color:"#7c3aed"}}>Everything included · Free</p>
            <h2 className="font-black text-white tracking-tight" style={{fontSize:"clamp(32px,5vw,52px)"}}>
              One app. Every tool<br/>you need.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {icon:BarChart3,c:"#7c3aed",title:"Application Tracker",tag:"Core",desc:"Kanban board — Applied → Shortlisted → Interview → Offer. Know exactly where every application stands."},
              {icon:Brain,c:"#0ea5e9",title:"AI Interview Prep",tag:"AI ✨",desc:"Top 10 questions + skills to revise + personalized 3-day prep plan. Generated instantly for any company."},
              {icon:Mail,c:"#10b981",title:"Gmail Sync",tag:"Coming Soon",desc:"Auto-detect offer, rejection & interview emails. Your tracker updates itself — zero manual work."},
              {icon:Zap,c:"#f59e0b",title:"Skill Gap Analyzer",tag:"Smart",desc:"Add your skills. See exactly what companies need. Bridge the gap before you even apply."},
              {icon:Code2,c:"#a78bfa",title:"Daily Practice",tag:"DSA",desc:"22 pattern-wise topics. 700+ curated problems. Monitor your growth in real-time."},
              {icon:Users,c:"#f472b6",title:"Community",tag:"Social",desc:"Real interview questions from real students. Know what Google and Microsoft asked before you walk in."},
            ].map((f,i) => (
              <div key={i} className="p-6 rounded-2xl card-hover"
                style={{background:`rgba(${f.c==="#7c3aed"?"124,58,237":f.c==="#0ea5e9"?"14,165,233":f.c==="#10b981"?"16,185,129":f.c==="#f59e0b"?"245,158,11":f.c==="#a78bfa"?"167,139,250":"244,114,182"},0.05)`,border:`1px solid ${f.c}25`}}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{background:`${f.c}18`}}>
                    <f.icon className="w-5 h-5" style={{color:f.c}}/>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{background:`${f.c}18`,color:f.c}}>{f.tag}</span>
                </div>
                <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{color:"rgba(255,255,255,0.45)"}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GMAIL SPOTLIGHT ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="p-10 rounded-3xl overflow-hidden relative" style={{background:"linear-gradient(135deg,rgba(16,185,129,0.06),rgba(16,185,129,0.02))",border:"1px solid rgba(16,185,129,0.15)"}}>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{background:"radial-gradient(circle,#10b981,transparent 70%)"}}/>
            <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-5 uppercase tracking-widest" style={{background:"rgba(245,158,11,0.15)",color:"#f59e0b",border:"1px solid rgba(245,158,11,0.25)"}}>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"/>
                  Coming Soon
                </div>
                <h3 className="font-black text-white mb-4 tracking-tight" style={{fontSize:"clamp(28px,4vw,40px)"}}>Gmail Auto-Detection</h3>
                <p className="mb-6 leading-relaxed" style={{color:"rgba(255,255,255,0.5)"}}>
                  Connect Gmail and Tracktern automatically detects offer letters, rejection emails,
                  and interview invites — updating your tracker without lifting a finger.
                </p>
                {["Auto-detect offers & rejections","Interview invite notifications","Full company email history","Zero manual updates ever"].map((item,i) => (
                  <div key={i} className="flex items-center gap-2.5 mb-2.5">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{color:"#10b981"}}/>
                    <span className="text-sm" style={{color:"rgba(255,255,255,0.65)"}}>{item}</span>
                  </div>
                ))}
                <button onClick={() => { setShowAuth(true); setIsLogin(false) }}
                  className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                  style={{background:"linear-gradient(135deg,#10b981,#059669)"}}>
                  Get Early Access <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{background:"rgba(8,8,15,0.8)",border:"1px solid rgba(255,255,255,0.08)"}}>
                <div className="flex items-center justify-between p-4" style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{color:"#10b981"}}/>
                    <span className="text-white text-sm font-black">Gmail Sync</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{background:"rgba(245,158,11,0.15)",color:"#f59e0b"}}>Coming Soon</span>
                </div>
                <div className="p-4 space-y-2.5">
                  {[
                    {co:"Google",msg:"Interview scheduled for...",c:"#f59e0b",icon:"📅",time:"2m ago"},
                    {co:"Microsoft",msg:"Congratulations! Offer...",c:"#10b981",icon:"🎉",time:"1h ago"},
                    {co:"Flipkart",msg:"Application received...",c:"#7c3aed",icon:"✅",time:"3h ago"},
                    {co:"Razorpay",msg:"Moving to next round...",c:"#0ea5e9",icon:"🔥",time:"1d ago"},
                  ].map((item,i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-colors" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)"}}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base" style={{background:`${item.c}18`}}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-black">{item.co}</div>
                        <div className="text-xs truncate" style={{color:"rgba(255,255,255,0.35)"}}>{item.msg}</div>
                      </div>
                      <div className="text-xs shrink-0" style={{color:"rgba(255,255,255,0.2)"}}>{item.time}</div>
                    </div>
                  ))}
                  <div className="text-center pt-1 text-xs" style={{color:"rgba(255,255,255,0.2)"}}>Auto-synced from your inbox</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] opacity-15"
            style={{background:"radial-gradient(ellipse,#7c3aed,transparent 65%)"}}/>
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="font-black text-white tracking-tight leading-[0.92] mb-5"
            style={{fontSize:"clamp(40px,7vw,72px)"}}>
            Ready to land<br/>
            <span style={{background:"linear-gradient(135deg,#c4b5fd,#818cf8,#67e8f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              your internship?
            </span>
          </h2>
          <p className="mb-10 text-lg" style={{color:"rgba(255,255,255,0.4)"}}>
            Join students who stopped guessing and started tracking.
          </p>
          <button onClick={() => { setShowAuth(true); setIsLogin(false) }}
            className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl text-white font-black text-xl transition-all hover:scale-105"
            style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",boxShadow:"0 0 80px rgba(124,58,237,0.5)"}}>
            Start Tracking Free <ArrowRight className="w-6 h-6"/>
          </button>
          <p className="mt-4 text-sm" style={{color:"rgba(255,255,255,0.25)"}}>No credit card · Free forever · Built by a student</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6" style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>
              <Rocket className="w-3 h-3 text-white"/>
            </div>
            <span className="text-sm" style={{color:"rgba(255,255,255,0.3)"}}>Tracktern — Built by Ayush</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{color:"rgba(255,255,255,0.25)"}}>
            <button onClick={() => { setShowAuth(true); setIsLogin(false) }} className="hover:text-white transition-colors">Sign Up</button>
            <button onClick={() => { setShowAuth(true); setIsLogin(true) }} className="hover:text-white transition-colors">Sign In</button>
            <a href="/community" className="hover:text-white transition-colors flex items-center gap-1">
              <Users className="w-3.5 h-3.5"/> Community
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
