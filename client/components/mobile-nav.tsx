"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  BookOpen,
  Menu,
  X,
  Brain,
  Compass,
  FileText,
  Mail,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

const primaryNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/more", icon: Menu, label: "More" },
]

const moreNav = [
  { href: "/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/mock-interview", icon: Brain, label: "Mock" },
  { href: "/career-path", icon: Compass, label: "Career" },
  { href: "/resume-analyzer", icon: FileText, label: "Resume" },
  { href: "/follow-up", icon: Mail, label: "Follow-up" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/skill-gap", icon: BarChart3, label: "Skill Gap" },
  { href: "/journal", icon: BookOpen, label: "Journal" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

const FOCUS_MODE_ROUTES = ["/dashboard", "/analytics", "/calendar", "/settings"]

export function MobileNav() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)
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

  const visiblePrimaryNav = focusMode
    ? primaryNav.filter((item) => item.href !== "/more")
    : primaryNav

  const visibleMoreNav = focusMode
    ? moreNav.filter((item) => FOCUS_MODE_ROUTES.includes(item.href))
    : moreNav

  return (
    <>
      {/* More Drawer */}
      {showMore && !focusMode && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute bottom-16 left-0 right-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-foreground">More Pages</span>
              <button onClick={() => setShowMore(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {visibleMoreNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl p-3 transition-colors",
                      isActive
                        ? "border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.08)] text-[#A78BFA]"
                        : "bg-[rgba(255,255,255,0.03)] text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden">
        <div className="flex items-center justify-around py-2">
          {visiblePrimaryNav.map((item) => {
            if (item.href === "/more") {
              const isMoreActive = visibleMoreNav.some(i => i.href === pathname)
              return (
                <button
                  key="more"
                  onClick={() => setShowMore(!showMore)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                    isMoreActive || showMore ? "text-[#A78BFA]" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Menu className="w-5 h-5" />
                  <span className="text-xs font-medium">More</span>
                </button>
              )
            }
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                  isActive ? "text-[#A78BFA]" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
