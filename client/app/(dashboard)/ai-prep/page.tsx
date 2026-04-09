"use client"

import { useState } from "react"
import { Sparkles, Send, CheckCircle, Clock, ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const companies = [
  { id: "1", name: "Google", role: "SWE Intern", status: "interview" },
  { id: "2", name: "Microsoft", role: "PM Intern", status: "shortlisted" },
  { id: "3", name: "Stripe", role: "Backend Intern", status: "interview" },
  { id: "4", name: "Amazon", role: "SDE Intern", status: "shortlisted" },
  { id: "5", name: "Meta", role: "ML Intern", status: "applied" },
]

const interviewQuestions = [
  "Tell me about yourself and why you want this internship.",
  "Describe a challenging project you've worked on.",
  "How do you approach debugging a complex issue?",
  "Explain your understanding of system design basics.",
  "What's your experience with version control (Git)?",
  "How do you prioritize tasks when working on multiple features?",
  "Describe a time you had a conflict with a teammate.",
  "What technologies are you most excited about?",
  "How do you stay updated with industry trends?",
  "Do you have any questions for us?",
]

const skillsToRevise = [
  { name: "Data Structures", priority: "high" },
  { name: "System Design", priority: "high" },
  { name: "SQL", priority: "medium" },
  { name: "REST APIs", priority: "medium" },
  { name: "Git Workflow", priority: "low" },
  { name: "Behavioral", priority: "high" },
]

const prepPlan = [
  {
    day: 1,
    title: "Fundamentals Review",
    tasks: ["DSA basics", "Big O notation", "Common patterns"],
  },
  {
    day: 2,
    title: "Practice & Mock",
    tasks: ["LeetCode medium", "Mock interview", "System design intro"],
  },
  {
    day: 3,
    title: "Final Prep",
    tasks: ["Behavioral questions", "Company research", "Questions to ask"],
  },
]

export default function AIprepPage() {
  const [selectedCompany, setSelectedCompany] = useState(companies[0])
  const [isLoading, setIsLoading] = useState(false)
  const [showContent, setShowContent] = useState(true)

  const handleSelectCompany = (company: typeof companies[0]) => {
    setSelectedCompany(company)
    setIsLoading(true)
    setShowContent(false)
    setTimeout(() => {
      setIsLoading(false)
      setShowContent(true)
    }, 1500)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Company List - Left Panel */}
      <div className="lg:w-72 flex-shrink-0">
        <div className="glass-card rounded-xl border border-border h-full overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Your Companies
            </h3>
          </div>
          <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100%-60px)]">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                  selectedCompany.id === company.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    selectedCompany.id === company.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {company.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{company.name}</p>
                  <p
                    className={cn(
                      "text-sm truncate",
                      selectedCompany.id === company.id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {company.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Right Panel */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              AI Prep for {selectedCompany.name}
            </h2>
            <p className="text-muted-foreground">{selectedCompany.role}</p>
          </div>
          <Button className="gradient-purple hover:opacity-90 text-primary-foreground">
            <Mail className="w-4 h-4 mr-2" />
            Generate Follow-up Email
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-5 border border-border space-y-3">
              <Skeleton className="h-6 w-48 bg-secondary" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full bg-secondary" />
              ))}
            </div>
            <div className="glass-card rounded-xl p-5 border border-border space-y-3">
              <Skeleton className="h-6 w-36 bg-secondary" />
              <div className="flex gap-2 flex-wrap">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 bg-secondary rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ) : showContent ? (
          <>
            {/* Interview Questions */}
            <div className="glass-card rounded-xl p-5 border border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-lg">Top 10 Interview Questions</span>
              </h3>
              <div className="space-y-3">
                {interviewQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-foreground text-sm">{question}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills to Revise */}
            <div className="glass-card rounded-xl p-5 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Skills to Revise</h3>
              <div className="flex flex-wrap gap-2">
                {skillsToRevise.map((skill) => (
                  <span
                    key={skill.name}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium",
                      skill.priority === "high"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : skill.priority === "medium"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30"
                    )}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* 3-Day Prep Plan */}
            <div className="glass-card rounded-xl p-5 border border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                3-Day Prep Plan
              </h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />

                <div className="space-y-6">
                  {prepPlan.map((day, index) => (
                    <div key={day.day} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium z-10">
                        {day.day}
                      </div>
                      <div className="flex-1 pb-2">
                        <h4 className="font-medium text-foreground">{day.title}</h4>
                        <ul className="mt-2 space-y-1">
                          {day.tasks.map((task, taskIndex) => (
                            <li
                              key={taskIndex}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle className="w-4 h-4 text-accent" />
                              {task}
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
        ) : null}
      </div>
    </div>
  )
}
