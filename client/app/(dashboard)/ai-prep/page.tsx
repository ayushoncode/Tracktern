"use client"

import { useState, useEffect } from "react"
import { Sparkles, Mail, Clock, CheckCircle, Copy, Check } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getCompanies, getAIPrep, getFollowUpEmail, getToken } from "@/lib/api"

export default function AIPrepPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [prepData, setPrepData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) { window.location.href = "/"; return }
    getCompanies(token).then((data) => {
      const list = Array.isArray(data) ? data : []
      setCompanies(list)
      if (list.length > 0) loadPrep(list[0], token)
    })
  }, [])

  const loadPrep = async (company: any, token?: string) => {
    const t = token || getToken()!
    setSelected(company)
    setPrepData(null)
    setEmail("")
    setLoading(true)
    const data = await getAIPrep(t, company.name, company.role)
    setPrepData(data)
    setLoading(false)
  }

  const handleFollowUp = async () => {
    if (!selected) return
    setEmailLoading(true)
    const data = await getFollowUpEmail(getToken()!, selected.name, selected.role)
    setEmail(data.email)
    setEmailLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      <div className="lg:w-72 flex-shrink-0">
        <div className="glass-card rounded-xl border border-border h-full overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Your Companies
            </h3>
          </div>
          <div className="p-2 space-y-1 overflow-y-auto">
            {companies.length === 0 && (
              <div className="p-3">
                <EmptyState
                  icon={Sparkles}
                  title="No prep targets yet"
                  subtitle="Add a company in Applications and this workspace will generate interview questions, revision topics, and follow-up drafts."
                  ctaLabel="Add application"
                  ctaHref="/applications"
                />
              </div>
            )}
            {companies.map((company) => (
              <button key={company._id} onClick={() => loadPrep(company)}
                className={cn("w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                  selected?._id === company._id ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
                )}>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                  selected?._id === company._id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}>
                  {company.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{company.name}</p>
                  <p className={cn("text-sm truncate", selected?._id === company._id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {company.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {selected && (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI Prep for {selected.name}</h2>
              <p className="text-muted-foreground">{selected.role}</p>
            </div>
            <Button onClick={handleFollowUp} disabled={emailLoading} className="gradient-purple hover:opacity-90 text-primary-foreground">
              <Mail className="w-4 h-4 mr-2" />
              {emailLoading ? "Generating..." : "Generate Follow-up Email"}
            </Button>
          </div>
        )}

        {email && (
          <div className="glass-card rounded-xl p-5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Follow-up Email Draft</h3>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="text-muted-foreground">
                {copied ? <><Check className="w-4 h-4 mr-1 text-green-400" />Copied!</> : <><Copy className="w-4 h-4 mr-1" />Copy</>}
              </Button>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap bg-secondary/30 rounded-lg p-4">{email}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card rounded-xl p-5 border border-border space-y-3">
                <Skeleton className="h-6 w-48 bg-secondary" />
                {[...Array(4)].map((_, j) => <Skeleton key={j} className="h-4 w-full bg-secondary" />)}
              </div>
            ))}
            <p className="text-center text-muted-foreground text-sm animate-pulse">✨ AI is generating your prep plan...</p>
          </div>
        ) : prepData ? (
          <>
            <div className="glass-card rounded-xl p-5 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Top 10 Interview Questions</h3>
              <div className="space-y-3">
                {prepData.questions?.map((q: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">{i+1}</span>
                    <p className="text-foreground text-sm">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Skills to Revise</h3>
              <div className="flex flex-wrap gap-2">
                {prepData.skills?.map((skill: any) => (
                  <span key={skill.name} className={cn("px-3 py-1.5 rounded-full text-sm font-medium",
                    skill.priority === "high" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                    skill.priority === "medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                    "bg-green-500/20 text-green-400 border border-green-500/30"
                  )}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" /> 3-Day Prep Plan
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />
                <div className="space-y-6">
                  {prepData.prepPlan?.map((day: any) => (
                    <div key={day.day} className="relative flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium z-10">{day.day}</div>
                      <div className="flex-1 pb-2">
                        <h4 className="font-medium text-foreground">{day.title}</h4>
                        <ul className="mt-2 space-y-1">
                          {day.tasks?.map((task: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-accent" />{task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Pick a company to start prep"
            subtitle="Choose a tracked application to generate a focused interview plan and a follow-up email draft."
            ctaLabel="Manage applications"
            ctaHref="/applications"
          />
        )}
      </div>
    </div>
  )
}
