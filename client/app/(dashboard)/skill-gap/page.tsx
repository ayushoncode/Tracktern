"use client"

import { useState, useEffect } from "react"
import { Plus, X, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { getCompanies, getToken } from "@/lib/api"

export default function SkillGapPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Common skills required by tech companies
  const commonTechSkills = [
    { skill: "React", demand: 0 },
    { skill: "Node.js", demand: 0 },
    { skill: "Python", demand: 0 },
    { skill: "SQL", demand: 0 },
    { skill: "TypeScript", demand: 0 },
    { skill: "Docker", demand: 0 },
    { skill: "AWS", demand: 0 },
    { skill: "System Design", demand: 0 },
    { skill: "DSA", demand: 0 },
    { skill: "Git", demand: 0 },
  ]

  // Simulate demand based on number of companies
  const skillDemandData = commonTechSkills.map((item, i) => ({
    skill: item.skill,
    demand: Math.max(1, companies.length - (i % 3)),
    hasSkill: skills.map(s => s.toLowerCase()).includes(item.skill.toLowerCase()),
  })).sort((a, b) => b.demand - a.demand)

  const missingSkills = skillDemandData
    .filter(s => !s.hasSkill)
    .map((s, i) => ({
      skill: s.skill,
      companies: s.demand,
      severity: i < 2 ? "high" : i < 4 ? "medium" : "low"
    }))

  useEffect(() => {
    const token = getToken()
    if (!token) { window.location.href = "/"; return }

    // Load saved skills from localStorage
    const savedSkills = localStorage.getItem("tracktern_skills")
    if (savedSkills) setSkills(JSON.parse(savedSkills))
    else setSkills(["JavaScript", "React", "Python", "SQL", "Git", "Node.js"])

    getCompanies(token).then((data) => {
      setCompanies(Array.isArray(data) ? data : [])
    })
  }, [])

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()]
      setSkills(updated)
      localStorage.setItem("tracktern_skills", JSON.stringify(updated))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove)
    setSkills(updated)
    localStorage.setItem("tracktern_skills", JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Skill Gap Analysis</h2>
        <p className="text-muted-foreground">See what skills you need based on your {companies.length} applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Skills */}
        <div className="glass-card rounded-xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Your Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {skill}
                <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-green-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add a skill (e.g. Docker, AWS...)"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button onClick={addSkill} className="gradient-purple hover:opacity-90 text-primary-foreground">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Skills are saved automatically</p>
        </div>

        {/* Missing Skills */}
        <div className="glass-card rounded-xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Missing Skills
          </h3>
          {companies.length === 0 ? (
            <p className="text-muted-foreground text-sm">Add companies in Applications to see skill gaps</p>
          ) : (
            <div className="space-y-3">
              {missingSkills.slice(0, 5).map((warning) => (
                <div key={warning.skill} className={cn("flex items-center justify-between p-3 rounded-lg border",
                  warning.severity === "high" ? "bg-red-500/10 border-red-500/30" :
                  warning.severity === "medium" ? "bg-yellow-500/10 border-yellow-500/30" :
                  "bg-blue-500/10 border-blue-500/30"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full",
                      warning.severity === "high" ? "bg-red-500" :
                      warning.severity === "medium" ? "bg-yellow-500" : "bg-blue-500"
                    )} />
                    <span className="font-medium text-foreground">{warning.skill}</span>
                  </div>
                  <span className={cn("text-sm",
                    warning.severity === "high" ? "text-red-400" :
                    warning.severity === "medium" ? "text-yellow-400" : "text-blue-400"
                  )}>
                    {warning.companies} companies need this
                  </span>
                </div>
              ))}
              {missingSkills.length === 0 && (
                <p className="text-green-400 text-sm">🎉 You have all required skills!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glass-card rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Most Required Skills Across Your Applications</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillDemandData} layout="vertical" margin={{ top: 0, right: 30, left: 90, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={{ stroke: "#2E2E3A" }} tickLine={{ stroke: "#2E2E3A" }} />
              <YAxis dataKey="skill" type="category" tick={{ fill: "#F8FAFC", fontSize: 12 }} axisLine={{ stroke: "#2E2E3A" }} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A24", border: "1px solid #2E2E3A", borderRadius: "8px", color: "#F8FAFC" }}
                formatter={(value: any, name: any, props: any) => [`${value} companies`, props.payload.hasSkill ? "✅ You have this" : "❌ You need this"]}
              />
              <Bar dataKey="demand" radius={[0, 4, 4, 0]}>
                {skillDemandData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.hasSkill ? "#22C55E" : "#EF4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <span className="text-sm text-muted-foreground">Skills you have</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-sm text-muted-foreground">Skills you need</span>
          </div>
        </div>
      </div>
    </div>
  )
}
