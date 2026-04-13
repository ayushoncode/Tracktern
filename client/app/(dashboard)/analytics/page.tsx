"use client"
import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Target, Award, Briefcase } from "lucide-react"
import { getToken } from "@/lib/api"
import { cn } from "@/lib/utils"

const API = "https://tracktern-27b8.onrender.com/api"

export default function AnalyticsPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string|null>(null)

  useEffect(() => {
    const t = getToken()
    setToken(t)
    if (!t) return
    fetch(`${API}/companies`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => { setCompanies(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const total = companies.length
  const byStatus = {
    applied: companies.filter(c => c.status === "applied").length,
    shortlisted: companies.filter(c => c.status === "shortlisted").length,
    interview: companies.filter(c => c.status === "interview").length,
    offer: companies.filter(c => c.status === "offer").length,
    rejected: companies.filter(c => c.status === "rejected").length,
  }
  const responseRate = total > 0 ? Math.round(((byStatus.shortlisted + byStatus.interview + byStatus.offer + byStatus.rejected) / total) * 100) : 0
  const interviewRate = total > 0 ? Math.round(((byStatus.interview + byStatus.offer) / total) * 100) : 0
  const offerRate = total > 0 ? Math.round((byStatus.offer / total) * 100) : 0

  const roleMap: Record<string, number> = {}
  companies.forEach(c => { if (c.role) roleMap[c.role] = (roleMap[c.role] || 0) + 1 })
  const topRoles = Object.entries(roleMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxRole = topRoles[0]?.[1] || 1

  const funnel = [
    { label: "Applied", count: total, color: "#7c3aed", pct: 100 },
    { label: "Shortlisted", count: byStatus.shortlisted + byStatus.interview + byStatus.offer, color: "#0ea5e9", pct: total > 0 ? Math.round(((byStatus.shortlisted + byStatus.interview + byStatus.offer) / total) * 100) : 0 },
    { label: "Interview", count: byStatus.interview + byStatus.offer, color: "#f59e0b", pct: total > 0 ? Math.round(((byStatus.interview + byStatus.offer) / total) * 100) : 0 },
    { label: "Offer", count: byStatus.offer, color: "#10b981", pct: total > 0 ? Math.round((byStatus.offer / total) * 100) : 0 },
  ]

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground animate-pulse">Loading analytics...</div></div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div><h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" /> Analytics</h2><p className="text-muted-foreground mt-1">Insights from your {total} applications</p></div>
      {total === 0 ? <div className="glass-card rounded-2xl border border-border p-12 text-center"><BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-foreground font-medium">No applications yet</p></div> : <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Briefcase, label: "Total Applied", value: total, color: "text-primary", bg: "bg-primary/10" },
            { icon: TrendingUp, label: "Response Rate", value: `${responseRate}%`, color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: Target, label: "Interview Rate", value: `${interviewRate}%`, color: "text-yellow-400", bg: "bg-yellow-500/10" },
            { icon: Award, label: "Offer Rate", value: `${offerRate}%`, color: "text-green-400", bg: "bg-green-500/10" },
          ].map((m, i) => (
            <div key={i} className="glass-card rounded-2xl border border-border p-5">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", m.bg)}><m.icon className={cn("w-4 h-4", m.color)} /></div>
              <div className={cn("text-2xl font-black", m.color)}>{m.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-2xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-5">Application Funnel</h3>
          <div className="space-y-3">{funnel.map((stage, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-24 text-right text-sm font-medium text-foreground shrink-0">{stage.label}</div>
              <div className="flex-1 bg-secondary rounded-full h-8 overflow-hidden">
                <div className="h-full rounded-full flex items-center px-3" style={{width:`${Math.max(stage.pct,5)}%`, background:stage.color}}>
                  <span className="text-xs font-bold text-white">{stage.count}</span>
                </div>
              </div>
              <div className="w-12 text-sm font-bold shrink-0" style={{color:stage.color}}>{stage.pct}%</div>
            </div>
          ))}</div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-4">Status Breakdown</h3>
            <div className="space-y-3">{[
              { label: "Applied", count: byStatus.applied, color: "#7c3aed" },
              { label: "Shortlisted", count: byStatus.shortlisted, color: "#0ea5e9" },
              { label: "Interview", count: byStatus.interview, color: "#f59e0b" },
              { label: "Offer", count: byStatus.offer, color: "#10b981" },
              { label: "Rejected", count: byStatus.rejected, color: "#ef4444" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-20 text-xs text-muted-foreground text-right shrink-0">{s.label}</div>
                <div className="flex-1 bg-secondary rounded-full h-5 overflow-hidden">
                  <div className="h-full rounded-full flex items-center px-2" style={{width:`${total > 0 ? Math.max((s.count/total)*100, s.count > 0 ? 5 : 0) : 0}%`, background:s.color}}>
                    {s.count > 0 && <span className="text-xs font-bold text-white">{s.count}</span>}
                  </div>
                </div>
              </div>
            ))}</div>
          </div>
          <div className="glass-card rounded-2xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-4">Top Roles Applied</h3>
            {topRoles.length === 0 ? <p className="text-sm text-muted-foreground">No data yet</p> : <div className="space-y-3">{topRoles.map(([role, count], i) => (
              <div key={role} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary shrink-0">{i+1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1"><span className="text-sm text-foreground truncate">{role}</span><span className="text-xs font-bold text-muted-foreground ml-2">{count}</span></div>
                  <div className="h-1.5 bg-secondary rounded-full"><div className="h-1.5 bg-primary rounded-full" style={{width:`${(count/maxRole)*100}%`}} /></div>
                </div>
              </div>
            ))}</div>}
          </div>
        </div>
      </>}
    </div>
  )
}
