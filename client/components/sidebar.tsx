"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutDashboard, Briefcase, Sparkles, BarChart3, BookOpen, Settings, Rocket, LogOut, Users, Code2, Brain, FileText, Mail, Calendar, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { removeToken } from "@/lib/api"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/applications", icon: Briefcase, label: "Applications" },
  { href: "/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/ai-prep", icon: Sparkles, label: "AI Prep" },
  { href: "/mock-interview", icon: Brain, label: "Mock Interview" },
  { href: "/resume-analyzer", icon: FileText, label: "Resume Analyzer" },
  { href: "/follow-up", icon: Mail, label: "Follow-up Emails" },
  { href: "/calendar", icon: Calendar, label: "Interview Calendar" },
  { href: "/skill-gap", icon: BarChart3, label: "Skill Gap" },
  { href: "/practice", icon: Code2, label: "Daily Practice" },
  { href: "/journal", icon: BookOpen, label: "Interview Journal" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleSignOut = () => {
    removeToken()
    localStorage.removeItem("tracktern_user")
    window.location.href = "/"
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-purple flex items-center justify-center"><Rocket className="w-5 h-5 text-primary-foreground" /></div>
          <span className="text-xl font-bold text-sidebar-foreground">Tracktern</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent")}>
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
