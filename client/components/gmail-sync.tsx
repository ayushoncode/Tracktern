"use client"

import { Mail, Clock } from "lucide-react"
import { useState } from "react"
import { getToken, getCompanies, updateCompany } from "@/lib/api"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/empty-state"

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
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(124,58,237,0.1)] text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <CardTitle className="section-heading">Gmail Sync</CardTitle>
            </div>
            <CardDescription className="body-copy mt-2">
              Track status updates manually now, with automatic email parsing coming next.
            </CardDescription>
          </div>
          <Badge variant="shortlisted">Coming soon</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A24] p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Auto-detect interview, offer, and rejection emails</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Gmail parsing is on the roadmap. Use the updater below to keep your pipeline accurate until then.
          </p>
        </div>

        <div className="space-y-3">
          <p className="label-caption">Manual Status Update</p>
          <div>
            <label className="mb-2 block text-sm text-foreground">Company</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="h-9 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-card px-3 text-sm text-foreground"
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
            <label className="mb-2 block text-sm text-foreground">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="h-9 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-card px-3 text-sm text-foreground"
            >
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <Button onClick={handleUpdate} disabled={!selected || saving} className="w-full">
            {saving ? "Updating..." : saved ? "✅ Updated!" : "Update Status"}
          </Button>
        </div>

        <div>
          <p className="label-caption mb-3">Company Emails</p>
          <EmptyState
            icon={Mail}
            title="No synced emails yet"
            subtitle="Connect Gmail in a future release to automatically surface recruiter and company email updates here."
          />
        </div>
      </CardContent>
    </Card>
  )
}
