"use client"
import { useState, useEffect } from "react"
import { FileText, Zap } from "lucide-react"
import { getToken } from "@/lib/api"
import { cn } from "@/lib/utils"

const API = "https://tracktern-27b8.onrender.com/api"

export default function ResumeAnalyzerPage() {
  const [resume, setResume] = useState("")
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string|null>(null)

  useEffect(() => { setToken(getToken()) }, [])

  const analyze = async () => {
    if (!resume.trim() || !company || !role) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch(`${API}/mock-interview/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resume, company, role })
      })
      setResult(await res.json())
    } catch {}
    setLoading(false)
  }

  const gradeColor = (s: number) => s >= 80 ? "text-green-400" : s >= 60 ? "text-yellow-400" : "text-red-400"

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><FileText className="w-6 h-6 text-primary" /> Resume Analyzer</h2><p className="text-muted-foreground mt-1">AI analyzes your resume against specific company requirements</p></div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium text-foreground mb-1.5 block">Company</label><input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
            <div><label className="text-sm font-medium text-foreground mb-1.5 block">Role</label><input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. SWE Intern" className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
          </div>
          <div><label className="text-sm font-medium text-foreground mb-1.5 block">Paste Your Resume</label><textarea value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your resume text here..." className="w-full h-64 px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" /></div>
          <button onClick={analyze} disabled={!resume.trim() || !company || !role || loading} className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">{loading ? <><Zap className="w-4 h-4 animate-pulse" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Analyze Resume</>}</button>
        </div>
        <div>
          {!result && !loading && <div className="glass-card rounded-2xl border border-border p-8 text-center h-full flex flex-col items-center justify-center"><FileText className="w-12 h-12 text-muted-foreground mb-3" /><p className="text-muted-foreground">Paste your resume and select a target company</p></div>}
          {loading && <div className="glass-card rounded-2xl border border-border p-8 text-center h-full flex flex-col items-center justify-center"><Zap className="w-8 h-8 text-primary animate-pulse mb-3" /><p className="text-muted-foreground">Analyzing for {company}...</p></div>}
          {result && <div className="space-y-4">
            <div className="glass-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div><p className="text-xs text-muted-foreground uppercase tracking-wide">Overall Score</p><div className={cn("text-4xl font-black", gradeColor(result.overallScore))}>{result.overallScore}/100</div></div>
                <div className="text-right"><p className="text-xs text-muted-foreground uppercase tracking-wide">ATS Score</p><div className={cn("text-3xl font-black", gradeColor(result.atsScore))}>{result.atsScore}</div></div>
              </div>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>
            <div className="glass-card rounded-xl border border-green-500/20 p-4 bg-green-500/5"><p className="text-xs font-bold text-green-400 uppercase mb-2">✓ Strengths</p>{result.strengths?.map((s: string, i: number) => <p key={i} className="text-xs text-foreground mb-1">• {s}</p>)}</div>
            <div className="glass-card rounded-xl border border-red-500/20 p-4 bg-red-500/5"><p className="text-xs font-bold text-red-400 uppercase mb-2">✗ Missing Skills</p><div className="flex flex-wrap gap-1.5">{result.missingSkills?.map((s: string, i: number) => <span key={i} className="px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{s}</span>)}</div></div>
            <div className="glass-card rounded-xl border border-yellow-500/20 p-4 bg-yellow-500/5"><p className="text-xs font-bold text-yellow-400 uppercase mb-2">⚡ Missing Keywords</p><div className="flex flex-wrap gap-1.5">{result.keywordsMissing?.map((k: string, i: number) => <span key={i} className="px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">{k}</span>)}</div></div>
            <div className="glass-card rounded-xl border border-primary/20 p-4 bg-primary/5"><p className="text-xs font-bold text-primary uppercase mb-2">💡 Suggestions</p>{result.suggestions?.map((s: string, i: number) => <p key={i} className="text-xs text-foreground mb-1.5">• {s}</p>)}</div>
          </div>}
        </div>
      </div>
    </div>
  )
}
