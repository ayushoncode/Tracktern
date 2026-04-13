"use client"
import { useState, useEffect } from "react"
import { Calendar, Plus, X, Bell, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Event { id: string; title: string; company: string; type: string; date: string; time: string; notes: string }
const EVENT_TYPES = ["Technical Interview","HR Round","System Design","OA / Assessment","Follow-up","Offer Deadline","Other"]
const TYPE_COLORS: Record<string,string> = {
  "Technical Interview":"bg-purple-500/20 text-purple-400 border-purple-500/20",
  "HR Round":"bg-blue-500/20 text-blue-400 border-blue-500/20",
  "System Design":"bg-orange-500/20 text-orange-400 border-orange-500/20",
  "OA / Assessment":"bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  "Follow-up":"bg-green-500/20 text-green-400 border-green-500/20",
  "Offer Deadline":"bg-red-500/20 text-red-400 border-red-500/20",
  "Other":"bg-gray-500/20 text-gray-400 border-gray-500/20",
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState("")
  const [form, setForm] = useState({title:"",company:"",type:"Technical Interview",date:"",time:"10:00",notes:""})

  useEffect(() => {
    const saved = localStorage.getItem("tracktern_calendar")
    if (saved) setEvents(JSON.parse(saved))
  }, [])

  const save = (evts: Event[]) => { setEvents(evts); localStorage.setItem("tracktern_calendar", JSON.stringify(evts)) }
  const addEvent = () => {
    if (!form.title || !form.company || !form.date) return
    save([...events, {...form, id: Date.now().toString()}])
    setForm({title:"",company:"",type:"Technical Interview",date:"",time:"10:00",notes:""})
    setShowForm(false)
  }
  const deleteEvent = (id: string) => save(events.filter(e => e.id !== id))

  const year = currentDate.getFullYear(), month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month+1, 0).getDate()
  const monthYear = currentDate.toLocaleString("default", {month:"long",year:"numeric"})
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`
  const upcomingEvents = events.filter(e => e.date >= todayStr).sort((a,b) => a.date.localeCompare(b.date)).slice(0,5)
  const selectedEvents = selectedDate ? events.filter(e => e.date === selectedDate) : []

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Calendar className="w-6 h-6 text-primary" /> Interview Calendar</h2><p className="text-muted-foreground mt-1">Schedule interviews, deadlines and reminders</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-purple text-primary-foreground font-bold text-sm hover:opacity-90"><Plus className="w-4 h-4" /> Add Event</button>
      </div>
      {showForm && <div className="glass-card rounded-2xl border border-primary/30 p-6 space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-bold text-foreground">Add Event</h3><button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label><input value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="e.g. Google Round 2" className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Company</label><input value={form.company} onChange={e => setForm({...form,company:e.target.value})} placeholder="e.g. Google" className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label><select value={form.type} onChange={e => setForm({...form,type:e.target.value})} className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm">{EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label><input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" /></div>
            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Time</label><input type="time" value={form.time} onChange={e => setForm({...form,time:e.target.value})} className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm" /></div>
          </div>
        </div>
        <textarea value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} placeholder="Notes..." className="w-full h-16 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <button onClick={addEvent} disabled={!form.title||!form.company||!form.date} className="w-full py-3 rounded-xl gradient-purple text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50">Add to Calendar</button>
      </div>}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentDate(new Date(year,month-1))} className="p-1.5 rounded-lg hover:bg-secondary"><ChevronLeft className="w-5 h-5 text-muted-foreground" /></button>
            <h3 className="font-bold text-foreground">{monthYear}</h3>
            <button onClick={() => setCurrentDate(new Date(year,month+1))} className="p-1.5 rounded-lg hover:bg-secondary"><ChevronRight className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({length:firstDay}).map((_,i) => <div key={`e${i}`} />)}
            {Array.from({length:daysInMonth},(_,i) => i+1).map(day => {
              const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
              const dayEvents = events.filter(e => e.date === dateStr)
              const isToday = dateStr === todayStr, isSelected = dateStr === selectedDate
              return <button key={day} onClick={() => setSelectedDate(isSelected ? "" : dateStr)} className={cn("relative p-2 rounded-xl text-sm font-medium transition-all min-h-[44px] flex flex-col items-center", isSelected ? "bg-primary text-primary-foreground" : isToday ? "bg-primary/20 text-primary border border-primary/30" : "hover:bg-secondary text-foreground")}>
                <span>{day}</span>
                {dayEvents.length > 0 && <div className="flex gap-0.5 mt-0.5">{dayEvents.slice(0,3).map((_,i) => <div key={i} className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-primary")} />)}</div>}
              </button>
            })}
          </div>
        </div>
        <div className="space-y-4">
          {selectedDate ? <div className="glass-card rounded-2xl border border-border p-4">
            <h4 className="font-bold text-foreground mb-3 text-sm">{new Date(selectedDate+"T00:00:00").toLocaleDateString("default",{weekday:"long",month:"short",day:"numeric"})}</h4>
            {selectedEvents.length === 0 ? <p className="text-xs text-muted-foreground">No events.</p> : selectedEvents.map(ev => <div key={ev.id} className="mb-3 p-3 rounded-xl bg-secondary/50 border border-border">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{ev.title}</p><p className="text-xs text-muted-foreground">{ev.company} · {ev.time}</p><span className={cn("inline-block mt-1 text-xs px-2 py-0.5 rounded-full border font-medium", TYPE_COLORS[ev.type])}>{ev.type}</span>{ev.notes && <p className="text-xs text-muted-foreground mt-1">{ev.notes}</p>}</div>
                <button onClick={() => deleteEvent(ev.id)} className="text-muted-foreground hover:text-red-400 shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>)}
          </div> : <div className="glass-card rounded-2xl border border-border p-4">
            <h4 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Upcoming</h4>
            {upcomingEvents.length === 0 ? <p className="text-xs text-muted-foreground">No upcoming events.</p> : upcomingEvents.map(ev => <div key={ev.id} className="flex items-start gap-3 mb-3 pb-3 border-b border-border last:border-0 last:mb-0 last:pb-0">
              <div className="text-center shrink-0"><div className="text-xs font-black text-primary">{new Date(ev.date+"T00:00:00").toLocaleDateString("default",{month:"short"}).toUpperCase()}</div><div className="text-lg font-black text-foreground leading-none">{new Date(ev.date+"T00:00:00").getDate()}</div></div>
              <div className="flex-1 min-w-0"><p className="text-xs font-medium text-foreground truncate">{ev.title}</p><p className="text-xs text-muted-foreground">{ev.company} · {ev.time}</p><span className={cn("text-xs px-1.5 py-0.5 rounded-full border font-medium", TYPE_COLORS[ev.type])}>{ev.type}</span></div>
            </div>)}
          </div>}
          <div className="glass-card rounded-xl border border-border p-4"><h4 className="font-bold text-foreground mb-2 text-sm">Total Events</h4><div className="text-3xl font-black text-primary">{events.length}</div><div className="text-xs text-muted-foreground">{upcomingEvents.length} upcoming</div></div>
        </div>
      </div>
    </div>
  )
}
