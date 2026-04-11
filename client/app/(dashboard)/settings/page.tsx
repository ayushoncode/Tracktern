"use client"

import { useState, useEffect } from "react"
import { User, Mail, Bell, Shield, LogOut, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getUser, removeToken } from "@/lib/api"
import Link from "next/link"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const user = getUser()
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [])

  const handleSignOut = () => {
    removeToken()
    localStorage.removeItem("tracktern_user")
    window.location.href = "/"
  }

  const initials = name
    ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Mail },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="glass-card rounded-xl border border-border p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            <div className="border-t border-border my-2" />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="glass-card rounded-xl border border-border p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Profile Settings</h3>

              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-primary/30">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="bg-secondary border-border text-foreground hover:bg-secondary/80">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 2MB.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <Button className="gradient-purple hover:opacity-90 text-primary-foreground">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="glass-card rounded-xl border border-border p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Email updates on application status", enabled: true },
                  { label: "Interview reminders", enabled: true },
                  { label: "Weekly summary", enabled: false },
                  { label: "AI prep suggestions", enabled: true },
                  { label: "Skill gap alerts", enabled: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <span className="text-foreground">{item.label}</span>
                    <button className={cn("w-10 h-6 rounded-full transition-colors relative", item.enabled ? "bg-primary" : "bg-muted")}>
                      <div className={cn("w-4 h-4 rounded-full bg-foreground absolute top-1 transition-all", item.enabled ? "right-1" : "left-1")} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="glass-card rounded-xl border border-border p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Integrations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Gmail</p>
                      <p className="text-sm text-muted-foreground">Auto-detect application updates</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" /> Connected
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">Import job applications</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-secondary border-border text-foreground hover:bg-secondary/80">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="glass-card rounded-xl border border-border p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Current Password</label>
                  <Input type="password" placeholder="Enter current password" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">New Password</label>
                  <Input type="password" placeholder="Enter new password" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm New Password</label>
                  <Input type="password" placeholder="Confirm new password" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
                </div>
                <Button className="gradient-purple hover:opacity-90 text-primary-foreground">
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
