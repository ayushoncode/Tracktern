"use client"

import { useEffect, useState } from "react"
import { Award, BarChart3, Briefcase, Target, TrendingUp } from "lucide-react"
import { AppPageHeader } from "@/components/app-page-header"
import { EmptyState } from "@/components/empty-state"
import { getToken } from "@/lib/api"
import { cn } from "@/lib/utils"
import { STATUS_THEME } from "@/lib/status-theme"

const API = "https://tracktern-27b8.onrender.com/api"

export default function AnalyticsPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    fetch(`${API}/companies`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        setCompanies(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const total = companies.length
  const byStatus = {
    applied: companies.filter((c) => c.status === "applied").length,
    shortlisted: companies.filter((c) => c.status === "shortlisted").length,
    interview: companies.filter((c) => c.status === "interview").length,
    offer: companies.filter((c) => c.status === "offer").length,
    rejected: companies.filter((c) => c.status === "rejected").length,
  }

  const responseRate = total > 0 ? Math.round(((byStatus.shortlisted + byStatus.interview + byStatus.offer + byStatus.rejected) / total) * 100) : 0
  const interviewRate = total > 0 ? Math.round(((byStatus.interview + byStatus.offer) / total) * 100) : 0
  const offerRate = total > 0 ? Math.round((byStatus.offer / total) * 100) : 0

  const roleMap: Record<string, number> = {}
  companies.forEach((c) => {
    if (c.role) roleMap[c.role] = (roleMap[c.role] || 0) + 1
  })
  const topRoles = Object.entries(roleMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxRole = topRoles[0]?.[1] || 1

  const funnel = [
    { label: "Applied", count: total, color: STATUS_THEME.applied.hex, pct: 100 },
    { label: "Shortlisted", count: byStatus.shortlisted + byStatus.interview + byStatus.offer, color: STATUS_THEME.shortlisted.hex, pct: total > 0 ? Math.round(((byStatus.shortlisted + byStatus.interview + byStatus.offer) / total) * 100) : 0 },
    { label: "Interview", count: byStatus.interview + byStatus.offer, color: STATUS_THEME.interview.hex, pct: total > 0 ? Math.round(((byStatus.interview + byStatus.offer) / total) * 100) : 0 },
    { label: "Offer", count: byStatus.offer, color: STATUS_THEME.offer.hex, pct: total > 0 ? Math.round((byStatus.offer / total) * 100) : 0 },
  ]

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground animate-pulse">Loading analytics...</div></div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AppPageHeader
        title="Analytics"
        subtitle={`Insights from your ${total} applications, now using the same status color mapping as the rest of the dashboard.`}
        icon={BarChart3}
        actionLabel="Open applications"
        actionHref="/applications"
        actionVariant="outline"
      />

      {total === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Analytics kicks in after your first tracked applications"
          subtitle="Add a few roles with statuses so response, interview, and offer rates have something meaningful to compare."
          ctaLabel="Add applications"
          ctaHref="/applications"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Briefcase, label: "Total Applied", value: total, color: "text-blue-300", bg: "bg-blue-500/10 border border-blue-500/20" },
              { icon: TrendingUp, label: "Response Rate", value: `${responseRate}%`, color: "text-amber-300", bg: "bg-amber-500/10 border border-amber-500/20" },
              { icon: Target, label: "Interview Rate", value: `${interviewRate}%`, color: "text-violet-300", bg: "bg-violet-500/10 border border-violet-500/20" },
              { icon: Award, label: "Offer Rate", value: `${offerRate}%`, color: "text-green-300", bg: "bg-green-500/10 border border-green-500/20" },
            ].map((metric) => (
              <div key={metric.label} className="glass-card rounded-2xl border border-border p-5">
                <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded-xl", metric.bg)}>
                  <metric.icon className={cn("h-4 w-4", metric.color)} />
                </div>
                <div className={cn("text-2xl font-black", metric.color)}>{metric.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl border border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(17,17,24,0.96))] p-6">
            <h3 className="mb-5 font-bold text-foreground">Application Funnel</h3>
            <div className="space-y-3">
              {funnel.map((stage) => (
                <div key={stage.label} className="flex items-center gap-4">
                  <div className="w-24 shrink-0 text-right text-sm font-medium text-foreground">{stage.label}</div>
                  <div className="h-8 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="flex h-full items-center rounded-full px-3" style={{ width: `${Math.max(stage.pct, 5)}%`, background: stage.color }}>
                      <span className="text-xs font-bold text-white">{stage.count}</span>
                    </div>
                  </div>
                  <div className="w-12 shrink-0 text-sm font-bold" style={{ color: stage.color }}>{stage.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-card rounded-2xl border border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.07),rgba(17,17,24,0.96))] p-6">
              <h3 className="mb-4 font-bold text-foreground">Status Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: "Applied", count: byStatus.applied, color: STATUS_THEME.applied.hex },
                  { label: "Shortlisted", count: byStatus.shortlisted, color: STATUS_THEME.shortlisted.hex },
                  { label: "Interview", count: byStatus.interview, color: STATUS_THEME.interview.hex },
                  { label: "Offer", count: byStatus.offer, color: STATUS_THEME.offer.hex },
                  { label: "Rejected", count: byStatus.rejected, color: STATUS_THEME.rejected.hex },
                ].map((status) => (
                  <div key={status.label} className="flex items-center gap-3">
                    <div className="w-20 shrink-0 text-right text-xs text-muted-foreground">{status.label}</div>
                    <div className="h-5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="flex h-full items-center rounded-full px-2"
                        style={{ width: `${total > 0 ? Math.max((status.count / total) * 100, status.count > 0 ? 5 : 0) : 0}%`, background: status.color }}
                      >
                        {status.count > 0 && <span className="text-xs font-bold text-white">{status.count}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-white/8 p-6">
              <h3 className="mb-4 font-bold text-foreground">Top Roles Applied</h3>
              {topRoles.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {topRoles.map(([role, count], index) => (
                    <div key={role} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-black text-primary">{index + 1}</div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="truncate text-sm text-foreground">{role}</span>
                          <span className="ml-2 text-xs font-bold text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(count / maxRole) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
