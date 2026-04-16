"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Rocket, LogOut, Layers, Zap } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { getUser, removeToken } from "@/lib/api"

const FOCUS_MODE_ROUTES = ["/dashboard", "/analytics", "/calendar", "/settings"]

export function TopNavbar() {
  const [user, setUser] = useState<any>(null)
  const [focusMode, setFocusMode] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const u = getUser()
    if (u) setUser(u)
    const mode = localStorage.getItem("tracktern_focus_mode")
    if (mode === "true") setFocusMode(true)
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

  const userName = user?.name || "there"
  const userEmail = user?.email || ""
  const streak = Number(user?.streak || 0)

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

          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:bg-[rgba(255,255,255,0.04)] hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>

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
