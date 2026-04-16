"use client"

import { useEffect, useState } from "react"
import { Send, Star, Calendar, Trophy, ExternalLink } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { GmailSync } from "@/components/gmail-sync"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { getStats, getCompanies, getToken } from "@/lib/api"

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-blue-500",
  shortlisted: "bg-yellow-500",
  interview: "bg-purple-500",
  offer: "bg-green-500",
  rejected: "bg-red-500",
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, applied: 0, shortlisted: 0, interview: 0, offer: 0, rejected: 0 })
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { window.location.href = "/"; return }
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
    { name: "Applied", value: stats.total || 1, fill: "#3B82F6" },
    { name: "Shortlisted", value: stats.shortlisted || 0, fill: "#FBBF24" },
    { name: "Interview", value: stats.interview || 0, fill: "#7C3AED" },
    { name: "Offer", value: stats.offer || 0, fill: "#22C55E" },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground animate-pulse">Loading your dashboard...</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Application Funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid #2E2E3A", borderRadius: "8px", color: "#F8FAFC" }} />
                <Funnel data={funnelData} dataKey="value" nameKey="name" isAnimationActive>
                  {funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {funnelData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.fill }} />
                <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <GmailSync />
      </div>

      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Applications</h3>
          <a href="/applications" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            View All <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {companies.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No applications yet. <a href="/applications" className="text-primary underline">Add your first one!</a>
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
                <TableRow key={app._id} className="border-border hover:bg-secondary/30">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-muted-foreground">
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
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${STATUS_COLORS[app.status] || "bg-gray-500"}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
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
