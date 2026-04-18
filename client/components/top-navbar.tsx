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
const NOTIFICATION_STORAGE_PREFIX = "tracktern_read_notifications"

const formatDisplayName = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getTodayKey = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

const getReadStorageKey = () => {
  const user = getUser()
  const userIdentifier = user?._id || user?.id || user?.email || "guest"
  return `${NOTIFICATION_STORAGE_PREFIX}_${userIdentifier}`
}

const getReadNotifications = () => {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(getReadStorageKey())
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : []
  } catch {
    return []
  }
}

const saveReadNotifications = (ids: string[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(getReadStorageKey(), JSON.stringify(ids))
}

const getScopedPracticeValue = (key: string) => {
  if (typeof window === "undefined") return null
  const user = getUser()
  const userIdentifier = user?._id || user?.id || user?.email || "guest"
  return localStorage.getItem(`${key}_${userIdentifier}`) || localStorage.getItem(key)
}

export function TopNavbar() {
  const [user, setUser] = useState<any>(null)
  const [focusMode, setFocusMode] = useState(false)
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; detail: string; href: string; read: boolean }>>([])
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const u = getUser()
    if (u) setUser(u)
    const mode = localStorage.getItem("tracktern_focus_mode")
    if (mode === "true") setFocusMode(true)

    const token = getToken()
    if (!token) return

    const syncNotifications = () => {
      Promise.all([getCompanies(token), getCareerProfile(token)]).then(([companiesData, careerData]) => {
      const nextNotifications: Array<{ id: string; title: string; detail: string; href: string; read: boolean }> = []
      const companies = Array.isArray(companiesData) ? companiesData : []
      const savedPaths = Array.isArray(careerData?.savedPaths) ? careerData.savedPaths : []
      const readIds = new Set(getReadNotifications())
      const todayKey = getTodayKey()

      let practiceHistory: Record<string, boolean> = {}
      let submissionCounts: Record<string, number> = {}

      try {
        practiceHistory = JSON.parse(getScopedPracticeValue("daily_history") || "{}")
        submissionCounts = JSON.parse(getScopedPracticeValue("practice_submission_counts") || "{}")
      } catch {
        practiceHistory = {}
        submissionCounts = {}
      }

      const interviews = companies.filter((company: any) => company.status === "interview").length
      const wishlistCount = companies.filter((company: any) => company.status === "wishlist").length
      const appliedWaiting = companies.filter((company: any) => {
        if (company.status !== "applied" || !company.appliedDate) return false
        const appliedDate = new Date(company.appliedDate)
        const now = new Date()
        const diffDays = Math.ceil((now.getTime() - appliedDate.getTime()) / 86400000)
        return diffDays >= 5
      }).length
      const urgentDeadlines = companies.filter((company: any) => {
        if (!company.deadline) return false
        const deadline = new Date(company.deadline)
        const now = new Date()
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / 86400000)
        return diffDays >= 0 && diffDays <= 7
      }).length
      const hasSolvedToday = practiceHistory[todayKey] === true || (submissionCounts[todayKey] || 0) > 0

      if (urgentDeadlines > 0) {
        nextNotifications.push({
          id: `deadlines-${todayKey}-${urgentDeadlines}`,
          title: "Upcoming deadlines",
          detail: `${urgentDeadlines} application deadline${urgentDeadlines > 1 ? "s" : ""} coming up this week.`,
          href: "/applications",
          read: readIds.has(`deadlines-${todayKey}-${urgentDeadlines}`),
        })
      }

      if (interviews > 0) {
        nextNotifications.push({
          id: `interviews-${todayKey}-${interviews}`,
          title: "Interview pipeline active",
          detail: `${interviews} interview-stage application${interviews > 1 ? "s" : ""} need prep attention.`,
          href: "/calendar",
          read: readIds.has(`interviews-${todayKey}-${interviews}`),
        })
      }

      if (savedPaths.length > 0) {
        nextNotifications.push({
          id: `career-${todayKey}-${savedPaths.length}`,
          title: "Career path insights ready",
          detail: `${savedPaths.length} tracked career path${savedPaths.length > 1 ? "s" : ""} saved in your predictor.`,
          href: "/career-path",
          read: readIds.has(`career-${todayKey}-${savedPaths.length}`),
        })
      }

      if (wishlistCount > 0) {
        nextNotifications.push({
          id: `wishlist-${todayKey}-${wishlistCount}`,
          title: "Wishlist roles waiting",
          detail: `${wishlistCount} wishlist card${wishlistCount > 1 ? "s are" : " is"} ready to convert into applications.`,
          href: "/applications",
          read: readIds.has(`wishlist-${todayKey}-${wishlistCount}`),
        })
      }

      if (appliedWaiting > 0) {
        nextNotifications.push({
          id: `followup-${todayKey}-${appliedWaiting}`,
          title: "Follow-up moment",
          detail: `${appliedWaiting} application${appliedWaiting > 1 ? "s" : ""} may need a follow-up email now.`,
          href: "/follow-up",
          read: readIds.has(`followup-${todayKey}-${appliedWaiting}`),
        })
      }

      if (!hasSolvedToday) {
        nextNotifications.push({
          id: `practice-${todayKey}`,
          title: "Daily practice pending",
          detail: "You have not solved today’s practice question yet. Solve one problem to protect your streak.",
          href: "/practice",
          read: readIds.has(`practice-${todayKey}`),
        })
      }

      if (nextNotifications.length === 0) {
        nextNotifications.push({
          id: `empty-${todayKey}`,
          title: "All caught up",
          detail: "Add applications or generate a career path to start receiving smart reminders.",
          href: "/career-path",
          read: true,
        })
      }

      setNotifications(nextNotifications.slice(0, 4))
    })
    }

    syncNotifications()
    window.addEventListener("storage", syncNotifications)
    return () => window.removeEventListener("storage", syncNotifications)
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
  const unreadCount = notifications.filter((item) => !item.read && !item.id.startsWith("empty-")).length

  const handleNotificationClick = (notification: { id: string; href: string }) => {
    const readIds = new Set(getReadNotifications())
    readIds.add(notification.id)
    saveReadNotifications(Array.from(readIds))
    setNotifications((current) =>
      current.map((item) => (item.id === notification.id ? { ...item, read: true } : item))
    )
    router.push(notification.href)
  }

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
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                    {index === 0 ? <CalendarClock className="h-4 w-4" /> : index === 1 ? <Briefcase className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      {!item.read && !item.id.startsWith("empty-") ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                    </div>
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
