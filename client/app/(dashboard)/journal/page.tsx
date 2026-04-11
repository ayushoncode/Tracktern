"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, Building2, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getJournalEntries, addJournalEntry, deleteJournalEntry, getToken } from "@/lib/api"

const typeColors: Record<string, string> = {
  phone: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  technical: "bg-primary/20 text-primary border-primary/30",
  behavioral: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  onsite: "bg-green-500/20 text-green-400 border-green-500/30",
}

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newEntry, setNewEntry] = useState({ company: "", type: "technical", notes: "", questions: "" })

  useEffect(() => {
    const token = getToken()
    if (!token) { window.location.href = "/"; return }
    getJournalEntries(token).then((data) => {
      setEntries(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  const handleAdd = async () => {
    if (!newEntry.company || !newEntry.notes) return
    setSubmitting(true)
    const token = getToken()!
    const data = await addJournalEntry(token, {
      company: newEntry.company,
      type: newEntry.type,
      notes: newEntry.notes,
      questions: newEntry.questions.split("\n").filter((q) => q.trim()),
    })
    setEntries([data, ...entries])
    setNewEntry({ company: "", type: "technical", notes: "", questions: "" })
    setIsAdding(false)
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    const token = getToken()!
    await deleteJournalEntry(token, id)
    setEntries(entries.filter((e) => e._id !== id))
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground animate-pulse">Loading journal...</div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Interview Journal</h2>
          <p className="text-muted-foreground">Document your interview experiences and learnings</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gradient-purple hover:opacity-90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> New Entry
        </Button>
      </div>

      {isAdding && (
        <div className="glass-card rounded-xl p-5 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">New Interview Entry</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                <Input value={newEntry.company} onChange={(e) => setNewEntry({ ...newEntry, company: e.target.value })} placeholder="e.g., Google" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Interview Type</label>
                <select value={newEntry.type} onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })} className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground">
                  <option value="phone">Phone Screen</option>
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Notes</label>
              <Textarea value={newEntry.notes} onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })} placeholder="How did the interview go?" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-24" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Questions Asked (one per line)</label>
              <Textarea value={newEntry.questions} onChange={(e) => setNewEntry({ ...newEntry, questions: e.target.value })} placeholder="What questions were you asked?" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-20" />
            </div>
            <Button onClick={handleAdd} disabled={submitting || !newEntry.company || !newEntry.notes} className="gradient-purple hover:opacity-90 text-primary-foreground">
              {submitting ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {entries.length === 0 && (
          <div className="glass-card rounded-xl p-8 border border-border text-center text-muted-foreground">
            No journal entries yet. Add your first interview experience!
          </div>
        )}
        {entries.map((entry) => (
          <div key={entry._id} className="glass-card rounded-xl p-5 border border-border hover:border-primary/30 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{entry.company}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${typeColors[entry.type]}`}>
                  {entry.type}
                </span>
                <button onClick={() => handleDelete(entry._id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{entry.notes}</p>
            {entry.questions?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Questions Asked</p>
                <ul className="space-y-1">
                  {entry.questions.map((q: string, i: number) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>{q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
