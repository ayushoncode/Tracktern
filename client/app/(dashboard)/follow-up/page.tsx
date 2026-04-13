"use client"
import { useState, useEffect } from "react"
import { Mail, Sparkles, Copy, Check, RefreshCw } from "lucide-react"
import { getToken } from "@/lib/api"

const API = "https://tracktern-27b8.onrender.com/api"

export default function FollowUpPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [days, setDays] = useState(7)
  const [tone, setTone] = useState("Professional")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [token, setToken] = useState<string|null>(null)

  useEffect(() => {
    const t = getToken()
    setToken(t)
    if (!t) return
    fetch(`${API}/companies`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => setCompanies(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const generate = async () => {
    if (!selected) return
    setLoading(true); setEmail("")
    try {
      const res = await fetch(`${API}/ai/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ company: selected.name, role: selected.role, days, tone })
      })
      const data = await res.json()
      setEmail(data.email)
      setSubject(`Follow-up: ${selected.role} Application — ${selected.name}`)
    } catch {}
    setLoading(false)
  }

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Mail className="w-6 h-6 text-primary" /> Follow-up Email Generator</h2><p className="text-muted-foreground mt-1">AI writes personalized follow-up emails for each application</p></div>
      <div className="glass-card rounded-2xl border border-border p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Select Application</label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {companies.length === 0 ? <p className="text-sm text-muted-foreground p-3">No applications found.</p> : companies.map((c: any) => (
              <button key={c._id} onClick={() => setSelected(c)} className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selected?._id === c._id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 bg-secondary/50"}`}>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{c.name?.charAt(0)}</div>
                <div><p className="text-sm font-medium text-foreground">{c.name}</p><p className="text-xs text-muted-foreground">{c.role} · {c.status}</p></div>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Days Since Applied: <span className="text-primary">{days}</span></label>
            <input type="range" min={1} max={30} value={days} onChange={e => setDays(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Tone</label>
            <div className="flex flex-col gap-1.5">{["Professional","Friendly","Confident"].map(t => <button key={t} onClick={() => setTone(t)} className={`py-1.5 px-3 rounded-lg text-sm font-medium border transition-all text-left ${tone === t ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground"}`}>{t}</button>)}</div>
          </div>
        </div>
        <button onClick={generate} disabled={!selected || loading} className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">{loading ? <><Sparkles className="w-4 h-4 animate-pulse" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Email</>}</button>
      </div>
      {email && <div className="glass-card rounded-2xl border border-primary/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">Generated Email</h3>
          <div className="flex gap-2">
            <button onClick={generate} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"><RefreshCw className="w-3 h-3" /> Regenerate</button>
            <button onClick={() => copy(`Subject: ${subject}\n\n${email}`)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10">{copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy All</>}</button>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 border border-border"><p className="text-xs text-muted-foreground mb-1">Subject</p><p className="text-sm font-medium text-foreground">{subject}</p></div>
        <div className="bg-secondary/30 rounded-xl p-4 border border-border"><pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{email}</pre></div>
        <div className="flex gap-2">
          <button onClick={() => copy(email)} className="flex-1 py-2 rounded-xl border border-border text-sm text-foreground hover:bg-secondary flex items-center justify-center gap-2"><Copy className="w-4 h-4" /> Copy Body</button>
          <a href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(email)}`} className="flex-1 py-2 rounded-xl gradient-purple text-primary-foreground text-sm font-bold flex items-center justify-center gap-2"><Mail className="w-4 h-4" /> Open in Mail</a>
        </div>
      </div>}
    </div>
  )
}
