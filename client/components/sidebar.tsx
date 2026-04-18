"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutDashboard, Briefcase, Sparkles, BarChart3, BookOpen, Settings, Rocket, LogOut, Users, Code2, Brain, FileText, Mail, Calendar, TrendingUp, Compass } from "lucide-react"
import { cn } from "@/lib/utils"
import { removeToken } from "@/lib/api"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/applications", icon: Briefcase, label: "Applications" },
  { href: "/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/ai-prep", icon: Sparkles, label: "AI Prep" },
  { href: "/career-path", icon: Compass, label: "Career Path" },
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

const FOCUS_MODE_ROUTES = ["/dashboard", "/career-path", "/analytics", "/calendar", "/settings"]

export function Sidebar() {
  const pathname = usePathname()
  const [focusMode, setFocusMode] = useState(false)

  useEffect(() => {
    const syncFocusMode = () => {
      setFocusMode(localStorage.getItem("tracktern_focus_mode") === "true")
    }

    syncFocusMode()
    window.addEventListener("focusModeChange", syncFocusMode as EventListener)
    window.addEventListener("storage", syncFocusMode)

    return () => {
      window.removeEventListener("focusModeChange", syncFocusMode as EventListener)
      window.removeEventListener("storage", syncFocusMode)
    }
  }, [])

  const visibleNavItems = focusMode
    ? navItems.filter((item) => FOCUS_MODE_ROUTES.includes(item.href))
    : navItems

  const handleSignOut = () => {
    removeToken()
    localStorage.removeItem("tracktern_user")
    window.location.href = "/"
  }

  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-5 pb-4 pt-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground">Tracktern</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                    isActive
                      ? "border-l-2 border-primary bg-sidebar-primary pl-[10px] text-sidebar-primary-foreground"
                      : "text-[#71717A] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleSignOut}
          className="flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm text-[#71717A] transition-colors hover:bg-[rgba(239,68,68,0.08)] hover:text-[#EF4444]"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
