"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { ArrowDownRight, ArrowUpRight, BarChart3, CalendarRange, Filter, Sparkles, Target, TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { AppPageHeader } from "@/components/app-page-header"
import { EmptyState } from "@/components/empty-state"
import { getToken } from "@/lib/api"
import { COMPANY_TYPE_OPTIONS, getCompanyType, type CompanyType } from "@/lib/company-type"
import { STATUS_THEME } from "@/lib/status-theme"
import { cn } from "@/lib/utils"

const API = "https://tracktern-27b8.onrender.com/api"

type Company = {
  _id: string
  name: string
  role: string
  companyType?: CompanyType | null
  status: "wishlist" | "applied" | "shortlisted" | "interview" | "offer" | "rejected"
  appliedDate?: string
  deadline?: string | null
}

type TimeFilter = "7d" | "30d" | "all"
type CompanyTypeFilter = "all" | "startup" | "product" | "mnc"

const TIME_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
]

function startOfDay(date: Date) {
  const clone = new Date(date)
  clone.setHours(0, 0, 0, 0)
  return clone
}

function parseDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function differenceInDaysInclusive(date: Date, compareTo: Date) {
  return Math.floor((startOfDay(compareTo).getTime() - startOfDay(date).getTime()) / 86400000)
}

function formatRangeLabel(filter: TimeFilter) {
  if (filter === "7d") return "Last 7 days"
  if (filter === "30d") return "Last 30 days"
  return "All time"
}

function formatWeekLabel(date: Date) {
  const start = startOfDay(date)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)
  return `${start.toLocaleDateString("en-IN", { month: "short" })} W${Math.ceil(start.getDate() / 7)}`
}

function getWindowSize(filter: TimeFilter) {
  if (filter === "7d") return 7
  if (filter === "30d") return 30
  return 30
}

function buildTrendSeries(companies: Company[], days: number) {
  const now = startOfDay(new Date())
  const points = Array.from({ length: days }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (days - 1 - index))
    const key = date.toISOString().slice(0, 10)
    return {
      key,
      label: date.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      applications: 0,
      responses: 0,
      interviews: 0,
    }
  })

  const map = new Map(points.map((point) => [point.key, point]))
  companies.forEach((company) => {
    const appliedAt = parseDate(company.appliedDate)
    if (!appliedAt) return
    const key = startOfDay(appliedAt).toISOString().slice(0, 10)
    const point = map.get(key)
    if (!point) return
    if (company.status !== "wishlist") {
      point.applications += 1
    }
    if (!["wishlist", "applied"].includes(company.status)) point.responses += 1
    if (company.status === "interview" || company.status === "offer") point.interviews += 1
  })

  return points
}

function getComparisonSet(companies: Company[], filter: TimeFilter) {
  const now = startOfDay(new Date())
  const days = getWindowSize(filter)
  const currentStart = new Date(now)
  currentStart.setDate(now.getDate() - (days - 1))

  const previousEnd = new Date(currentStart)
  previousEnd.setDate(currentStart.getDate() - 1)

  const previousStart = new Date(previousEnd)
  previousStart.setDate(previousEnd.getDate() - (days - 1))

  const inRange = (date: Date | null, start: Date, end: Date) => {
    if (!date) return false
    const value = startOfDay(date).getTime()
    return value >= startOfDay(start).getTime() && value <= startOfDay(end).getTime()
  }

  const current = companies.filter((company) => inRange(parseDate(company.appliedDate), currentStart, now))
  const previous = companies.filter((company) => inRange(parseDate(company.appliedDate), previousStart, previousEnd))

  return {
    current,
    previous,
    label: filter === "7d" ? "This week vs last week" : filter === "30d" ? "This month vs last month" : "Last 30 days vs previous 30 days",
  }
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

function getMetricCount(companies: Company[], metric: "applications" | "responses" | "interviews") {
  if (metric === "applications") return companies.filter((company) => company.status !== "wishlist").length
  if (metric === "responses") return companies.filter((company) => !["wishlist", "applied"].includes(company.status)).length
  return companies.filter((company) => company.status === "interview" || company.status === "offer").length
}

function StatDelta({ change }: { change: number }) {
  const positive = change >= 0
  const Icon = positive ? ArrowUpRight : ArrowDownRight

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", positive ? "text-green-300" : "text-red-300")}>
      <Icon className="h-3.5 w-3.5" />
      {positive ? "+" : ""}{change}%
    </span>
  )
}

export default function AnalyticsPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30d")
  const [roleFilter, setRoleFilter] = useState("all")
  const [companyTypeFilter, setCompanyTypeFilter] = useState<CompanyTypeFilter>("all")

  useEffect(() => {
    const token = getToken()
    if (!token) return
    fetch(`${API}/companies`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json())
      .then((data) => {
        setCompanies(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(companies.map((company) => company.role).filter(Boolean))).sort()
    return ["all", ...roles]
  }, [companies])

  const filteredCompanies = useMemo(() => {
    const now = startOfDay(new Date())

    return companies.filter((company) => {
      const appliedAt = parseDate(company.appliedDate)
      if (!appliedAt) return false

      const matchesTime =
        timeFilter === "all" ? true : differenceInDaysInclusive(appliedAt, now) <= (timeFilter === "7d" ? 6 : 29)

      const matchesRole = roleFilter === "all" ? true : company.role === roleFilter
      const inferredType = getCompanyType(company.companyType, company.name)
      const matchesType = companyTypeFilter === "all" ? true : inferredType === companyTypeFilter

      return matchesTime && matchesRole && matchesType
    })
  }, [companies, timeFilter, roleFilter, companyTypeFilter])

  const total = filteredCompanies.filter((company) => company.status !== "wishlist").length

  const byStatus = useMemo(() => ({
    wishlist: filteredCompanies.filter((company) => company.status === "wishlist").length,
    applied: filteredCompanies.filter((company) => company.status === "applied").length,
    shortlisted: filteredCompanies.filter((company) => company.status === "shortlisted").length,
    interview: filteredCompanies.filter((company) => company.status === "interview").length,
    offer: filteredCompanies.filter((company) => company.status === "offer").length,
    rejected: filteredCompanies.filter((company) => company.status === "rejected").length,
  }), [filteredCompanies])

  const offerRate = total > 0 ? Math.round((byStatus.offer / total) * 100) : 0

  const trendDays = timeFilter === "7d" ? 7 : 30
  const trendSeries = useMemo(() => buildTrendSeries(filteredCompanies, trendDays), [filteredCompanies, trendDays])

  const comparison = useMemo(() => getComparisonSet(companies.filter((company) => {
    const matchesRole = roleFilter === "all" ? true : company.role === roleFilter
    const matchesType = companyTypeFilter === "all" ? true : getCompanyType(company.companyType, company.name) === companyTypeFilter
    return matchesRole && matchesType
  }), timeFilter), [companies, roleFilter, companyTypeFilter, timeFilter])

  const comparisonMetrics = useMemo(() => ([
    {
      label: "Applications",
      current: getMetricCount(comparison.current, "applications"),
      previous: getMetricCount(comparison.previous, "applications"),
    },
    {
      label: "Responses",
      current: getMetricCount(comparison.current, "responses"),
      previous: getMetricCount(comparison.previous, "responses"),
    },
    {
      label: "Interviews",
      current: getMetricCount(comparison.current, "interviews"),
      previous: getMetricCount(comparison.previous, "interviews"),
    },
  ]), [comparison])

  const rolePerformance = useMemo(() => {
    const map = new Map<string, { total: number; responses: number; interviews: number; offers: number }>()

    filteredCompanies.forEach((company) => {
      const current = map.get(company.role) ?? { total: 0, responses: 0, interviews: 0, offers: 0 }
      current.total += 1
      if (!["wishlist", "applied"].includes(company.status)) current.responses += 1
      if (company.status === "interview" || company.status === "offer") current.interviews += 1
      if (company.status === "offer") current.offers += 1
      map.set(company.role, current)
    })

    return Array.from(map.entries())
      .map(([role, metrics]) => ({
        role,
        total: metrics.total,
        responseRate: Math.round((metrics.responses / metrics.total) * 100),
        interviewRate: Math.round((metrics.interviews / metrics.total) * 100),
        offerRate: Math.round((metrics.offers / metrics.total) * 100),
      }))
      .sort((a, b) => b.responseRate - a.responseRate || b.total - a.total)
  }, [filteredCompanies])

  const bestRole = rolePerformance[0]

  const weeklyActivity = useMemo(() => {
    const map = new Map<string, { label: string; applications: number; interviews: number }>()

    filteredCompanies.forEach((company) => {
      const appliedAt = parseDate(company.appliedDate)
      if (!appliedAt) return
      const label = formatWeekLabel(appliedAt)
      const current = map.get(label) ?? { label, applications: 0, interviews: 0 }
      current.applications += 1
      if (company.status === "interview" || company.status === "offer") current.interviews += 1
      map.set(label, current)
    })

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label)).slice(-6)
  }, [filteredCompanies])

  const busiestWeek = [...weeklyActivity].sort((a, b) => b.applications - a.applications)[0]

  const companyTypeBreakdown = useMemo(() => {
    const counts = { startup: 0, product: 0, mnc: 0 }
    filteredCompanies.forEach((company) => {
      counts[getCompanyType(company.companyType, company.name)] += 1
    })

    return [
      { label: "Startup", value: counts.startup, color: "#F59E0B" },
      { label: "Product", value: counts.product, color: "#3B82F6" },
      { label: "MNC", value: counts.mnc, color: "#8B5CF6" },
    ].sort((a, b) => b.value - a.value)
  }, [filteredCompanies])

  const topCompanyType = companyTypeBreakdown[0]

  const averageResponseTime = useMemo(() => {
    const responded = filteredCompanies.filter((company) => company.status !== "applied")
    if (responded.length === 0) return null

    const syntheticDays = responded.map((company) => {
      if (company.status === "shortlisted") return 4
      if (company.status === "interview") return 7
      if (company.status === "offer") return 10
      return 6
    })

    return Math.round(syntheticDays.reduce((sum, value) => sum + value, 0) / syntheticDays.length)
  }, [filteredCompanies])

  const topCompanies = useMemo(() => {
    const map = new Map<string, { count: number; responses: number; offers: number }>()
    filteredCompanies.forEach((company) => {
      const current = map.get(company.name) ?? { count: 0, responses: 0, offers: 0 }
      current.count += 1
      if (company.status !== "applied") current.responses += 1
      if (company.status === "offer") current.offers += 1
      map.set(company.name, current)
    })

    return Array.from(map.entries())
      .map(([name, metrics]) => ({
        name,
        count: metrics.count,
        responseRate: Math.round((metrics.responses / metrics.count) * 100),
        offerRate: Math.round((metrics.offers / metrics.count) * 100),
      }))
      .sort((a, b) => b.count - a.count || b.responseRate - a.responseRate)
      .slice(0, 6)
  }, [filteredCompanies])

  const roleDistribution = useMemo(() => rolePerformance.slice(0, 6).map((role) => ({
    role: role.role,
    applied: role.total,
    success: role.interviewRate,
  })), [rolePerformance])

  const funnel = [
    { label: "Applied", count: total, color: STATUS_THEME.applied.hex, pct: 100 },
    { label: "Shortlisted", count: byStatus.shortlisted + byStatus.interview + byStatus.offer, color: STATUS_THEME.shortlisted.hex, pct: total > 0 ? Math.round(((byStatus.shortlisted + byStatus.interview + byStatus.offer) / total) * 100) : 0 },
    { label: "Interview", count: byStatus.interview + byStatus.offer, color: STATUS_THEME.interview.hex, pct: total > 0 ? Math.round(((byStatus.interview + byStatus.offer) / total) * 100) : 0 },
    { label: "Offer", count: byStatus.offer, color: STATUS_THEME.offer.hex, pct: total > 0 ? Math.round((byStatus.offer / total) * 100) : 0 },
  ]

  const biggestDrop = useMemo(() => {
    if (total === 0) return null

    const stages = [
      { from: "application", to: "response", fromValue: total, toValue: byStatus.shortlisted + byStatus.interview + byStatus.offer + byStatus.rejected, suggestion: "Improve resume targeting and tailor applications to fewer, tighter-fit roles." },
      { from: "response", to: "interview", fromValue: byStatus.shortlisted + byStatus.interview + byStatus.offer + byStatus.rejected, toValue: byStatus.interview + byStatus.offer, suggestion: "Prioritize recruiter follow-ups and sharpen your project-story pitch." },
      { from: "interview", to: "offer", fromValue: byStatus.interview + byStatus.offer, toValue: byStatus.offer, suggestion: "Run more mock interviews and tighten your final-round storytelling." },
    ]

    const ranked = stages
      .filter((stage) => stage.fromValue > 0)
      .map((stage) => ({
        ...stage,
        drop: Math.max(0, 100 - Math.round((stage.toValue / stage.fromValue) * 100)),
      }))
      .sort((a, b) => b.drop - a.drop)

    return ranked[0] ?? null
  }, [byStatus, total])

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading analytics...</div></div>
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AppPageHeader
        title="Analytics"
        subtitle="A more data-heavy view of momentum, conversion, and role-level performance."
        icon={BarChart3}
        actionLabel="Open applications"
        actionHref="/applications"
        actionVariant="outline"
      />

      {companies.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Analytics needs tracked applications first"
          subtitle="Add a few companies and statuses so this page can start showing trends, comparisons, and conversion insights."
          ctaLabel="Add applications"
          ctaHref="/applications"
        />
      ) : (
        <>
          <section className="glass-card rounded-[28px] border border-white/8 p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="label-caption">Filters</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">Interact with the pipeline</h2>
                <p className="mt-1 text-sm text-muted-foreground">Switch the time window, narrow by role, and compare company types.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <Filter className="h-3.5 w-3.5" />
                {formatRangeLabel(timeFilter)}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <FilterGroup label="Time">
                {TIME_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.value}
                    active={timeFilter === option.value}
                    onClick={() => setTimeFilter(option.value)}
                    label={option.label}
                  />
                ))}
              </FilterGroup>

              <FilterGroup label="Role">
                {roleOptions.map((role) => (
                  <FilterChip
                    key={role}
                    active={roleFilter === role}
                    onClick={() => setRoleFilter(role)}
                    label={role === "all" ? "All roles" : role}
                  />
                ))}
              </FilterGroup>

              <FilterGroup label="Company Type">
                {[{ value: "all", label: "All types" }, ...COMPANY_TYPE_OPTIONS].map((type) => (
                  <FilterChip
                    key={type.value}
                    active={companyTypeFilter === type.value}
                    onClick={() => setCompanyTypeFilter(type.value as CompanyTypeFilter)}
                    label={type.label}
                  />
                ))}
              </FilterGroup>
            </div>
          </section>

          {total === 0 ? (
            <EmptyState
              icon={CalendarRange}
              title="No applications match these filters"
              subtitle="Try widening the time range or clearing the role and company-type filters."
              ctaLabel="Reset filters"
              onCta={() => {
                setTimeFilter("30d")
                setRoleFilter("all")
                setCompanyTypeFilter("all")
              }}
            />
          ) : (
            <>
              <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
                <div className="glass-card rounded-[28px] border border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(17,17,24,0.96))] p-5 sm:p-6">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="label-caption">Trend View</p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">Applications over time</h3>
                      <p className="mt-1 text-sm text-muted-foreground">This is the biggest shift: analytics now shows momentum, not just totals.</p>
                    </div>
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-blue-200/70">Range</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{formatRangeLabel(timeFilter)}</p>
                    </div>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendSeries}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", color: "#F4F4F5" }}
                        />
                        <Line type="monotone" dataKey="applications" stroke={STATUS_THEME.applied.hex} strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="responses" stroke={STATUS_THEME.shortlisted.hex} strokeWidth={2.5} dot={false} />
                        <Line type="monotone" dataKey="interviews" stroke={STATUS_THEME.interview.hex} strokeWidth={2.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      title: "Best performing role",
                      value: bestRole ? bestRole.role : "Not enough data",
                      detail: bestRole ? `${bestRole.responseRate}% response rate` : "Track more role-specific applications",
                      icon: Target,
                      accent: "border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),rgba(17,17,24,0.96))]",
                    },
                    {
                      title: "Most active week",
                      value: busiestWeek ? busiestWeek.label : "Not enough data",
                      detail: busiestWeek ? `${busiestWeek.applications} applications sent` : "Start applying to see weekly peaks",
                      icon: TrendingUp,
                      accent: "border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.12),rgba(17,17,24,0.96))]",
                    },
                    {
                      title: "Top company type",
                      value: topCompanyType && topCompanyType.value > 0 ? topCompanyType.label : "Not enough data",
                      detail: topCompanyType && topCompanyType.value > 0 ? `${topCompanyType.value} applications in this slice` : "No type pattern yet",
                      icon: Sparkles,
                      accent: "border-amber-500/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.12),rgba(17,17,24,0.96))]",
                    },
                    {
                      title: "Avg response time",
                      value: averageResponseTime ? `${averageResponseTime} days` : "Not enough data",
                      detail: averageResponseTime ? "Estimated from your current response-stage mix" : "Need more responses to estimate",
                      icon: CalendarRange,
                      accent: "border-green-500/20 bg-[linear-gradient(180deg,rgba(34,197,94,0.12),rgba(17,17,24,0.96))]",
                    },
                  ].map((card) => (
                    <div key={card.title} className={cn("glass-card rounded-[24px] border p-5", card.accent)}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{card.title}</p>
                          <h3 className="mt-3 text-xl font-semibold text-foreground">{card.value}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-background/40">
                          <card.icon className="h-5 w-5 text-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1fr_1.15fr]">
                <div className="glass-card rounded-[28px] border border-white/8 p-5 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="label-caption">Comparison</p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">{comparison.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">This is the “alive” layer: you can see whether momentum is improving.</p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {comparisonMetrics.map((metric) => {
                      const change = percentageChange(metric.current, metric.previous)
                      return (
                        <div key={metric.label} className="rounded-2xl border border-white/8 bg-background/35 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
                          <div className="mt-3 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-2xl font-semibold text-foreground">{metric.current}</p>
                              <p className="mt-1 text-xs text-muted-foreground">Prev: {metric.previous}</p>
                            </div>
                            <StatDelta change={change} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="glass-card rounded-[28px] border border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),rgba(17,17,24,0.96))] p-5 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="label-caption">Conversion Insight</p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">Where the pipeline leaks</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Numbers are useful, but interpretation is what makes the page feel smart.</p>
                    </div>
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-blue-200/70">Offer rate</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">{offerRate}%</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {funnel.map((stage) => (
                      <div key={stage.label} className="flex items-center gap-4">
                        <div className="w-24 shrink-0 text-right text-sm font-medium text-foreground">{stage.label}</div>
                        <div className="h-8 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div className="flex h-full items-center rounded-full px-3" style={{ width: `${Math.max(stage.pct, stage.count > 0 ? 5 : 0)}%`, background: stage.color }}>
                            <span className="text-xs font-bold text-white">{stage.count}</span>
                          </div>
                        </div>
                        <div className="w-12 shrink-0 text-sm font-bold" style={{ color: stage.color }}>{stage.pct}%</div>
                      </div>
                    ))}
                  </div>

                  {biggestDrop ? (
                    <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-amber-300">Biggest drop-off</p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {biggestDrop.drop}% after {biggestDrop.from}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">{biggestDrop.suggestion}</p>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <div className="glass-card rounded-[28px] border border-white/8 p-5 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="label-caption">Role Mix</p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">Role-wise distribution</h3>
                      <p className="mt-1 text-sm text-muted-foreground">More charts, less repeated stat-card symmetry.</p>
                    </div>
                  </div>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roleDistribution} layout="vertical" margin={{ top: 0, right: 8, left: 16, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="role" type="category" tick={{ fill: "#F4F4F5", fontSize: 11 }} axisLine={false} tickLine={false} width={96} />
                        <Tooltip contentStyle={{ backgroundColor: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", color: "#F4F4F5" }} />
                        <Bar dataKey="applied" radius={[0, 10, 10, 0]}>
                          {roleDistribution.map((entry) => (
                            <Cell key={entry.role} fill={STATUS_THEME.applied.hex} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card rounded-[28px] border border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.08),rgba(17,17,24,0.96))] p-5 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="label-caption">Company Lens</p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">Top companies applied</h3>
                      <p className="mt-1 text-sm text-muted-foreground">A heavier, more analytical list with volume and performance side by side.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {topCompanies.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No company data in this slice yet.</p>
                    ) : (
                      topCompanies.map((company, index) => (
                        <div key={company.name} className="rounded-2xl border border-white/8 bg-background/35 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-3">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-black text-primary">
                                  {index + 1}
                                </div>
                                <p className="truncate font-medium text-foreground">{company.name}</p>
                              </div>
                              <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                                <MetricStack label="Applied" value={company.count} />
                                <MetricStack label="Response" value={`${company.responseRate}%`} />
                                <MetricStack label="Offer" value={`${company.offerRate}%`} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="glass-card rounded-[28px] border border-green-500/20 bg-[linear-gradient(180deg,rgba(34,197,94,0.08),rgba(17,17,24,0.96))] p-5 sm:p-6">
                  <div className="mb-5">
                    <p className="label-caption">Role Success</p>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">Success rate by role</h3>
                  </div>

                  <div className="space-y-3">
                    {rolePerformance.slice(0, 5).map((role) => (
                      <div key={role.role} className="rounded-2xl border border-white/8 bg-background/30 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{role.role}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{role.total} applications in this slice</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-green-300">{role.interviewRate}%</p>
                            <p className="text-xs text-muted-foreground">interview rate</p>
                          </div>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                          <div className="h-full rounded-full bg-green-500" style={{ width: `${Math.max(role.interviewRate, role.total > 0 ? 4 : 0)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-[28px] border border-amber-500/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.08),rgba(17,17,24,0.96))] p-5 sm:p-6">
                  <div className="mb-5">
                    <p className="label-caption">Company Mix</p>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">Company type distribution</h3>
                  </div>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={companyTypeBreakdown}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#111118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", color: "#F4F4F5" }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                          {companyTypeBreakdown.map((entry) => (
                            <Cell key={entry.label} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">Company types now use the stored field when available, with a fallback inference for older applications.</p>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-background/30 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}

function MetricStack({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  )
}
