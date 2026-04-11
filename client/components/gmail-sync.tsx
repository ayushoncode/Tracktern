"use client"

import { Mail, Clock, Plus, ChevronDown } from "lucide-react"
import { useState } from "react"
import { getToken, getCompanies, updateCompany } from "@/lib/api"
import { useEffect } from "react"

export function GmailSync() {
  const [companies, setCompanies] = useState<any[]>([])
  const [selected, setSelected] = useState("")
  const [newStatus, setNewStatus] = useState("shortlisted")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getCompanies(token).then((data) => {
      setCompanies(Array.isArray(data) ? data : [])
    })
  }, [])

  const handleUpdate = async () => {
    if (!selected) return
    setSaving(true)
    const token = getToken()!
    await updateCompany(token, selected, { status: newStatus })
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 2000)
    // refresh companies
    getCompanies(token).then((data) => {
      setCompanies(Array.isArray(data) ? data : [])
    })
  }

  return (
    <div className="glass-card rounded-xl p-5 border border-border space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Gmail Sync</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-yellow-400">
          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          Coming Soon
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium text-primary">Gmail Auto-Detection</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Auto-detect offer, rejection & interview emails from companies. Coming in next update!
        </p>
      </div>

      {/* Manual status update */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Manual Status Update
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Company</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm"
            >
              <option value="">Select company...</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} — {c.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm"
            >
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button
            onClick={handleUpdate}
            disabled={!selected || saving}
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Updating..." : saved ? "✅ Updated!" : "Update Status"}
          </button>
        </div>
      </div>

      {/* Email space placeholder */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Company Emails
        </p>
        <div className="bg-secondary/30 rounded-lg p-3 border border-dashed border-border text-center">
          <Mail className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">
            Connect Gmail to see emails from companies here
          </p>
        </div>
      </div>
    </div>
  )
}
