"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard, Briefcase, Sparkles, BarChart3,
  BookOpen, Settings, Rocket, LogOut, Users, Code2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { removeToken } from "@/lib/api"

const fullNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/applications", icon: Briefcase, label: "Applications" },
  { href: "/ai-prep", icon: Sparkles, label: "AI Prep" },
  { href: "/skill-gap", icon: BarChart3, label: "Skill Gap" },
  { href: "/practice", icon: Code2, label: "Daily Practice" },
  { href: "/journal", icon: BookOpen, label: "Interview Journal" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

const focusNavItems = [
  { href: "/applications", icon: Briefcase, label: "Applications" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [focusMode, setFocusMode] = useState(false)

  useEffect(() => {
    const mode = localStorage.getItem("tracktern_focus_mode")
    setFocusMode(mode === "true")

    const handler = (e: any) => setFocusMode(e.detail)
    window.addEventListener("focusModeChange", handler)
    return () => window.removeEventListener("focusModeChange", handler)
  }, [])

  const handleSignOut = () => {
    removeToken()
    localStorage.removeItem("tracktern_user")
    window.location.href = "/"
  }

  const navItems = focusMode ? focusNavItems : fullNavItems

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link href={focusMode ? "/applications" : "/dashboard"} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-purple flex items-center justify-center">
            <Rocket className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">Tracktern</span>
        </Link>
      </div>

      {/* Focus mode banner */}
      {focusMode && (
        <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-primary font-medium">🎯 Focus Mode</p>
          <p className="text-xs text-muted-foreground">Showing internship tracking only</p>
        </div>
      )}

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link href={item.href} className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}>
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
