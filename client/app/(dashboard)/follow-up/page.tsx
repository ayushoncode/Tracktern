"use client"

import { useEffect, useMemo, useState } from "react"
import { Mail, Sparkles, Copy, Check, RefreshCw, Building2, CalendarClock, UserRound, FileText } from "lucide-react"
import { getToken } from "@/lib/api"
import { cn } from "@/lib/utils"

const API = "https://tracktern-27b8.onrender.com/api"

const TONES = ["Professional", "Friendly", "Confident"]
const DAY_PRESETS = [3, 5, 7, 10, 14]

export default function FollowUpPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [days, setDays] = useState(7)
  const [tone, setTone] = useState("Professional")
  const [recruiterName, setRecruiterName] = useState("")
  const [extraContext, setExtraContext] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<"" | "all" | "body" | "subject">("")
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const t = getToken()
    setToken(t)
    if (!t) return

    fetch(`${API}/companies`, { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((d) => setCompanies(Array.isArray(d) ? d : []))
      .catch(() => setError("Could not load your applications right now."))
  }, [])

  const selectedSummary = useMemo(() => {
    if (!selected) return null
    return {
      company: selected.name || "Unknown company",
      role: selected.role || "Unknown role",
      status: selected.status || "Applied",
      source: selected.source || selected.platform || "",
    }
  }, [selected])

  const generate = async () => {
    if (!selectedSummary || !token) return

    setLoading(true)
    setError("")
    setEmail("")
    setSubject("")

    try {
      const res = await fetch(`${API}/ai/followup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: selectedSummary.company,
          role: selectedSummary.role,
          status: selectedSummary.status,
          applicationSource: selectedSummary.source,
          days,
          tone,
          recruiterName,
          extraContext,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.message || "Could not generate the follow-up email.")
        return
      }

      setEmail(typeof data?.email === "string" ? data.email : "")
      setSubject(
        typeof data?.subject === "string" && data.subject.trim()
          ? data.subject
          : `Follow-up on ${selectedSummary.role} application at ${selectedSummary.company}`
      )
    } catch {
      setError("Network error while generating the follow-up email.")
    } finally {
      setLoading(false)
    }
  }

  const copy = async (text: string, type: "all" | "body" | "subject") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch {
      setError("Clipboard access failed.")
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="glass-card rounded-[28px] border border-border p-5 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Mail className="h-3.5 w-3.5" />
              Follow-up Emails
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Write a sharper follow-up in minutes
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              Pick an application, set the tone and timing, add any context you want mentioned, and generate a clean follow-up email with a ready-to-use subject line.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <MetricCard label="Applications" value={String(companies.length)} />
            <MetricCard label="Default Wait" value={`${days}d`} />
            <MetricCard label="Tone" value={tone} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="glass-card rounded-[28px] border border-border p-5 sm:p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Email Setup</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the application first, then add as much context as you want the email to reflect.
            </p>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-foreground">Select Application</label>
            <div className="grid gap-2 max-h-72 overflow-y-auto">
              {companies.length === 0 ? (
                <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                  No applications found yet.
                </div>
              ) : (
                companies.map((c: any) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => setSelected(c)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                      selected?._id === c._id
                        ? "border-primary bg-primary/10 shadow-[0_0_0_1px_rgba(124,58,237,0.12)]"
                        : "border-border bg-secondary/40 hover:border-primary/30"
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-sm font-black text-primary">
                      {c.name?.charAt(0) || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {c.role} · {c.status || "Applied"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Days since application or update">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {DAY_PRESETS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDays(value)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        days === value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-muted-foreground"
                      )}
                    >
                      {value} days
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Current value: {days} days</p>
              </div>
            </Field>

            <Field label="Tone">
              <div className="grid gap-2">
                {TONES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTone(item)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-sm font-medium transition-all",
                      tone === item
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary text-muted-foreground"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Recruiter name">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  placeholder="e.g. Priya, Alex"
                  className="h-11 w-full rounded-xl border border-border bg-secondary pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </Field>

            <Field label="Application context">
              <div className="rounded-xl border border-border bg-secondary px-3 py-3 text-sm text-muted-foreground">
                {selectedSummary ? (
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">{selectedSummary.company}</p>
                    <p>{selectedSummary.role}</p>
                    <p>Status: {selectedSummary.status}</p>
                    <p>Source: {selectedSummary.source || "Not provided"}</p>
                  </div>
                ) : (
                  <p>Select an application to preview its details here.</p>
                )}
              </div>
            </Field>
          </div>

          <Field label="Extra context for the email">
            <textarea
              value={extraContext}
              onChange={(e) => setExtraContext(e.target.value)}
              placeholder="Optional: mention a referral, a recent project update, the team you are excited about, or anything you want the email to reflect."
              className="min-h-[130px] w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm leading-7 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </Field>

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            onClick={generate}
            disabled={!selectedSummary || !token || loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl gradient-purple text-sm font-bold text-primary-foreground transition hover:opacity-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                Generating follow-up...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Follow-up Email
              </>
            )}
          </button>
        </section>

        <aside className="space-y-6">
          <div className="glass-card rounded-[28px] border border-border p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Email Preview</h3>
                <p className="text-sm text-muted-foreground">Review, copy, or open it in your mail app.</p>
              </div>
            </div>

            {!email ? (
              <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
                Generate an email to see the subject line and body here.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-border bg-secondary/50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Subject</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{subject}</p>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Body</p>
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{email}</pre>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => copy(subject, "subject")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"
                  >
                    {copied === "subject" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy Subject
                  </button>
                  <button
                    type="button"
                    onClick={() => copy(email, "body")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"
                  >
                    {copied === "body" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy Body
                  </button>
                  <button
                    type="button"
                    onClick={() => copy(`Subject: ${subject}\n\n${email}`, "all")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 px-3 py-2 text-sm text-primary hover:bg-primary/10 sm:col-span-2"
                  >
                    {copied === "all" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy Full Email
                  </button>
                  <button
                    type="button"
                    onClick={generate}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary sm:col-span-2"
                  >
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    Regenerate
                  </button>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(email)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl gradient-purple px-3 py-2 text-sm font-bold text-primary-foreground sm:col-span-2"
                  >
                    <Mail className="h-4 w-4" />
                    Open in Mail
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card rounded-[28px] border border-border p-5 sm:p-6">
            <h3 className="text-lg font-bold text-foreground">What improves the result</h3>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <Tip icon={Building2} text="Pick the exact application so the company, role, and status match." />
              <Tip icon={CalendarClock} text="Adjust the timing so the email matches how long you’ve actually waited." />
              <Tip icon={UserRound} text="Add the recruiter name if you have it for a much more natural greeting." />
              <Tip icon={FileText} text="Use extra context to mention a referral, portfolio, or recent relevant update." />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}

function Tip({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  text: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/30 p-3">
      <div className="rounded-xl border border-primary/20 bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p>{text}</p>
    </div>
  )
}
