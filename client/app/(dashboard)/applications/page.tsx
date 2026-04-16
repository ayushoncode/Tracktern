"use client"

import { useState, useEffect } from "react"
import { Building2, Calendar, FileText, Link as LinkIcon, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getCompanies, addCompany, updateCompany, deleteCompany, getToken } from "@/lib/api"
import { COMPANY_TYPE_LABELS, COMPANY_TYPE_OPTIONS, getCompanyType, type CompanyType } from "@/lib/company-type"
import { STATUS_THEME } from "@/lib/status-theme"

const COLUMNS = [
  { id: "applied", title: "Applied" },
  { id: "shortlisted", title: "Shortlisted" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
  { id: "rejected", title: "Rejected" },
]

export default function ApplicationsPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCompany, setNewCompany] = useState("")
  const [newRole, setNewRole] = useState("")
  const [newCompanyType, setNewCompanyType] = useState<CompanyType>("product")
  const [newUrl, setNewUrl] = useState("")
  const [newDeadline, setNewDeadline] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) { window.location.href = "/"; return }
    getCompanies(token).then((data) => {
      setCompanies(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  const handleAddCompany = async () => {
    if (!newCompany || !newRole) return
    setSubmitting(true)
    const token = getToken()!
    const data = await addCompany(token, {
      name: newCompany, role: newRole,
      companyType: newCompanyType,
      jobUrl: newUrl, deadline: newDeadline, notes: newNotes,
    })
    setCompanies([data, ...companies])
    setNewCompany(""); setNewRole(""); setNewCompanyType("product"); setNewUrl(""); setNewDeadline(""); setNewNotes("")
    setIsModalOpen(false)
    setSubmitting(false)
  }

  const handleStatusChange = async (id: string, status: string) => {
    const token = getToken()!
    await updateCompany(token, id, { status })
    setCompanies(companies.map((c) => c._id === id ? { ...c, status } : c))
  }

  const handleDelete = async (id: string) => {
    const token = getToken()!
    await deleteCompany(token, id)
    setCompanies(companies.filter((c) => c._id !== id))
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-muted-foreground animate-pulse">Loading applications...</div></div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Applications</h2>
          <p className="text-muted-foreground text-sm mt-1">{companies.length} total applications</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gradient-purple hover:opacity-90 text-primary-foreground w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Add Company
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-5">
        {COLUMNS.map((col) => {
          const colCompanies = companies.filter((c) => c.status === col.id)
          const theme = STATUS_THEME[col.id as keyof typeof STATUS_THEME]
          return (
            <div key={col.id} className={`glass-card rounded-xl border min-w-0 sm:min-w-[200px] ${theme.cardClassName}`}>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${theme.dotClassName}`} />
                  <span className="text-sm font-medium text-foreground">{col.title}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{colCompanies.length}</span>
              </div>
              <div className="p-3 space-y-3 min-h-32">
                {colCompanies.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No applications here yet</p>
                )}
                {colCompanies.map((app) => (
                  <div key={app._id} className={`rounded-lg p-3 border transition-colors group ${theme.softClassName}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground shrink-0">
                        {app.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{app.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{app.role}</p>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-background/35 px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          {COMPANY_TYPE_LABELS[getCompanyType(app.companyType, app.name)]}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(app._id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(app.appliedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </div>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="text-xs bg-secondary border-none text-muted-foreground rounded cursor-pointer"
                      >
                        {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md h-full bg-card border-l border-border p-6 overflow-y-auto animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-card-foreground">Add New Company</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">Company Name *</label>
                <Input value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="e.g., Google" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">Role *</label>
                <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="e.g., SWE Intern" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">Company Type *</label>
                <select
                  value={newCompanyType}
                  onChange={(e) => setNewCompanyType(e.target.value as CompanyType)}
                  className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground"
                >
                  {COMPANY_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block"><LinkIcon className="w-4 h-4 inline mr-1" />Job URL</label>
                <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block"><Calendar className="w-4 h-4 inline mr-1" />Deadline</label>
                <Input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="bg-secondary border-border text-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block"><FileText className="w-4 h-4 inline mr-1" />Notes</label>
                <Textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Any notes about this application..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-24" />
              </div>
              <div className="pt-4 space-y-3">
                <Button onClick={handleAddCompany} disabled={submitting || !newCompany || !newRole} className="w-full gradient-purple hover:opacity-90 text-primary-foreground">
                  {submitting ? "Adding..." : "Add Application"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
