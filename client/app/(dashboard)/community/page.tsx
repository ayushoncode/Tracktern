"use client"

import { useState, useEffect } from "react"
import { Users, Plus, X, Star, Building2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getToken } from "@/lib/api"
import { cn } from "@/lib/utils"

const API_URL = "https://tracktern-27b8.onrender.com/api"

const typeColors: Record<string, string> = {
  phone: "bg-blue-500/20 text-blue-400",
  technical: "bg-purple-500/20 text-purple-400",
  behavioral: "bg-yellow-500/20 text-yellow-400",
  onsite: "bg-green-500/20 text-green-400",
}

export default function CommunityPage() {
  const [experiences, setExperiences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState({
    company: "", role: "", type: "technical",
    difficulty: "3", outcome: "cleared",
    questions: "", stuck: "", tips: ""
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`${API_URL}/community`)
      const data = await res.json()
      setExperiences(Array.isArray(data) ? data : [])
    } catch { setExperiences([]) }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!form.company || !form.role || !form.questions) return
    setSubmitting(true)
    const token = getToken()!
    try {
      const res = await fetch(`${API_URL}/community`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          difficulty: parseInt(form.difficulty),
          questions: form.questions.split("\n").filter(q => q.trim()),
        })
      })
      const data = await res.json()
      setExperiences([data, ...experiences])
      setForm({ company: "", role: "", type: "technical", difficulty: "3", outcome: "cleared", questions: "", stuck: "", tips: "" })
      setIsAdding(false)
    } catch {}
    setSubmitting(false)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground animate-pulse">Loading experiences...</div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Community Experiences</h2>
          <p className="text-muted-foreground">Real interview experiences shared by students</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gradient-purple hover:opacity-90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Share Experience
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="glass-card rounded-xl p-5 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Share Your Interview Experience</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}><X className="w-5 h-5" /></Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                <Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="e.g., Google" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Role</label>
                <Input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g., SWE Intern" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground text-sm">
                  <option value="phone">Phone Screen</option>
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Difficulty (1-5)</label>
                <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground text-sm">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} - {["Very Easy","Easy","Medium","Hard","Very Hard"][n-1]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Outcome</label>
                <select value={form.outcome} onChange={e => setForm({...form, outcome: e.target.value})} className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground text-sm">
                  <option value="cleared">Cleared ✅</option>
                  <option value="rejected">Rejected ❌</option>
                  <option value="pending">Pending ⏳</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Questions Asked (one per line) *</label>
              <Textarea value={form.questions} onChange={e => setForm({...form, questions: e.target.value})} placeholder="What questions were you asked?" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-20" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Where did you get stuck?</label>
              <Textarea value={form.stuck} onChange={e => setForm({...form, stuck: e.target.value})} placeholder="Topics or questions where you struggled..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-16" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Tips for others</label>
              <Textarea value={form.tips} onChange={e => setForm({...form, tips: e.target.value})} placeholder="What would you suggest to someone preparing for this?" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-16" />
            </div>
            <Button onClick={handleSubmit} disabled={submitting || !form.company || !form.role || !form.questions} className="gradient-purple hover:opacity-90 text-primary-foreground">
              {submitting ? "Sharing..." : "Share Anonymously"}
            </Button>
          </div>
        </div>
      )}

      {/* Experiences List */}
      {experiences.length === 0 ? (
        <div className="glass-card rounded-xl p-12 border border-border text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium mb-1">No experiences yet</p>
          <p className="text-muted-foreground text-sm">Be the first to share your interview experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp: any) => (
            <div key={exp._id} className="glass-card rounded-xl border border-border overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-medium text-foreground">
                      {exp.company.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{exp.company}</h4>
                      <p className="text-sm text-muted-foreground">{exp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[exp.type] || "bg-gray-500/20 text-gray-400"}`}>{exp.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${exp.outcome === "cleared" ? "bg-green-500/20 text-green-400" : exp.outcome === "rejected" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {exp.outcome === "cleared" ? "✅ Cleared" : exp.outcome === "rejected" ? "❌ Rejected" : "⏳ Pending"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={cn("w-3.5 h-3.5", n <= exp.difficulty ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30")} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">Difficulty</span>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Questions Asked</p>
                  <ul className="space-y-1">
                    {exp.questions?.slice(0, expanded === exp._id ? undefined : 3).map((q: string, i: number) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>{q}
                      </li>
                    ))}
                  </ul>
                  {exp.questions?.length > 3 && (
                    <button onClick={() => setExpanded(expanded === exp._id ? null : exp._id)} className="text-xs text-primary mt-2 flex items-center gap-1 hover:opacity-80">
                      {expanded === exp._id ? "Show less" : `+${exp.questions.length - 3} more questions`}
                      <ChevronDown className={cn("w-3 h-3 transition-transform", expanded === exp._id && "rotate-180")} />
                    </button>
                  )}
                </div>

                {exp.stuck && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-red-400 mb-1">Where they got stuck</p>
                    <p className="text-sm text-foreground">{exp.stuck}</p>
                  </div>
                )}

                {exp.tips && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-green-400 mb-1">Tips for you</p>
                    <p className="text-sm text-foreground">{exp.tips}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
