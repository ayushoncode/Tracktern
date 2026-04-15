"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bell,
  Calendar,
  CalendarPlus2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Trash2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  company: string
  type: string
  date: string
  time: string
  notes: string
}

const EVENT_TYPES = [
  "Technical Interview",
  "HR Round",
  "System Design",
  "OA / Assessment",
  "Follow-up",
  "Offer Deadline",
  "Other",
]

const TYPE_COLORS: Record<string, string> = {
  "Technical Interview": "bg-purple-500/15 text-purple-300 border-purple-500/20",
  "HR Round": "bg-blue-500/15 text-blue-300 border-blue-500/20",
  "System Design": "bg-orange-500/15 text-orange-300 border-orange-500/20",
  "OA / Assessment": "bg-yellow-500/15 text-yellow-200 border-yellow-500/20",
  "Follow-up": "bg-green-500/15 text-green-300 border-green-500/20",
  "Offer Deadline": "bg-red-500/15 text-red-300 border-red-500/20",
  Other: "bg-gray-500/15 text-gray-300 border-gray-500/20",
}

const EMPTY_FORM = {
  title: "",
  company: "",
  type: "Technical Interview",
  date: "",
  time: "10:00",
  notes: "",
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState("")
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    const saved = localStorage.getItem("tracktern_calendar")
    if (saved) setEvents(JSON.parse(saved))
  }, [])

  const save = (nextEvents: Event[]) => {
    setEvents(nextEvents)
    localStorage.setItem("tracktern_calendar", JSON.stringify(nextEvents))
  }

  const addEvent = () => {
    if (!form.title || !form.company || !form.date) return
    save([...events, { ...form, id: Date.now().toString() }])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const deleteEvent = (id: string) => {
    save(events.filter((event) => event.id !== id))
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthYear = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => event.date >= todayStr)
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
        .slice(0, 5),
    [events, todayStr]
  )

  const selectedEvents = selectedDate ? events.filter((event) => event.date === selectedDate) : []
  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("default", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : ""

  const daysWithEvents = new Set(events.map((event) => event.date))

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-primary/15 bg-[linear-gradient(135deg,rgba(124,58,237,0.18),rgba(15,15,19,0.94)_42%,rgba(6,182,212,0.12))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.16),transparent_28%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_320px]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary backdrop-blur">
              <Calendar className="h-3.5 w-3.5" />
              Interview Calendar
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Keep every interview, deadline, and follow-up in one place
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Plan your process visually, catch important dates early, and review what’s coming next without bouncing between tabs.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-[26px] border border-white/10 bg-background/55 p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Calendar snapshot</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <SnapshotCard label="Total events" value={String(events.length)} />
              <SnapshotCard label="Upcoming" value={String(upcomingEvents.length)} />
              <SnapshotCard label="This month" value={String(events.filter((event) => event.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length)} />
              <SnapshotCard label="Days booked" value={String(daysWithEvents.size)} />
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7C3AED_0%,#9061F9_45%,#06B6D4_100%)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </button>
          </div>
        </div>
      </section>

      {showForm ? (
        <section className="glass-card rounded-[28px] border border-primary/20 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Create calendar event</h2>
              <p className="mt-1 text-sm text-muted-foreground">Capture interview timing, company, and notes in one shot.</p>
            </div>
            <button onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-muted-foreground transition hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Title">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Google Round 2"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </FormField>

            <FormField label="Company">
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Google"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </FormField>

            <FormField label="Type">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Date">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </FormField>

              <FormField label="Time">
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </FormField>
            </div>
          </div>

          <FormField label="Notes" className="mt-4">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Add preparation notes, interviewer details, links, or reminders..."
              className="min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </FormField>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={addEvent}
              disabled={!form.title || !form.company || !form.date}
              className="flex-1 rounded-2xl bg-[linear-gradient(135deg,#7C3AED_0%,#9061F9_45%,#06B6D4_100%)] px-4 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to calendar
            </button>
            <button
              onClick={() => setForm(EMPTY_FORM)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-white/8"
            >
              Reset
            </button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <section className="glass-card rounded-[28px] border border-white/8 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="rounded-xl border border-white/10 bg-white/5 p-2 text-muted-foreground transition hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Schedule view</p>
              <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">{monthYear}</h2>
            </div>
            <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="rounded-xl border border-white/10 bg-white/5 p-2 text-muted-foreground transition hover:text-foreground">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:text-xs">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const dayEvents = events.filter((event) => event.date === dateStr)
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDate

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? "" : dateStr)}
                  className={cn(
                    "min-h-[58px] rounded-2xl border p-2 text-left transition sm:min-h-[82px]",
                    isSelected
                      ? "border-primary bg-primary/15 shadow-[0_0_0_1px_rgba(124,58,237,0.18)]"
                      : isToday
                        ? "border-primary/30 bg-primary/8"
                        : "border-white/8 bg-white/3 hover:bg-white/6"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className={cn("text-xs font-bold sm:text-sm", isSelected ? "text-primary" : "text-foreground")}>{day}</span>
                    {isToday ? <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">Today</span> : null}
                  </div>

                  {dayEvents.length ? (
                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div key={event.id} className="truncate rounded-md bg-white/6 px-2 py-1 text-[10px] text-muted-foreground sm:text-[11px]">
                          {event.company}
                        </div>
                      ))}
                      {dayEvents.length > 2 ? (
                        <p className="text-[10px] font-medium text-primary sm:text-[11px]">+{dayEvents.length - 2} more</p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground/50">
                      <div className="h-1.5 w-1.5 rounded-full bg-white/12" />
                      Open
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="glass-card rounded-[28px] border border-white/8 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
            <div className="mb-4 flex items-center gap-2">
              {selectedDate ? (
                <>
                  <CalendarPlus2 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-foreground">Selected day</h3>
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-foreground">Upcoming events</h3>
                </>
              )}
            </div>

            {selectedDate ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">{selectedDateLabel}</p>
                {selectedEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
                ) : (
                  selectedEvents.map((event) => (
                    <EventCard key={event.id} event={event} onDelete={deleteEvent} />
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming events yet. Add one to get started.</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} onDelete={deleteEvent} compact />
                  ))
                )}
              </div>
            )}
          </div>

          <div className="glass-card rounded-[28px] border border-white/8 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-foreground">Planner stats</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatBox label="Events" value={String(events.length)} />
              <StatBox label="Upcoming" value={String(upcomingEvents.length)} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function FormField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function SnapshotCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black text-foreground">{value}</p>
    </div>
  )
}

function StatBox({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black text-primary">{value}</p>
    </div>
  )
}

function EventCard({
  event,
  onDelete,
  compact = false,
}: {
  event: Event
  onDelete: (id: string) => void
  compact?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{event.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{event.company}</p>
        </div>
        <button onClick={() => onDelete(event.id)} className="shrink-0 rounded-lg p-1 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium", TYPE_COLORS[event.type])}>
          {event.type}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[11px] text-muted-foreground">
          <Clock3 className="h-3 w-3" />
          {event.time}
        </span>
      </div>

      {!compact && event.notes ? (
        <p className="mt-3 text-xs leading-6 text-muted-foreground">{event.notes}</p>
      ) : null}
    </div>
  )
}
