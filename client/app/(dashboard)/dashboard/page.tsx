"use client"

import { Send, Star, Calendar, Trophy, ExternalLink } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { GmailSync } from "@/components/gmail-sync"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, Cell } from "recharts"

const stats = [
  { title: "Total Applied", value: 42, icon: Send, color: "blue" as const, change: "+5 this week" },
  { title: "Shortlisted", value: 12, icon: Star, color: "yellow" as const, change: "28% conversion" },
  { title: "Interviews", value: 6, icon: Calendar, color: "purple" as const, change: "3 upcoming" },
  { title: "Offers", value: 2, icon: Trophy, color: "green" as const, change: "Congrats!" },
]

const funnelData = [
  { name: "Applied", value: 42, fill: "#3B82F6" },
  { name: "Shortlisted", value: 12, fill: "#FBBF24" },
  { name: "Interview", value: 6, fill: "#7C3AED" },
  { name: "Offer", value: 2, fill: "#22C55E" },
]

const recentApplications = [
  { company: "Google", role: "SWE Intern", date: "Apr 5", status: "Shortlisted", statusColor: "bg-yellow-500" },
  { company: "Microsoft", role: "PM Intern", date: "Apr 3", status: "Applied", statusColor: "bg-blue-500" },
  { company: "Stripe", role: "Backend Intern", date: "Apr 2", status: "Interview", statusColor: "bg-primary" },
  { company: "Razorpay", role: "Full Stack", date: "Mar 28", status: "Offer", statusColor: "bg-green-500" },
  { company: "Amazon", role: "SDE Intern", date: "Mar 25", status: "Rejected", statusColor: "bg-red-500" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts & Gmail Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Application Funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A24",
                    border: "1px solid #2E2E3A",
                    borderRadius: "8px",
                    color: "#F8FAFC",
                  }}
                />
                <Funnel
                  data={funnelData}
                  dataKey="value"
                  nameKey="name"
                  isAnimationActive
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
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

        {/* Gmail Sync */}
        <GmailSync />
      </div>

      {/* Recent Applications Table */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Applications</h3>
          <a
            href="/applications"
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            View All
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
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
            {recentApplications.map((app, index) => (
              <TableRow key={index} className="border-border hover:bg-secondary/30">
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-muted-foreground">
                      {app.company.charAt(0)}
                    </div>
                    {app.company}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{app.role}</TableCell>
                <TableCell className="text-muted-foreground">{app.date}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-foreground ${app.statusColor}`}>
                    {app.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
