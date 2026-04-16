"use client"
import { useState, useEffect, useRef } from "react"
import { Brain, Play, Send, Clock, ChevronRight, RotateCcw, Trophy, Target, Mic, MicOff, Video, VideoOff, Star, Zap, Code2, Users, Settings2, FileText, Plus, CheckCircle, XCircle, ArrowLeft, Upload, Loader2 } from "lucide-react"
import { getToken } from "@/lib/api"
import { cn } from "@/lib/utils"

const API = "https://tracktern-27b8.onrender.com/api"

const ROUNDS = [
  { id: "DSA", label: "DSA", icon: Code2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", desc: "Data structures & algorithms", time: 120 },
  { id: "System Design", label: "System Design", icon: Settings2, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", desc: "Architecture & scalability", time: 300 },
  { id: "Behavioral", label: "Behavioral", icon: Users, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", desc: "STAR format responses", time: 180 },
  { id: "OA", label: "Online Assessment", icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", desc: "MCQ based assessment", time: 60 },
  { id: "HR", label: "HR Round", icon: Star, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", desc: "Culture fit & salary", time: 180 },
  { id: "Resume", label: "Resume Review", icon: FileText, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", desc: "Walk through your resume", time: 240 },
  { id: "Custom", label: "Custom Round", icon: Plus, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", desc: "Define your own topic", time: 180 },
]

const COMPANIES = [
  "Google","Amazon","Microsoft","Meta","Apple","Netflix",
  "Uber","Airbnb","Stripe","Dropbox","Twitter","LinkedIn","Spotify",
  "Flipkart","Swiggy","Zomato","Paytm","Razorpay","CRED","PhonePe",
  "Adobe","Oracle","SAP","Salesforce","ServiceNow","VMware","Atlassian",
  "Intel","NVIDIA","AMD","Qualcomm",
  "TCS","Infosys","Wipro","HCL","Accenture","Capgemini","Cognizant",
  "Goldman Sachs","Morgan Stanley","JPMorgan Chase","Visa","Mastercard",
  "Zoho","Freshworks","BrowserStack","Postman","InMobi"
]

const ROLES = [
  "SDE Intern","SDE","SDE 2","Software Engineer","Software Developer",
  "Frontend Engineer","Backend Engineer","Full Stack Developer",
  "Data Analyst","Data Scientist","ML Engineer","AI Engineer",
  "DevOps Engineer","Cloud Engineer","Security Engineer",
  "Product Manager","Associate Product Manager",
  "QA Engineer","Test Engineer",
  "Android Developer","iOS Developer"
]

const COMPANY_TAG_STYLES: Record<string,string> = {
  Google: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Amazon: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Meta: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Microsoft: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Apple: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Netflix: "bg-red-500/10 text-red-400 border-red-500/20",
  Airbnb: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Uber: "bg-black/10 text-black border-black/20",
  Stripe: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Tesla: "bg-red-500/10 text-red-400 border-red-500/20",
  LinkedIn: "bg-sky-700/10 text-sky-700 border-sky-700/20",
  NVIDIA: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  AMD: "bg-violet-500/10 text-violet-400 border-violet-500/20"
}

export default function MockInterviewPage() {
  const [phase, setPhase] = useState<"setup"|"interview"|"scoring"|"result">("setup")
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [selectedRound, setSelectedRound] = useState("DSA")
  const [difficulty, setDifficulty] = useState("Medium")
  const [numQuestions, setNumQuestions] = useState(5)
  const [customTopic, setCustomTopic] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [resumeFileName, setResumeFileName] = useState("")
  const [extractingResume, setExtractingResume] = useState(false)
  const [isDraggingResume, setIsDraggingResume] = useState(false)
  const [isPro, setIsPro] = useState(false)

  const [currentQ, setCurrentQ] = useState(0)
  const [question, setQuestion] = useState<any>(null)
  const [answer, setAnswer] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [timerActive, setTimerActive] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentScore, setCurrentScore] = useState<any>(null)
  const [finalReport, setFinalReport] = useState<any>(null)
  const [token, setToken] = useState<string|null>(null)

  // Camera & mic
  const [cameraOn, setCameraOn] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream|null>(null)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<any>(null)
  const startTimeRef = useRef<number>(0)
  const resumeFileInputRef = useRef<HTMLInputElement>(null)

  const filteredCompanySuggestions = company.trim()
    ? COMPANIES.filter(item => item.toLowerCase().includes(company.toLowerCase()))
    : []

  const filteredRoleSuggestions = role.trim()
    ? ROLES.filter(item => item.toLowerCase().includes(role.toLowerCase()))
    : []

  const currentCompanyBadgeStyle = COMPANY_TAG_STYLES[company] || "bg-secondary border-border text-foreground"

  useEffect(() => { setToken(getToken()) }, [])

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && timerActive) {
      clearInterval(timerRef.current)
      setTimerActive(false)
      if (answer.trim() || selectedOption) handleSubmit()
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive, timeLeft])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraOn(true)
    } catch { setCameraOn(false) }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    setCameraOn(false)
  }

  const startSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join(" ")
      setTranscript(t)
      setAnswer(t)
    }
    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
    setMicOn(true)
  }

  const stopSpeech = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
    setMicOn(false)
  }

  const clearResumeFile = () => {
    setResumeFileName("")
    if (resumeFileInputRef.current) {
      resumeFileInputRef.current.value = ""
    }
  }

  const processResumeFile = async (file: File | undefined) => {
    if (!file) return

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ]
    const fileName = file.name.toLowerCase()
    const isValidExtension = fileName.endsWith(".pdf") || fileName.endsWith(".docx") || fileName.endsWith(".txt")

    if (!validTypes.includes(file.type) && !isValidExtension) {
      alert("Please upload a PDF, DOCX, or TXT resume file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload a file smaller than 5MB.")
      return
    }

    setExtractingResume(true)

    try {
      const extractedText = await extractTextFromFile(file)
      const sanitizedText = sanitizeResumeText(extractedText)

      if (!sanitizedText.trim()) {
        alert("We could not extract readable text from that file.")
        return
      }

      setResumeText(sanitizedText)
      setResumeFileName(file.name)
    } catch {
      alert("We could not read that file. Try another PDF or DOCX, or paste the resume text manually.")
    } finally {
      setExtractingResume(false)
    }
  }

  const handleResumeFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    await processResumeFile(file)
  }

  const handleResumeDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingResume(true)
  }

  const handleResumeDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingResume(false)
  }

  const handleResumeDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingResume(false)
    const file = event.dataTransfer.files?.[0]
    await processResumeFile(file)
  }

  const handleBackToSetup = () => {
    clearInterval(timerRef.current)
    setTimerActive(false)
    stopSpeech()
    setPhase("setup")
  }

  const fetchQuestion = async () => {
  setLoading(true)
  setAnswer("")
  setSelectedOption("")
  setCurrentScore(null)
  setShowHints(false)
  setHintsUsed(false)
  setTranscript("")

  const round = ROUNDS.find(r => r.id === selectedRound)
  setTimeLeft(round?.time || 120)

  try {
    const res = await fetch(`${API}/mock-interview/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        company,
        role,
        type: selectedRound,
        difficulty,
        customTopic,
        resume: resumeText
      })
    })

    const data = await res.json()

    // 💥 MAIN FIX
    if (!res.ok) {
      alert(data.message || "Something went wrong")
      setLoading(false)
      return
    }

    // ✅ only valid case
    setQuestion(data)
    setTimerActive(true)
    startTimeRef.current = Date.now()

  } catch (err) {
    console.error(err)
    alert("Server error")
  }

  setLoading(false)
}

  const handleStart = async () => {
    if (!company || !role) return
    if (selectedRound === "Custom" && !customTopic) return
    if (selectedRound === "Resume" && !resumeText.trim()) return
    setPhase("interview"); setCurrentQ(1); setHistory([])
    await fetchQuestion()
  }

  const handleSubmit = async () => {
    if (!question) return
    const ans = selectedRound === "OA" ? selectedOption : answer
    if (!ans.trim()) return
    clearInterval(timerRef.current); setTimerActive(false); stopSpeech()
    setPhase("scoring")
    const timeUsed = Math.round((Date.now() - startTimeRef.current) / 1000)
    const roundType = question?.type || selectedRound
    try {
      const res = await fetch(`${API}/mock-interview/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question, answer: ans, type: roundType, round: roundType, company, role, transcript, timeUsed, hintsUsed })
      })
      const score = await res.json()
      setCurrentScore(score)
      setHistory(prev => [...prev, { question, answer: ans, score, timeUsed, type: roundType }])
    } catch {}
    setPhase("interview")
  }

  const handleNext = async () => {
    if (currentQ >= numQuestions) {
      await generateFinalReport()
      return
    }
    setCurrentQ(q => q + 1)
    await fetchQuestion()
  }

  const generateFinalReport = async () => {
    setPhase("scoring")
    try {
      const res = await fetch(`${API}/mock-interview/final-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rounds: history.map(h => ({ type: h.type || selectedRound, score: h.score.score, grade: h.score.grade })), company, role, totalTime: history.reduce((a, h) => a + h.timeUsed, 0) })
      })
      setFinalReport(await res.json())
    } catch {}
    setPhase("result")
  }

  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`
  const gradeColor = (g: string) => !g ? "text-muted-foreground" : g.startsWith("A") ? "text-green-400" : g.startsWith("B") ? "text-blue-400" : g.startsWith("C") ? "text-yellow-400" : "text-red-400"
  const avgScore = history.length > 0 ? Math.round(history.reduce((a, h) => a + (h.score?.score || 0), 0) / history.length) : 0
  const roundInfo = ROUNDS.find(r => r.id === selectedRound)
  const activeRoundInfo = ROUNDS.find(r => r.id === (question?.type || selectedRound))
  const displayRoundInfo = activeRoundInfo || roundInfo

  // SETUP
  if (phase === "setup") return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Brain className="w-6 h-6 text-primary" /> AI Mock Interview</h2>
          <p className="text-muted-foreground mt-1">GPT-4 powered real interview simulation with speech recognition & instant scoring</p>
        </div>
        <div className={cn("px-3 py-1.5 rounded-full text-xs font-bold border", isPro ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-secondary text-muted-foreground border-border")}>
          {isPro ? "⭐ PRO" : "FREE — 3 rounds max"}
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* COMPANY */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Target Company
            </label>

            <input
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Type: Google, Amazon..."
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            {company && (
              <p className="text-xs text-primary mt-1">
                🎯 Interviewing at <span className="font-bold">{company}</span>
              </p>
            )}

            {company && filteredCompanySuggestions.length > 0 && (
              <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                {filteredCompanySuggestions.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCompany(item)}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-primary/10"
                  >
                    <span className={cn("inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-bold", COMPANY_TAG_STYLES[item] || "border-border text-foreground")}>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Target Role
            </label>

            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Type: SWE, Frontend, Backend..."
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            {role && (
              <p className="text-xs text-purple-400 mt-1">
                💼 Role: <span className="font-bold">{role}</span>
              </p>
            )}

            {role && filteredRoleSuggestions.length > 0 && (
              <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                {filteredRoleSuggestions.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRole(item)}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-primary/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Select Round Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ROUNDS.map(r => (
              <button key={r.id} onClick={() => setSelectedRound(r.id)} className={cn("p-4 rounded-xl border text-left transition-all", selectedRound === r.id ? `${r.bg} ${r.border} border-2` : "bg-secondary/50 border-border hover:border-primary/30")}>
                <r.icon className={cn("w-5 h-5 mb-2", selectedRound === r.id ? r.color : "text-muted-foreground")} />
                <p className={cn("text-sm font-semibold", selectedRound === r.id ? r.color : "text-foreground")}>{r.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {selectedRound === "Custom" && (
          <div><label className="text-sm font-medium text-foreground mb-1.5 block">Custom Topic</label><input value={customTopic} onChange={e => setCustomTopic(e.target.value)} placeholder="e.g. React hooks, Database indexing, Leadership..." className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
        )}

        {selectedRound === "Resume" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Paste Resume</label>
            <div
              onDragOver={handleResumeDragOver}
              onDragLeave={handleResumeDragLeave}
              onDrop={handleResumeDrop}
              className={cn(
                "rounded-2xl border p-4 space-y-3 transition-all duration-200",
                isDraggingResume
                  ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(6,182,212,0.18)]"
                  : "border-border bg-secondary/50"
              )}
            >
              <input
                ref={resumeFileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleResumeFileSelect}
                className="hidden"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Upload resume file</p>
                  <p className="text-xs text-muted-foreground mt-1">Drag and drop a PDF, DOCX, or TXT here, or choose a file. We extract the text here and use it to ask company-specific questions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => resumeFileInputRef.current?.click()}
                  disabled={extractingResume}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/10 disabled:opacity-50"
                >
                  {extractingResume ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reading file...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Choose file
                    </>
                  )}
                </button>
              </div>
              {resumeFileName && (
                <div className="flex flex-col gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{resumeFileName}</p>
                    <p className="text-xs text-muted-foreground">Resume text extracted and ready for the interview.</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearResumeFile}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Clear file
                  </button>
                </div>
              )}
            </div>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume text here, or upload a file above. The interview will ask questions based on your actual experience, the target company, and the role."
              className="w-full min-h-44 px-3 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Resume round uses this text to generate company-specific questions about your projects, internships, impact, and skills.
            </p>
          </div>
        )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
              {["Easy","Medium","Hard"].map(d => <button key={d} onClick={() => setDifficulty(d)} className={cn("py-2 rounded-xl text-sm font-medium border transition-all", difficulty === d ? d === "Easy" ? "bg-green-500/20 text-green-400 border-green-500/30" : d === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-red-500/20 text-red-400 border-red-500/30" : "bg-secondary border-border text-muted-foreground")}>{d}</button>)}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Questions: <span className="text-primary font-bold">{isPro ? numQuestions : Math.min(numQuestions, 3)}</span>{!isPro && <span className="text-xs text-muted-foreground ml-1">(max 3 free)</span>}</label>
            <input type="range" min={3} max={isPro ? 15 : 3} value={numQuestions} onChange={e => setNumQuestions(+e.target.value)} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>3</span><span>{isPro ? "15" : "3 (free)"}</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
          <Video className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1"><p className="text-sm font-medium text-foreground">Camera & Microphone</p><p className="text-xs text-muted-foreground">Enable for speech-to-text answer input and real interview experience</p></div>
          <div className="flex gap-2">
            <button onClick={cameraOn ? stopCamera : startCamera} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all", cameraOn ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary border-border text-muted-foreground hover:text-foreground")}>{cameraOn ? <><Video className="w-3.5 h-3.5" /> On</> : <><VideoOff className="w-3.5 h-3.5" /> Off</>}</button>
          </div>
        </div>

        <button onClick={handleStart} disabled={!company || !role || (selectedRound === "Custom" && !customTopic) || (selectedRound === "Resume" && !resumeText.trim())} className="w-full py-4 rounded-xl gradient-purple text-primary-foreground font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity">
          <Play className="w-5 h-5" /> Start {roundInfo?.label} Interview
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[{icon:Brain,title:"GPT-4 Powered",desc:"Real questions from actual company interviews"},{icon:Mic,title:"Speech to Text",desc:"Speak your answer, AI transcribes instantly"},{icon:Zap,title:"Instant Scoring",desc:"Grade, feedback, ideal answer after each round"}].map((f,i) => (
          <div key={i} className="glass-card rounded-xl border border-border p-4 text-center"><f.icon className="w-5 h-5 text-primary mx-auto mb-2" /><p className="text-xs font-semibold text-foreground">{f.title}</p><p className="text-xs text-muted-foreground mt-1">{f.desc}</p></div>
        ))}
      </div>
    </div>
  )

  // SCORING LOADER
  if (phase === "scoring") return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-4">
        <Brain className="w-12 h-12 text-primary mx-auto animate-pulse" />
        <p className="text-foreground font-semibold">GPT-4 is evaluating your answer...</p>
        <p className="text-muted-foreground text-sm">Analyzing technical accuracy, communication & confidence</p>
      </div>
    </div>
  )

  // INTERVIEW
  if (phase === "interview") return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <button type="button" onClick={handleBackToSetup} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to setup
          </button>

          <div className="flex items-center gap-3">
            {company && (
              <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center text-sm font-black border", currentCompanyBadgeStyle)}>{company.slice(0, 2).toUpperCase()}</div>
            )}

            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">
                🚀 {company} Interview
              </h2>

              <p className="text-sm text-muted-foreground">
                Position: <span className="text-primary font-semibold">{role}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              {company}
            </span>

            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
              {role}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-sm border", timeLeft < 30 ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" : timeLeft < 60 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-secondary text-foreground border-border")}><Clock className="w-4 h-4" />{formatTime(timeLeft)}</div>
          <div className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">Q{currentQ}/{numQuestions}</div>
        </div>
      </div>

      <div className="h-1.5 bg-secondary rounded-full"><div className="h-1.5 bg-primary rounded-full transition-all duration-500" style={{width:`${((currentQ-1)/numQuestions)*100}%`}} /></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="glass-card rounded-2xl border border-border p-10 text-center"><Brain className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse" /><p className="text-muted-foreground">GPT-4 is crafting your question...</p></div>
          ) : question && (
            <div className="glass-card rounded-2xl border border-primary/20 p-6 space-y-4">
              <div className="flex items-center gap-2"><span className={cn("text-xs font-bold px-2.5 py-1 rounded-full border", roundInfo?.bg, roundInfo?.border, roundInfo?.color)}>{question.type}</span><span className={cn("text-xs font-bold px-2.5 py-1 rounded-full border", difficulty === "Easy" ? "bg-green-500/15 text-green-400 border-green-500/20" : difficulty === "Medium" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" : "bg-red-500/15 text-red-400 border-red-500/20")}>{difficulty}</span></div>
              <p className="text-foreground text-lg font-medium leading-relaxed">{question.question}</p>
              {question.expectedTopics?.length > 0 && <div className="flex flex-wrap gap-1.5">{question.expectedTopics.map((t: string) => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{t}</span>)}</div>}
              {!currentScore && <button onClick={() => {setShowHints(!showHints); if(!showHints) setHintsUsed(true)}} className="text-xs text-yellow-400 hover:opacity-80 flex items-center gap-1">💡 {showHints ? "Hide" : "Show"} hints {!hintsUsed && "(−5 pts)"}</button>}
              {showHints && question.hints && <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 space-y-1">{question.hints.map((h: string, i: number) => <p key={i} className="text-xs text-yellow-300">• {h}</p>)}</div>}
              {question.followUp && currentScore && <div className="bg-primary/5 border border-primary/20 rounded-xl p-3"><p className="text-xs font-bold text-primary mb-1">Follow-up Question</p><p className="text-sm text-foreground">{question.followUp}</p></div>}
            </div>
          )}

          {!currentScore && question && !loading && (
            selectedRound === "OA" ? (
              <div className="glass-card rounded-2xl border border-border p-5 space-y-3">
                <p className="text-sm font-medium text-foreground">Select your answer:</p>
                {question.options?.map((opt: string) => (
                  <button key={opt} onClick={() => setSelectedOption(opt[0])} className={cn("w-full p-3 rounded-xl border text-left text-sm transition-all", selectedOption === opt[0] ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/50 text-foreground hover:border-primary/40")}>{opt}</button>
                ))}
                <button onClick={handleSubmit} disabled={!selectedOption} className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"><Send className="w-4 h-4" /> Submit Answer</button>
              </div>
            ) : (
              <div className="glass-card rounded-2xl border border-border p-4 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-1">
                  <label className="text-sm font-medium text-foreground">Your Answer</label>
                  <div className="flex gap-2">
                    <button onClick={isListening ? stopSpeech : startSpeech} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all", isListening ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" : "bg-secondary border-border text-muted-foreground hover:text-foreground")}>{isListening ? <><MicOff className="w-3.5 h-3.5" /> Stop</> : <><Mic className="w-3.5 h-3.5" /> Speak</>}</button>
                  </div>
                </div>
                {isListening && <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20"><div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /><span className="text-xs text-red-400">Listening... speak your answer</span></div>}
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder={selectedRound === "DSA" ? "Explain your approach, complexity, edge cases..." : selectedRound === "System Design" ? "Describe components, trade-offs, scaling..." : selectedRound === "Behavioral" ? "Situation → Task → Action → Result..." : "Your answer..."} className="w-full h-36 px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs text-muted-foreground">{answer.length} chars</span>
                  <button onClick={handleSubmit} disabled={!answer.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-purple text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-50"><Send className="w-4 h-4" /> Submit</button>
                </div>
              </div>
            )
          )}

          {currentScore && (
            <div className="glass-card rounded-2xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground text-lg">Q{currentQ} Results</h3>
                  <p className="text-xs text-muted-foreground mt-1">{question?.type || selectedRound} Round</p>
                </div>
                <div className="text-center"><div className={cn("text-3xl font-black", gradeColor(currentScore.grade))}>{currentScore.grade}</div><div className="text-xs text-muted-foreground">{currentScore.score}/100</div></div>
              </div>
              <div className="h-2 bg-secondary rounded-full"><div className={cn("h-2 rounded-full transition-all", currentScore.score >= 80 ? "bg-green-500" : currentScore.score >= 60 ? "bg-yellow-500" : "bg-red-500")} style={{width:`${currentScore.score}%`}} /></div>

              {(currentScore.technicalScore || currentScore.communicationScore || currentScore.confidenceScore) && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[{label:"Technical",val:currentScore.technicalScore,color:"text-blue-400"},{label:"Communication",val:currentScore.communicationScore,color:"text-green-400"},{label:"Confidence",val:currentScore.confidenceScore,color:"text-purple-400"}].map(m => (
                    <div key={m.label} className="glass-card rounded-xl border border-border p-3 text-center"><div className={cn("text-xl font-black", m.color)}>{m.val}</div><div className="text-xs text-muted-foreground">{m.label}</div></div>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground leading-relaxed">{currentScore.feedback}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><p className="text-xs font-bold text-green-400 uppercase tracking-wide mb-2">✓ Strengths</p>{currentScore.strengths?.map((s: string, i: number) => <p key={i} className="text-xs text-foreground mb-1.5">• {s}</p>)}</div>
                <div><p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-2">✗ Improve</p>{currentScore.improvements?.map((s: string, i: number) => <p key={i} className="text-xs text-foreground mb-1.5">• {s}</p>)}</div>
              </div>
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-4"><p className="text-xs font-bold text-primary mb-2">Ideal Answer</p><p className="text-sm text-muted-foreground leading-relaxed">{currentScore.idealAnswer}</p></div>
              {currentScore.tips && <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4"><p className="text-xs font-bold text-yellow-400 mb-2">⚡ Tips</p>{currentScore.tips?.map((t: string, i: number) => <p key={i} className="text-xs text-foreground mb-1">• {t}</p>)}</div>}
              <button onClick={handleNext} className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90">{currentQ >= numQuestions ? <><Trophy className="w-4 h-4" /> See Final Report</> : <><ChevronRight className="w-4 h-4" /> Next Question</>}</button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {cameraOn && (
            <div className="glass-card rounded-2xl border border-border overflow-hidden">
              <video ref={videoRef} autoPlay muted playsInline className="w-full aspect-video object-cover bg-black" />
              <div className="p-3 space-y-2">
                <p className="text-xs font-medium text-foreground">Camera Active</p>
                <div className="space-y-1.5">
                  {["Maintain eye contact","Sit up straight","Speak clearly","Don't rush"].map((tip,i) => <div key={i} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" /><span className="text-xs text-muted-foreground">{tip}</span></div>)}
                </div>
              </div>
            </div>
          )}

          <div className="glass-card rounded-xl border border-border p-4">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">Progress</p>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] text-muted-foreground truncate">{h.type || "Round"}</span>
                      <span className={cn("text-xs font-bold shrink-0", gradeColor(h.score.grade))}>{h.score.grade}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full"><div className={cn("h-1.5 rounded-full", h.score.score >= 80 ? "bg-green-500" : h.score.score >= 60 ? "bg-yellow-500" : "bg-red-500")} style={{width:`${h.score.score}%`}} /></div>
                  </div>
                </div>
              ))}
              {Array.from({length: numQuestions - history.length - (currentScore ? 0 : 1)}).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-2 opacity-30">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{history.length + (currentScore ? 1 : 2) + i}</div>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full" />
                </div>
              ))}
            </div>
            {history.length > 0 && <div className="mt-3 pt-3 border-t border-border"><p className="text-xs text-muted-foreground">Avg Score</p><p className={cn("text-xl font-black", avgScore >= 80 ? "text-green-400" : avgScore >= 60 ? "text-yellow-400" : "text-red-400")}>{avgScore}</p></div>}
          </div>

          <div className="glass-card rounded-xl border border-border p-4">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">Round Info</p>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", displayRoundInfo?.bg)}>{displayRoundInfo && <displayRoundInfo.icon className={cn("w-5 h-5", displayRoundInfo.color)} />}</div>
            <p className="text-sm font-semibold text-foreground">{displayRoundInfo?.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{displayRoundInfo?.desc}</p>
            <p className="text-xs text-muted-foreground mt-1">⏱ {Math.floor((displayRoundInfo?.time || 120) / 60)}m per question</p>
          </div>
        </div>
      </div>
    </div>
  )

  // RESULT
  if (phase === "result") return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-card rounded-2xl border border-border p-8 text-center">
        <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl font-black text-foreground mb-1">Interview Complete!</h2>
        <p className="text-muted-foreground mb-2">{company} · {role} · {roundInfo?.label}</p>
        {finalReport && <>
          <div className={cn("text-7xl font-black my-4", finalReport.overallGrade?.startsWith("A") ? "text-green-400" : finalReport.overallGrade?.startsWith("B") ? "text-blue-400" : "text-yellow-400")}>{finalReport.overallGrade}</div>
          <div className={cn("inline-block px-4 py-2 rounded-full text-sm font-bold border mb-4", finalReport.decision === "Strong Hire" ? "bg-green-500/20 text-green-400 border-green-500/30" : finalReport.decision === "Hire" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30")}>{finalReport.decision}</div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">{finalReport.summary}</p>
          <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-3">
            <div className="text-center"><div className="text-2xl font-black text-primary">{finalReport.avgScore}</div><div className="text-xs text-muted-foreground">Avg Score</div></div>
            <div className="text-center"><div className="text-2xl font-black text-green-400">{finalReport.hiringChance}%</div><div className="text-xs text-muted-foreground">Hire Chance</div></div>
            <div className="text-center"><div className="text-2xl font-black text-blue-400">{history.length}</div><div className="text-xs text-muted-foreground">Questions</div></div>
          </div>
        </>}
      </div>

      {finalReport && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl border border-green-500/20 p-5 bg-green-500/5"><p className="text-xs font-bold text-green-400 uppercase mb-2">Top Strength</p><p className="text-sm text-foreground">{finalReport.topStrength}</p></div>
          <div className="glass-card rounded-xl border border-red-500/20 p-5 bg-red-500/5"><p className="text-xs font-bold text-red-400 uppercase mb-2">Top Weakness</p><p className="text-sm text-foreground">{finalReport.topWeakness}</p></div>
        </div>
      )}

      <div className="glass-card rounded-xl border border-border p-5">
        <h3 className="font-bold text-foreground mb-4">Round by Round</h3>
        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">{i+1}</div>
              <div className="flex-1 min-w-0"><p className="text-sm text-foreground truncate">{h.question.question}</p><p className="text-xs text-muted-foreground mt-0.5">{h.type || "Round"} · {h.timeUsed}s · {h.score.passed ? "✓ Passed" : "✗ Failed"}</p></div>
              <div className={cn("text-xl font-black shrink-0", gradeColor(h.score.grade))}>{h.score.grade}</div>
            </div>
          ))}
        </div>
      </div>

      {finalReport?.studyPlan && (
        <div className="glass-card rounded-xl border border-primary/20 p-5 bg-primary/5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Personalized Study Plan</h3>
          <div className="space-y-4">
            {finalReport.studyPlan.map((week: any, i: number) => (
              <div key={i} className="border-l-2 border-primary/30 pl-4">
                <p className="text-sm font-bold text-primary">Week {week.week} — {week.focus}</p>
                <div className="mt-2 space-y-1">{week.tasks?.map((t: string, j: number) => <p key={j} className="text-xs text-muted-foreground">• {t}</p>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {finalReport?.nextSteps && (
        <div className="glass-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-3">Next Steps</h3>
          {finalReport.nextSteps.map((s: string, i: number) => (
            <div key={i} className="flex items-start gap-3 mb-2"><div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">{i+1}</div><p className="text-sm text-foreground">{s}</p></div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => {setPhase("setup");setHistory([]);setCurrentQ(0);setFinalReport(null)}} className="flex-1 py-3 rounded-xl gradient-purple text-primary-foreground font-bold flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Try Again</button>
      </div>
    </div>
  )

  return null
}

async function extractTextFromFile(file: File) {
  const fileName = file.name.toLowerCase()

  if (file.type === "text/plain" || fileName.endsWith(".txt")) {
    return file.text()
  }

  if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
    return extractTextFromPdf(file)
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return extractTextFromDocx(file)
  }

  throw new Error("Unsupported file type")
}

async function extractTextFromPdf(file: File) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  const pages: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()

    if (pageText) {
      pages.push(pageText)
    }
  }

  return pages.join("\n\n")
}

async function extractTextFromDocx(file: File) {
  const mammoth = await import("mammoth")
  const arrayBuffer = await file.arrayBuffer()
  const { value } = await mammoth.extractRawText({ arrayBuffer })
  return value
}

function sanitizeResumeText(text: string) {
  return text
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s([—–•])/g, " $1")
    .trim()
}
