"use client"
import { useState, useEffect, useRef } from "react"
import { Brain, Play, Send, Clock, ChevronRight, RotateCcw, Trophy, Target } from "lucide-react"
import { getToken } from "@/lib/api"
import { cn } from "@/lib/utils"

const API = "https://tracktern-27b8.onrender.com/api"

export default function MockInterviewPage() {
  const [phase, setPhase] = useState<"setup"|"interview"|"result"|"review">("setup")
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [type, setType] = useState("DSA")
  const [difficulty, setDifficulty] = useState("Medium")
  const [rounds, setRounds] = useState(5)
  const [currentRound, setCurrentRound] = useState(0)
  const [question, setQuestion] = useState<any>(null)
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [scoring, setScoring] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [timerActive, setTimerActive] = useState(false)
  const [roundHistory, setRoundHistory] = useState<any[]>([])
  const [currentScore, setCurrentScore] = useState<any>(null)
  const [showHints, setShowHints] = useState(false)
  const [token, setToken] = useState<string|null>(null)
  const timerRef = useRef<any>(null)

  useEffect(() => { setToken(getToken()) }, [])

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && timerActive) {
      handleSubmitAnswer()
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive, timeLeft])

  const timeLimit = () => type === "DSA" ? 120 : type === "System Design" ? 300 : 180

  const fetchQuestion = async () => {
    setLoading(true); setAnswer(""); setCurrentScore(null); setShowHints(false)
    setTimeLeft(timeLimit())
    try {
      const res = await fetch(`${API}/mock-interview/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ company, role, type, difficulty, previousQuestions: roundHistory.map(r => r.question.question) })
      })
      setQuestion(await res.json())
      setTimerActive(true)
    } catch {}
    setLoading(false)
  }

  const handleStart = async () => {
    if (!company || !role) return
    setPhase("interview"); setCurrentRound(1); setRoundHistory([])
    await fetchQuestion()
  }

  const handleSubmitAnswer = async () => {
    if (!question || !answer.trim()) return
    clearInterval(timerRef.current); setTimerActive(false); setScoring(true)
    try {
      const res = await fetch(`${API}/mock-interview/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: question.question, answer, type, company, role })
      })
      const score = await res.json()
      setCurrentScore(score)
      setRoundHistory(prev => [...prev, { question, answer, score, timeUsed: timeLimit() - timeLeft }])
    } catch {}
    setScoring(false)
  }

  const handleNext = async () => {
    if (currentRound >= rounds) { setPhase("result"); return }
    setCurrentRound(r => r + 1)
    await fetchQuestion()
  }

  const avgScore = roundHistory.length > 0 ? Math.round(roundHistory.reduce((a, r) => a + r.score.score, 0) / roundHistory.length) : 0
  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`
  const gradeColor = (g: string) => g?.startsWith("A") ? "text-green-400" : g?.startsWith("B") ? "text-blue-400" : g?.startsWith("C") ? "text-yellow-400" : "text-red-400"

  if (phase === "setup") return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Brain className="w-6 h-6 text-primary" /> Mock Interview</h2><p className="text-muted-foreground mt-1">AI-powered real interview simulation with instant scoring</p></div>
      <div className="glass-card rounded-2xl border border-border p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium text-foreground mb-1.5 block">Company</label><input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
          <div><label className="text-sm font-medium text-foreground mb-1.5 block">Role</label><input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. SWE Intern" className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
        </div>
        <div><label className="text-sm font-medium text-foreground mb-2 block">Interview Type</label><div className="grid grid-cols-3 gap-2">{["DSA","System Design","Behavioral"].map(t => <button key={t} onClick={() => setType(t)} className={cn("py-2.5 rounded-xl text-sm font-medium border transition-all", type === t ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground")}>{t}</button>)}</div></div>
        <div><label className="text-sm font-medium text-foreground mb-2 block">Difficulty</label><div className="grid grid-cols-3 gap-2">{["Easy","Medium","Hard"].map(d => <button key={d} onClick={() => setDifficulty(d)} className={cn("py-2.5 rounded-xl text-sm font-medium border transition-all", difficulty === d ? d === "Easy" ? "bg-green-500/20 text-green-400 border-green-500/30" : d === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-red-500/20 text-red-400 border-red-500/30" : "bg-secondary border-border text-muted-foreground")}>{d}</button>)}</div></div>
        <div><label className="text-sm font-medium text-foreground mb-2 block">Rounds: <span className="text-primary">{rounds}</span></label><input type="range" min={3} max={10} value={rounds} onChange={e => setRounds(+e.target.value)} className="w-full" /></div>
        <button onClick={handleStart} disabled={!company || !role} className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"><Play className="w-5 h-5" /> Start Interview</button>
      </div>
    </div>
  )

  if (phase === "interview") return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-foreground">{company} — {role}</h2><p className="text-sm text-muted-foreground">{type} · {difficulty}</p></div>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-sm border", timeLeft < 30 ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" : "bg-secondary text-foreground border-border")}><Clock className="w-4 h-4" />{formatTime(timeLeft)}</div>
          <div className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">Round {currentRound}/{rounds}</div>
        </div>
      </div>
      <div className="h-1.5 bg-secondary rounded-full"><div className="h-1.5 bg-primary rounded-full transition-all" style={{width:`${((currentRound-1)/rounds)*100}%`}} /></div>
      {loading ? <div className="glass-card rounded-2xl border border-border p-10 text-center"><Brain className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse" /><p className="text-muted-foreground">Generating question...</p></div>
      : question && <div className="glass-card rounded-2xl border border-primary/20 p-6 space-y-4">
          <p className="text-foreground text-lg font-medium leading-relaxed">{question.question}</p>
          {!currentScore && <button onClick={() => setShowHints(!showHints)} className="text-xs text-primary hover:opacity-80">💡 {showHints ? "Hide" : "Show"} hints</button>}
          {showHints && question.hints && <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">{question.hints.map((h: string, i: number) => <p key={i} className="text-xs text-yellow-300">• {h}</p>)}</div>}
        </div>}
      {!currentScore && question && !loading && <div className="glass-card rounded-2xl border border-border p-4 space-y-3">
        <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder={type === "DSA" ? "Explain your approach..." : type === "System Design" ? "Describe your architecture..." : "Use STAR format..."} className="w-full h-40 px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        <div className="flex justify-end"><button onClick={handleSubmitAnswer} disabled={!answer.trim() || scoring} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-purple text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-50">{scoring ? <><Brain className="w-4 h-4 animate-pulse" /> Scoring...</> : <><Send className="w-4 h-4" /> Submit</>}</button></div>
      </div>}
      {currentScore && <div className="glass-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-bold text-foreground">Round {currentRound} Results</h3><div className={cn("text-3xl font-black", gradeColor(currentScore.grade))}>{currentScore.grade}</div></div>
        <div className="h-2 bg-secondary rounded-full"><div className={cn("h-2 rounded-full", currentScore.score >= 80 ? "bg-green-500" : currentScore.score >= 60 ? "bg-yellow-500" : "bg-red-500")} style={{width:`${currentScore.score}%`}} /></div>
        <p className="text-sm text-muted-foreground">{currentScore.feedback}</p>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-xs font-bold text-green-400 mb-2">✓ Strengths</p>{currentScore.strengths?.map((s: string, i: number) => <p key={i} className="text-xs text-foreground mb-1">• {s}</p>)}</div>
          <div><p className="text-xs font-bold text-red-400 mb-2">✗ Improve</p>{currentScore.improvements?.map((s: string, i: number) => <p key={i} className="text-xs text-foreground mb-1">• {s}</p>)}</div>
        </div>
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-3"><p className="text-xs font-bold text-primary mb-1">Ideal Answer</p><p className="text-xs text-muted-foreground">{currentScore.idealAnswer}</p></div>
        <button onClick={handleNext} className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-bold flex items-center justify-center gap-2">{currentRound >= rounds ? <><Trophy className="w-4 h-4" /> See Results</> : <><ChevronRight className="w-4 h-4" /> Next Round</>}</button>
      </div>}
    </div>
  )

  if (phase === "result") return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card rounded-2xl border border-border p-8 text-center">
        <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <h2 className="text-2xl font-black text-foreground mb-1">Interview Complete!</h2>
        <p className="text-muted-foreground mb-4">{company} — {role}</p>
        <div className={cn("text-6xl font-black mb-2", gradeColor(roundHistory[roundHistory.length-1]?.score.grade))}>{avgScore}</div>
        <p className="text-muted-foreground text-sm">Average score across {rounds} rounds</p>
      </div>
      <div className="space-y-3">{roundHistory.map((r, i) => <div key={i} className="glass-card rounded-xl border border-border p-4 flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{i+1}</div><div className="flex-1 min-w-0"><p className="text-sm text-foreground truncate">{r.question.question}</p></div><div className={cn("text-xl font-black", gradeColor(r.score.grade))}>{r.score.grade}</div></div>)}</div>
      <button onClick={() => {setPhase("setup");setRoundHistory([]);setCurrentRound(0)}} className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-bold flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Try Again</button>
    </div>
  )

  return null
}
