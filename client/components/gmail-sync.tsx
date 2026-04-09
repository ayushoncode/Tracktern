"use client"

import { Mail, CheckCircle } from "lucide-react"

const recentDetections = [
  { status: "rejected", company: "Google", time: "1hr ago", color: "bg-red-500" },
  { status: "offer", company: "Razorpay", time: "today", color: "bg-green-500" },
  { status: "interview", company: "Swiggy", time: "2hrs ago", color: "bg-yellow-500" },
]

export function GmailSync() {
  return (
    <div className="glass-card rounded-xl p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Gmail Sync</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Connected
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-4">Last synced: 2 mins ago</p>

      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Recently Detected
        </p>
        {recentDetections.map((item, index) => (
          <div key={index} className="flex items-center gap-3 py-2">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <div className="flex-1">
              <span className="text-sm text-foreground capitalize">{item.status}</span>
              <span className="text-muted-foreground"> — {item.company}</span>
            </div>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
