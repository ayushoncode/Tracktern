"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Briefcase, Compass, LoaderCircle, Plus, Radar, Sparkles, Target, TrendingUp, X } from "lucide-react"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar as RechartsRadar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { AppPageHeader } from "@/components/app-page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getCareerProfile, getToken, predictCareerPaths, trackCareerPath } from "@/lib/api"

const SKILL_SUGGESTIONS = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "Python",
  "Java",
  "C++",
  "DSA",
  "SQL",
  "Machine Learning",
  "System Design",
  "UI/UX",
  "Figma",
  "Product Sense",
  "Docker",
  "AWS",
  "Git",
]

const INTEREST_OPTIONS = ["Web Dev", "Data Science", "Product", "Design", "AI/ML", "Cybersecurity"]
const YEAR_OPTIONS = ["1st", "2nd", "3rd", "4th"]

type RoadmapStep = {
  step: number
  action: string
  duration: string
}

type CareerPath = {
  title: string
  matchScore: number
  matchingSkills: string[]
  skillGaps: string[]
  roadmap: RoadmapStep[]
  timeToReady: string
  internshipKeywords: string[]
}

type CareerProfile = {
  skills: string[]
  interests: string
  year: string
  savedPaths: CareerPath[]
}

type JobPlatform = {
  label: string
  href: string
}

function isCareerProfile(value: unknown): value is CareerProfile {
  if (!value || typeof value !== "object") return false

  const profile = value as CareerProfile
  return Array.isArray(profile.skills) && Array.isArray(profile.savedPaths)
}

function buildRadarData(path: CareerPath) {
  const matched = path.matchingSkills.map((skill) => ({
    skill,
    score: 100,
    fullMark: 100,
  }))

  const gaps = path.skillGaps.slice(0, Math.max(1, 6 - matched.length)).map((skill) => ({
    skill,
    score: 35,
    fullMark: 100,
  }))

  return [...matched, ...gaps].slice(0, 6)
}

function buildInternshipLinks(path: CareerPath) {
  const seedKeyword = path.internshipKeywords[0] || path.title
  const query = encodeURIComponent(`${seedKeyword} internship india`)

  return [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/jobs/search/?keywords=${query}`,
    },
    {
      label: "Naukri",
      href: `https://www.naukri.com/${query.replace(/%20/g, "-")}-jobs`,
    },
    {
      label: "Internshala",
      href: `https://internshala.com/internships/keywords-${query.replace(/%20/g, "-")}/`,
    },
    {
      label: "Indeed",
      href: `https://in.indeed.com/jobs?q=${query}`,
    },
  ] satisfies JobPlatform[]
}

function SkillTag({
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
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-white/10 bg-secondary/30 text-muted-foreground hover:border-white/20 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}

export function CareerPathPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [interests, setInterests] = useState("")
  const [year, setYear] = useState("")
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])
  const [savedPaths, setSavedPaths] = useState<CareerPath[]>([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [trackingTitle, setTrackingTitle] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const token = getToken()
    if (!token) {
      window.location.href = "/"
      return
    }

    getCareerProfile(token).then((data: CareerProfile | { message?: string }) => {
      if (!isCareerProfile(data)) {
        setLoadingProfile(false)
        return
      }

      setSkills(Array.isArray(data.skills) ? data.skills : [])
      setInterests(data.interests || "")
      setYear(data.year || "")
      setSavedPaths(Array.isArray(data.savedPaths) ? data.savedPaths : [])
      setLoadingProfile(false)
    })
  }, [])

  const toggleSkill = (skill: string) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((entry) => entry !== skill)
        : [...current, skill]
    )
  }

  const addCustomSkill = () => {
    const nextSkill = skillInput.trim()
    if (!nextSkill || skills.some((skill) => skill.toLowerCase() === nextSkill.toLowerCase())) return
    setSkills((current) => [...current, nextSkill])
    setSkillInput("")
  }

  const submitPrediction = async () => {
    if (!skills.length || !interests || !year) {
      setError("Add at least one skill, choose an interest, and select your year.")
      return
    }

    setError("")
    setSuccess("")
    setPredicting(true)

    const token = getToken()
    if (!token) return

    const data = await predictCareerPaths(token, { skills, interests, year })

    if (data?.message) {
      setError(data.message)
      setPredicting(false)
      return
    }

    setCareerPaths(Array.isArray(data.careerPaths) ? data.careerPaths : [])
    setSavedPaths(Array.isArray(data.profile?.savedPaths) ? data.profile.savedPaths : [])
    setPredicting(false)
  }

  const handleTrackPath = async (path: CareerPath) => {
    setTrackingTitle(path.title)
    setError("")
    setSuccess("")

    const token = getToken()
    if (!token) return

    const data = await trackCareerPath(token, { path, skills, interests, year })

    if (data?.message && !data?.savedPath) {
      setError(data.message)
      setTrackingTitle("")
      return
    }

    setSavedPaths(Array.isArray(data.profile?.savedPaths) ? data.profile.savedPaths : savedPaths)
    setSuccess(`Added ${path.internshipKeywords.length} wishlist cards for ${path.title}.`)
    setTrackingTitle("")
  }

  if (loadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full rounded-2xl bg-secondary/50" />
        <Skeleton className="h-72 w-full rounded-2xl bg-secondary/50" />
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-[28rem] rounded-2xl bg-secondary/50" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="AI Career Path Predictor"
        subtitle="Map your current skills to realistic internship paths, spot the gaps, and send promising roles straight into your wishlist board."
        icon={Compass}
      />

      <Card className="overflow-hidden border-primary/15 bg-[linear-gradient(180deg,rgba(124,58,237,0.12),rgba(17,17,24,0.96))]">
        <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-foreground">Skills you already have</p>
              <p className="mt-1 text-sm text-muted-foreground">Pick from common tags or add your own stack.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {SKILL_SUGGESTIONS.map((skill) => (
                <SkillTag
                  key={skill}
                  label={skill}
                  active={skills.includes(skill)}
                  onClick={() => toggleSkill(skill)}
                />
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-background/30 p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addCustomSkill()
                    }
                  }}
                  placeholder="Add a custom skill like Tailwind, Flask, or Power BI"
                  className="h-11 flex-1 rounded-xl border border-white/10 bg-secondary/30 px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <Button onClick={addCustomSkill} variant="secondary" className="h-11 rounded-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {skills.length ? (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300"
                    >
                      {skill}
                      <button type="button" onClick={() => toggleSkill(skill)} className="text-emerald-200/70 hover:text-emerald-200">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills selected yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-background/30 p-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Primary interest</label>
              <select
                value={interests}
                onChange={(event) => setInterests(event.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 text-sm text-foreground outline-none"
              >
                <option value="">Select an interest</option>
                {INTEREST_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Current year of study</label>
              <select
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 text-sm text-foreground outline-none"
              >
                <option value="">Select your year</option>
                {YEAR_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Skills</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{skills.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Saved Paths</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{savedPaths.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Ready To Predict</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{skills.length && interests && year ? "Yes" : "No"}</p>
              </div>
            </div>

            <Button
              onClick={submitPrediction}
              disabled={predicting}
              className="h-11 w-full rounded-xl gradient-purple text-primary-foreground hover:opacity-90"
            >
              {predicting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {predicting ? "Generating career paths..." : "Predict Career Paths"}
            </Button>

            {error ? <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}
            {success ? <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</div> : null}
          </div>
        </CardContent>
      </Card>

      {predicting ? (
        <div className="grid gap-6 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="border-white/10 bg-card/80">
              <CardHeader className="space-y-3">
                <Skeleton className="h-6 w-40 bg-secondary/60" />
                <Skeleton className="h-3 w-full bg-secondary/60" />
              </CardHeader>
              <CardContent className="space-y-5">
                <Skeleton className="h-48 w-full rounded-2xl bg-secondary/60" />
                <Skeleton className="h-24 w-full rounded-2xl bg-secondary/60" />
                <Skeleton className="h-24 w-full rounded-2xl bg-secondary/60" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : careerPaths.length ? (
        <div className="grid gap-6 xl:grid-cols-3">
          {careerPaths.map((path) => {
            const radarData = buildRadarData(path)
            const isTracked = savedPaths.some((savedPath) => savedPath.title.toLowerCase() === path.title.toLowerCase())
            const applyLinks = buildInternshipLinks(path)
            const hasMatch = path.matchingSkills.length > 0 || path.matchScore >= 50

            return (
              <Card key={path.title} className="overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(10,10,16,0.98))]">
                <CardHeader className="border-b border-white/8 pb-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-foreground">{path.title}</CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground">{path.timeToReady || "Timeline unavailable"}</p>
                    </div>
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      {path.matchScore}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <span>Match Score</span>
                      <span>{path.matchScore}%</span>
                    </div>
                    <Progress value={path.matchScore} className="h-2.5 bg-white/8" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 pt-6">
                  <div className="rounded-2xl border border-white/8 bg-background/25 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Radar className="h-4 w-4 text-primary" />
                      Skills Match Radar
                    </div>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.12)" />
                          <PolarAngleAxis dataKey="skill" tick={{ fill: "#B3B8C5", fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#111118",
                              border: "1px solid rgba(255,255,255,0.08)",
                              borderRadius: "12px",
                              color: "#F8FAFC",
                            }}
                          />
                          <RechartsRadar
                            name="Skill coverage"
                            dataKey="score"
                            stroke="#8B5CF6"
                            fill="#8B5CF6"
                            fillOpacity={0.35}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                        <Target className="h-4 w-4" />
                        Matching Skills
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {path.matchingSkills.length ? path.matchingSkills.map((skill) => (
                          <span key={skill} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200">
                            {skill}
                          </span>
                        )) : <span className="text-sm text-emerald-100/70">No direct matches yet</span>}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-500/15 bg-amber-500/8 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-300">
                        <TrendingUp className="h-4 w-4" />
                        Skills Gap
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {path.skillGaps.length ? path.skillGaps.map((skill) => (
                          <span key={skill} className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-100">
                            {skill}
                          </span>
                        )) : <span className="text-sm text-amber-100/70">Looks strong already</span>}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-background/25 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Compass className="h-4 w-4 text-primary" />
                      3-Step Roadmap
                    </div>
                    <div className="mt-4 space-y-3">
                      {path.roadmap.map((step) => (
                        <div key={`${path.title}-${step.step}`} className="rounded-xl border border-white/8 bg-white/5 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">Step {step.step}</p>
                            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{step.duration}</span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{step.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-500/15 bg-blue-500/8 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-300">
                      <Briefcase className="h-4 w-4" />
                      Internship Keywords
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {path.internshipKeywords.map((keyword) => (
                        <span key={keyword} className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-100">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {hasMatch ? (
                    <div className="rounded-2xl border border-violet-500/15 bg-violet-500/8 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-violet-200">
                        <ArrowUpRight className="h-4 w-4" />
                        Start Applying
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Your profile already has a decent match here, so you can jump straight into internship searches on job platforms.
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {applyLinks.map((platform) => (
                          <a
                            key={`${path.title}-${platform.label}`}
                            href={platform.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground transition-colors hover:border-violet-400/30 hover:bg-violet-500/10"
                          >
                            <span>{platform.label}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-violet-200" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </CardContent>

                <CardFooter className="border-t border-white/8 pt-5">
                  <Button
                    onClick={() => handleTrackPath(path)}
                    disabled={trackingTitle === path.title}
                    className="w-full rounded-xl"
                    variant={isTracked ? "secondary" : "default"}
                  >
                    {trackingTitle === path.title ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Tracking Path...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isTracked ? "Update Tracked Path" : "Track This Path"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="Build your profile to see career paths"
          subtitle="Add your current skills, interest area, and year of study, then let Tracktern generate targeted internship directions."
        />
      )}
    </div>
  )
}
