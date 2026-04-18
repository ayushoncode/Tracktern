"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Rocket, LogOut, Layers, Zap, CalendarClock, Briefcase, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { getCareerProfile, getCompanies, getToken, getUser, removeToken } from "@/lib/api"

const FOCUS_MODE_ROUTES = ["/dashboard", "/analytics", "/calendar", "/settings"]
const formatDisplayName = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function TopNavbar() {
  const [user, setUser] = useState<any>(null)
  const [focusMode, setFocusMode] = useState(false)
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; detail: string; href: string }>>([])
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const u = getUser()
    if (u) setUser(u)
    const mode = localStorage.getItem("tracktern_focus_mode")
    if (mode === "true") setFocusMode(true)

    const token = getToken()
    if (!token) return

    Promise.all([getCompanies(token), getCareerProfile(token)]).then(([companiesData, careerData]) => {
      const nextNotifications: Array<{ id: string; title: string; detail: string; href: string }> = []
      const companies = Array.isArray(companiesData) ? companiesData : []
      const savedPaths = Array.isArray(careerData?.savedPaths) ? careerData.savedPaths : []

      const interviews = companies.filter((company: any) => company.status === "interview").length
      const wishlistCount = companies.filter((company: any) => company.status === "wishlist").length
      const urgentDeadlines = companies.filter((company: any) => {
        if (!company.deadline) return false
        const deadline = new Date(company.deadline)
        const now = new Date()
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / 86400000)
        return diffDays >= 0 && diffDays <= 7
      }).length

      if (urgentDeadlines > 0) {
        nextNotifications.push({
          id: "deadlines",
          title: "Upcoming deadlines",
          detail: `${urgentDeadlines} application deadline${urgentDeadlines > 1 ? "s" : ""} coming up this week.`,
          href: "/applications",
        })
      }

      if (interviews > 0) {
        nextNotifications.push({
          id: "interviews",
          title: "Interview pipeline active",
          detail: `${interviews} interview-stage application${interviews > 1 ? "s" : ""} need prep attention.`,
          href: "/calendar",
        })
      }

      if (savedPaths.length > 0) {
        nextNotifications.push({
          id: "career",
          title: "Career path insights ready",
          detail: `${savedPaths.length} tracked career path${savedPaths.length > 1 ? "s" : ""} saved in your predictor.`,
          href: "/career-path",
        })
      }

      if (wishlistCount > 0) {
        nextNotifications.push({
          id: "wishlist",
          title: "Wishlist roles waiting",
          detail: `${wishlistCount} wishlist card${wishlistCount > 1 ? "s are" : " is"} ready to convert into applications.`,
          href: "/applications",
        })
      }

      if (nextNotifications.length === 0) {
        nextNotifications.push({
          id: "empty",
          title: "All caught up",
          detail: "Add applications or generate a career path to start receiving smart reminders.",
          href: "/career-path",
        })
      }

      setNotifications(nextNotifications.slice(0, 4))
    })
  }, [])

  useEffect(() => {
    if (focusMode && pathname && !FOCUS_MODE_ROUTES.includes(pathname)) {
      router.replace("/dashboard")
    }
  }, [focusMode, pathname, router])

  const toggleFocusMode = () => {
    const newMode = !focusMode
    setFocusMode(newMode)
    localStorage.setItem("tracktern_focus_mode", String(newMode))
    window.dispatchEvent(new CustomEvent("focusModeChange", { detail: newMode }))
    if (newMode && pathname && !FOCUS_MODE_ROUTES.includes(pathname)) {
      router.replace("/dashboard")
    }
  }

  const handleSignOut = () => {
    removeToken()
    localStorage.removeItem("tracktern_user")
    window.location.href = "/"
  }

  const userName = formatDisplayName(user?.name || "there")
  const userEmail = user?.email || ""
  const streak = Number(user?.streak || 0)
  const unreadCount = notifications.filter((item) => item.id !== "empty").length

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-5 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-foreground">Tracktern</span>
        </div>
        <div className="hidden lg:flex min-w-0 flex-col">
          <span className="label-caption">Workspace</span>
          <span className="mt-1 text-sm text-foreground">Welcome back, {userName.split(" ")[0]}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleFocusMode}
            className={`hidden sm:flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
              focusMode
                ? "border-primary bg-primary text-primary-foreground"
                : "border-[rgba(255,255,255,0.14)] bg-transparent text-foreground hover:bg-[rgba(255,255,255,0.06)]"
            }`}
          >
            {focusMode ? (
              <><Zap className="w-3.5 h-3.5" /> Focus Mode</>
            ) : (
              <><Layers className="w-3.5 h-3.5" /> Full Mode</>
            )}
          </button>

          {streak > 0 ? (
            <div className="hidden md:flex h-9 items-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-card px-3 text-sm text-foreground">
              {streak} day streak
            </div>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:bg-[rgba(255,255,255,0.04)] hover:text-foreground">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 ? (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {unreadCount}
                  </span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 border-border bg-card p-2">
              <DropdownMenuLabel className="px-2 py-2 text-card-foreground">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {notifications.map((item, index) => (
                <DropdownMenuItem
                  key={item.id}
                  className="cursor-pointer items-start gap-3 rounded-lg px-3 py-3 text-card-foreground hover:bg-[rgba(255,255,255,0.04)]"
                  onClick={() => router.push(item.href)}
                >
                  <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                    {index === 0 ? <CalendarClock className="h-4 w-4" /> : index === 1 ? <Briefcase className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-[rgba(255,255,255,0.08)]">
                  <AvatarFallback className="bg-[rgba(124,58,237,0.12)] text-primary text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-border bg-card">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[rgba(124,58,237,0.12)] text-primary text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-card-foreground">{userName}</span>
                  <span className="text-xs text-muted-foreground">{userEmail}</span>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="cursor-pointer text-card-foreground hover:bg-[rgba(255,255,255,0.04)]">
                <Link href="/settings" className="w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-red-500/10" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
