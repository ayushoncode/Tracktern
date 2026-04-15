"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Flame, Rocket, LogOut, Layers, Zap } from "lucide-react"
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

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Tracktern</span>
        </div>

        {/* Greeting */}
        <div className="hidden lg:flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">
            Hey {userName.split(" ")[0]} <span className="text-2xl">👋</span>
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Focus Mode Toggle */}
          <button
            onClick={toggleFocusMode}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              focusMode
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {focusMode ? (
              <><Zap className="w-3.5 h-3.5" /> Focus Mode</>
            ) : (
              <><Layers className="w-3.5 h-3.5" /> Full Mode</>
            )}
          </button>

          {/* Streak */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground text-sm font-medium">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>0 day streak</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-card-foreground">{userName}</span>
                  <span className="text-xs text-muted-foreground">{userEmail}</span>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="cursor-pointer text-card-foreground hover:bg-secondary">
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
