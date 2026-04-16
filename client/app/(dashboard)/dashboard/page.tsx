"use client"

import { useEffect, useState } from "react"
import { Briefcase, Calendar, Plus, Send, Star, Trophy } from "lucide-react"

import { AppPageHeader } from "@/components/app-page-header"
import { EmptyState } from "@/components/empty-state"
import { GmailSync } from "@/components/gmail-sync"
import { StatCard } from "@/components/stat-card"
import { StatusPill } from "@/components/status-pill"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCompanies, getStats, getToken } from "@/lib/api"

const FUNNEL_STAGES = [
  { key: "applied", label: "Applied", color: "#60A5FA" },
  { key: "shortlisted", label: "Shortlisted", color: "#FBB947" },
  { key: "interview", label: "Interview", color: "#A78BFA" },
  { key: "offer", label: "Offer", color: "#4ADE80" },
] as const

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, applied: 0, shortlisted: 0, interview: 0, offer: 0, rejected: 0 })
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      window.location.href = "/"
      return
    }

    Promise.all([getStats(token), getCompanies(token)]).then(([statsResponse, companiesResponse]) => {
      setStats(statsResponse)
      setCompanies(Array.isArray(companiesResponse) ? companiesResponse : [])
      setLoading(false)
    })
  }, [])

  const statCards = [
    { title: "Total Applied", value: stats.total, icon: Send, color: "blue" as const, change: "All tracked applications" },
    { title: "Shortlisted", value: stats.shortlisted, icon: Star, color: "yellow" as const, change: stats.total ? `${Math.round((stats.shortlisted / stats.total) * 100)}% conversion` : "0% conversion" },
    { title: "Interviews", value: stats.interview, icon: Calendar, color: "purple" as const, change: "Upcoming pipeline" },
    { title: "Offers", value: stats.offer, icon: Trophy, color: "green" as const, change: stats.offer > 0 ? "Momentum is paying off" : "Keep compounding" },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <AppPageHeader
          title="Dashboard"
          subtitle="A clean view of your application pipeline, interviews, and momentum."
          icon={Briefcase}
          actionLabel="Add Application"
          actionHref="/applications"
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[118px] animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Dashboard"
        subtitle="A clean view of your application pipeline, interviews, and momentum."
        icon={Briefcase}
        actionLabel="Add Application"
        actionHref="/applications"
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="section-heading">Application Funnel</CardTitle>
            <CardDescription className="body-copy">
              See exactly where your pipeline tightens so you can focus on the next meaningful bottleneck.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {FUNNEL_STAGES.map((stage) => {
              const rawValue = stage.key === "applied" ? stats.total : stats[stage.key]
              const width = stats.total ? Math.max((rawValue / stats.total) * 100, rawValue > 0 ? 10 : 0) : 0

              return (
                <div key={stage.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <StatusPill status={stage.key} />
                      <span className="text-sm text-foreground">{stage.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{rawValue}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(255,255,255,0.05)]">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${width}%`, backgroundColor: stage.color }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <GmailSync />
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="section-heading">Recent Applications</CardTitle>
              <CardDescription className="body-copy">
                Your five latest application updates, ready to review or continue.
              </CardDescription>
            </div>
            <a href="/applications" className="text-sm text-primary hover:text-[#A78BFA]">
              View all
            </a>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {companies.length === 0 ? (
              <div className="px-6 pb-6">
                <EmptyState
                  icon={Briefcase}
                  title="No applications tracked yet"
                  subtitle="Start adding applications to unlock pipeline insights, funnel progression, and follow-up visibility."
                  ctaLabel="Add Application"
                  ctaHref="/applications"
                />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="px-6 text-xs uppercase tracking-[0.06em] text-muted-foreground">Company</TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.06em] text-muted-foreground">Role</TableHead>
                    <TableHead className="text-xs uppercase tracking-[0.06em] text-muted-foreground">Applied</TableHead>
                    <TableHead className="pr-6 text-xs uppercase tracking-[0.06em] text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.slice(0, 5).map((application: any) => (
                    <TableRow key={application._id} className="border-border hover:bg-[rgba(255,255,255,0.02)]">
                      <TableCell className="px-6 py-4 text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(124,58,237,0.1)] text-sm text-primary">
                            {application.name.charAt(0)}
                          </div>
                          <span className="font-medium">{application.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-muted-foreground">{application.role}</TableCell>
                      <TableCell className="py-4 text-muted-foreground">
                        {new Date(application.appliedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <StatusPill status={application.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
