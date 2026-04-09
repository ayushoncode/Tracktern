"use client"

import { useState } from "react"
import { Plus, Mail, Calendar, X, Link as LinkIcon, FileText, ToggleLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Application {
  id: string
  company: string
  role: string
  dateApplied: string
  hasEmail: boolean
}

interface Column {
  id: string
  title: string
  color: string
  applications: Application[]
}

const initialColumns: Column[] = [
  {
    id: "applied",
    title: "Applied",
    color: "bg-blue-500",
    applications: [
      { id: "1", company: "Google", role: "SWE Intern", dateApplied: "Apr 5", hasEmail: true },
      { id: "2", company: "Meta", role: "ML Intern", dateApplied: "Apr 4", hasEmail: false },
      { id: "3", company: "Apple", role: "iOS Intern", dateApplied: "Apr 3", hasEmail: true },
    ],
  },
  {
    id: "shortlisted",
    title: "Shortlisted",
    color: "bg-yellow-500",
    applications: [
      { id: "4", company: "Microsoft", role: "PM Intern", dateApplied: "Mar 28", hasEmail: true },
      { id: "5", company: "Amazon", role: "SDE Intern", dateApplied: "Mar 25", hasEmail: true },
    ],
  },
  {
    id: "interview",
    title: "Interview",
    color: "bg-primary",
    applications: [
      { id: "6", company: "Stripe", role: "Backend Intern", dateApplied: "Mar 20", hasEmail: true },
      { id: "7", company: "Swiggy", role: "Full Stack", dateApplied: "Mar 18", hasEmail: false },
    ],
  },
  {
    id: "offer",
    title: "Offer",
    color: "bg-green-500",
    applications: [
      { id: "8", company: "Razorpay", role: "Full Stack", dateApplied: "Mar 10", hasEmail: true },
    ],
  },
  {
    id: "rejected",
    title: "Rejected",
    color: "bg-red-500",
    applications: [
      { id: "9", company: "Netflix", role: "Data Intern", dateApplied: "Mar 5", hasEmail: true },
    ],
  },
]

export default function ApplicationsPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draggedApp, setDraggedApp] = useState<{ app: Application; fromColumnId: string } | null>(null)

  const [newCompany, setNewCompany] = useState("")
  const [newRole, setNewRole] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [newDeadline, setNewDeadline] = useState("")
  const [newNotes, setNewNotes] = useState("")

  const handleDragStart = (app: Application, columnId: string) => {
    setDraggedApp({ app, fromColumnId: columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (toColumnId: string) => {
    if (!draggedApp) return

    const { app, fromColumnId } = draggedApp

    if (fromColumnId === toColumnId) {
      setDraggedApp(null)
      return
    }

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, applications: col.applications.filter((a) => a.id !== app.id) }
        }
        if (col.id === toColumnId) {
          return { ...col, applications: [...col.applications, app] }
        }
        return col
      })
    )

    setDraggedApp(null)
  }

  const handleAddCompany = () => {
    if (!newCompany || !newRole) return

    const newApp: Application = {
      id: Date.now().toString(),
      company: newCompany,
      role: newRole,
      dateApplied: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      hasEmail: false,
    }

    setColumns((prev) =>
      prev.map((col) =>
        col.id === "applied"
          ? { ...col, applications: [newApp, ...col.applications] }
          : col
      )
    )

    setNewCompany("")
    setNewRole("")
    setNewUrl("")
    setNewDeadline("")
    setNewNotes("")
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Applications</h2>
          <p className="text-muted-foreground text-sm">Track your internship applications</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gradient-purple hover:opacity-90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-72"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("w-3 h-3 rounded-full", column.color)} />
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <span className="text-muted-foreground text-sm">
                ({column.applications.length})
              </span>
            </div>

            {/* Column Content */}
            <div className="space-y-3 min-h-[400px] p-3 rounded-xl bg-secondary/30 border border-border">
              {column.applications.map((app) => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={() => handleDragStart(app, column.id)}
                  className="glass-card rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground">
                      {app.company.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{app.company}</p>
                      <p className="text-sm text-muted-foreground truncate">{app.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {app.dateApplied}
                    </div>
                    {app.hasEmail && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Mail className="w-3 h-3" />
                        Synced
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Panel */}
          <div className="relative w-full max-w-md h-full bg-card border-l border-border p-6 overflow-y-auto animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-card-foreground">Add New Company</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Company Name
                </label>
                <Input
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g., Google"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Role
                </label>
                <Input
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g., SWE Intern"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  <LinkIcon className="w-4 h-4 inline mr-1" />
                  Job URL
                </label>
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Deadline
                </label>
                <Input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Notes
                </label>
                <Textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Any notes about this application..."
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-24"
                />
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">Connect Gmail for auto-detection</span>
                </div>
                <ToggleLeft className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleAddCompany}
                  className="w-full gradient-purple hover:opacity-90 text-primary-foreground"
                >
                  Add Application
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
                >
                  Generate AI Prep
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
