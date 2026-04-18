"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Calendar, ExternalLink, Send, Sparkles, Star, Trophy } from "lucide-react"
import { AppPageHeader } from "@/components/app-page-header"
import { EmptyState } from "@/components/empty-state"
import { StatCard } from "@/components/stat-card"
import { GmailSync } from "@/components/gmail-sync"
import { StatusPill } from "@/components/status-pill"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getCompanies, getStats, getToken, getUser } from "@/lib/api"
import { STATUS_THEME } from "@/lib/status-theme"

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, wishlist: 0, applied: 0, shortlisted: 0, interview: 0, offer: 0, rejected: 0 })
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("there")

  useEffect(() => {
    const token = getToken()
    if (!token) { window.location.href = "/"; return }
    const user = getUser()
    if (user?.name) {
      setUserName(user.name)
    }
    Promise.all([getStats(token), getCompanies(token)]).then(([s, c]) => {
      setStats(s)
      setCompanies(Array.isArray(c) ? c : [])
      setLoading(false)
    })
  }, [])

  const statCards = [
    { title: "Total Applied", value: stats.total, icon: Send, color: "blue" as const, change: "+applied" },
    { title: "Shortlisted", value: stats.shortlisted, icon: Star, color: "yellow" as const, change: stats.total ? `${Math.round((stats.shortlisted/stats.total)*100)}% conversion` : "0%" },
    { title: "Interviews", value: stats.interview, icon: Calendar, color: "purple" as const, change: "scheduled" },
    { title: "Offers", value: stats.offer, icon: Trophy, color: "green" as const, change: stats.offer > 0 ? "Congrats! 🎉" : "Keep going!" },
  ]

  const funnelData = [
    { key: "applied", name: "Applied", value: stats.total, fill: STATUS_THEME.applied.hex, blurb: "Applications sent" },
    { key: "shortlisted", name: "Shortlisted", value: stats.shortlisted, fill: STATUS_THEME.shortlisted.hex, blurb: "Positive replies" },
    { key: "interview", name: "Interview", value: stats.interview, fill: STATUS_THEME.interview.hex, blurb: "Rounds scheduled" },
    { key: "offer", name: "Offer", value: stats.offer, fill: STATUS_THEME.offer.hex, blurb: "Wins on the table" },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground animate-pulse">Loading your dashboard...</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <AppPageHeader
        title={`Welcome back, ${userName.split(" ")[0]}`}
        subtitle="A cleaner read on your pipeline, momentum, and next opportunities."
        icon={Sparkles}
        actionLabel="Manage applications"
        actionHref="/applications"
        actionVariant="outline"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(17,17,24,0.96))]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Pipeline Overview</h3>
              <p className="text-sm text-muted-foreground">Scan stage performance without decoding a funnel first.</p>
            </div>
            <a href="/analytics" className="inline-flex items-center gap-1 text-sm text-blue-300 hover:text-blue-200 transition-colors">
              Open analytics <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-6 space-y-4">
            {funnelData.map((item, index) => {
              const pct = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0
              return (
                <div key={item.key} className="rounded-2xl border border-white/6 bg-background/30 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </span>
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{item.blurb}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-foreground">{item.value}</p>
                      <p className="text-xs" style={{ color: item.fill }}>{pct}% of applied</p>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/6">
                    <div
                      className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${Math.max(item.value > 0 ? pct : 0, item.value > 0 ? 8 : 0)}%`, backgroundColor: item.fill }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Response rate", value: stats.total ? Math.round(((stats.shortlisted + stats.interview + stats.offer + stats.rejected) / stats.total) * 100) : 0 },
              { label: "Interview rate", value: stats.total ? Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0 },
              { label: "Offer rate", value: stats.total ? Math.round((stats.offer / stats.total) * 100) : 0 },
            ].map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-200/70">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{metric.value}%</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.08),rgba(17,17,24,0.96))]">
          <GmailSync />
        </div>
      </div>

      <div className="glass-card rounded-xl border border-white/8 overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]">
          <div>
            <h3 className="font-semibold text-foreground">Recent Applications</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your latest pipeline updates, with clearer status recognition.</p>
          </div>
          <a href="/applications" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            View All <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {companies.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Send}
              title="Start your application pipeline"
              subtitle="Tracktern gets more useful once you add a few roles. Start with the companies you are actively targeting this week."
              ctaLabel="Add application"
              ctaHref="/applications"
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Company</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Date Applied</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.slice(0, 5).map((app: any) => (
                <TableRow key={app._id} className="border-border hover:bg-secondary/30 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold", STATUS_THEME[app.status as keyof typeof STATUS_THEME]?.softClassName ?? "bg-secondary")}>
                        {app.name.charAt(0)}
                      </div>
                      {app.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{app.role}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(app.appliedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={app.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
