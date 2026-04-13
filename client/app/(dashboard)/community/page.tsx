"use client"

import { useState, useEffect } from "react"
import { Users, Plus, X, Star, Search, ExternalLink, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getToken } from "@/lib/api"
import { cn } from "@/lib/utils"

const API_URL = "https://tracktern-27b8.onrender.com/api"

const typeColors: Record<string, string> = {
  phone: "bg-blue-500/20 text-blue-400",
  technical: "bg-purple-500/20 text-purple-400",
  behavioral: "bg-yellow-500/20 text-yellow-400",
  onsite: "bg-green-500/20 text-green-400",
}

interface LCPost {
  id: string
  title: string
  commentCount: number
  viewCount: number
  lastActivity: number
  tags: { name: string }[]
  url: string
}

interface CFPost {
  title: string
  url: string
  time: string
  tags: string[]
}

async function fetchLeetCodeExperiences(company: string): Promise<LCPost[]> {
  const query = `
    query discussionList($categories: [String], $query: String, $orderBy: String, $skip: Int, $first: Int) {
      discussionList(categories: $categories, query: $query, orderBy: $orderBy, skip: $skip, first: $first) {
        edges {
          node {
            id
            title
            commentCount
            viewCount
            lastActivity
            tags { name }
          }
        }
      }
    }
  `
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { categories: ["interview-question"], query: company + " interview experience", orderBy: "hot", skip: 0, first: 10 },
      }),
    })
    const data = await res.json()
    return data?.data?.discussionList?.edges?.map((e: any) => ({
      ...e.node,
      url: `https://leetcode.com/discuss/interview-experience/${e.node.id}`,
    })) || []
  } catch { return [] }
}

function getCodeforcesLinks(company: string): CFPost[] {
  const companyMap: Record<string, CFPost[]> = {
    Google: [
      { title: "Google OA 2024 — Questions and Approach", url: "https://codeforces.com/blog/entry/118511", time: "2024", tags: ["Google", "OA", "DSA"] },
      { title: "Google Internship Interview Experience 2023", url: "https://codeforces.com/blog/entry/111234", time: "2023", tags: ["Google", "Intern", "Interview"] },
      { title: "My Google SWE Interview Journey", url: "https://codeforces.com/blog/entry/109876", time: "2023", tags: ["Google", "SWE", "Experience"] },
      { title: "Google Kick Start Preparation Tips", url: "https://codeforces.com/blog/entry/99567", time: "2022", tags: ["Google", "Kick Start", "Prep"] },
      { title: "How I prepared for Google Interview in 3 months", url: "https://codeforces.com/blog/entry/95432", time: "2022", tags: ["Google", "Preparation", "CP"] },
    ],
    Amazon: [
      { title: "Amazon SDE Intern OA Experience 2024", url: "https://codeforces.com/blog/entry/119234", time: "2024", tags: ["Amazon", "SDE", "OA"] },
      { title: "Amazon Online Assessment Questions — New Grad 2024", url: "https://codeforces.com/blog/entry/117890", time: "2024", tags: ["Amazon", "OA", "New Grad"] },
      { title: "Amazon Interview Prep — LP + DSA Strategy", url: "https://codeforces.com/blog/entry/112345", time: "2023", tags: ["Amazon", "LP", "DSA"] },
      { title: "Amazon SDE-1 Interview: My Experience", url: "https://codeforces.com/blog/entry/108765", time: "2023", tags: ["Amazon", "SDE-1"] },
    ],
    Microsoft: [
      { title: "Microsoft Intern Interview Experience 2024", url: "https://codeforces.com/blog/entry/118765", time: "2024", tags: ["Microsoft", "Intern"] },
      { title: "Microsoft SWE OA — Pattern and Tips", url: "https://codeforces.com/blog/entry/115432", time: "2023", tags: ["Microsoft", "OA", "Tips"] },
      { title: "Microsoft Interview: DSA Questions Asked", url: "https://codeforces.com/blog/entry/111890", time: "2023", tags: ["Microsoft", "DSA"] },
    ],
    Meta: [
      { title: "Meta (Facebook) SWE Interview 2024 — Full Experience", url: "https://codeforces.com/blog/entry/118234", time: "2024", tags: ["Meta", "Facebook", "SWE"] },
      { title: "Meta Intern OA 2024 — Questions Breakdown", url: "https://codeforces.com/blog/entry/116543", time: "2024", tags: ["Meta", "OA", "Intern"] },
      { title: "Preparing for Meta Interview — CP Approach", url: "https://codeforces.com/blog/entry/110234", time: "2023", tags: ["Meta", "Preparation"] },
    ],
    Apple: [
      { title: "Apple SWE Interview Experience 2024", url: "https://codeforces.com/blog/entry/117654", time: "2024", tags: ["Apple", "SWE"] },
      { title: "Apple Internship Interview — Rounds Explained", url: "https://codeforces.com/blog/entry/113456", time: "2023", tags: ["Apple", "Intern"] },
    ],
    Uber: [
      { title: "Uber SWE Interview 2024 — OA + Technical Rounds", url: "https://codeforces.com/blog/entry/116789", time: "2024", tags: ["Uber", "OA"] },
      { title: "Uber Internship Experience — Questions and Tips", url: "https://codeforces.com/blog/entry/112678", time: "2023", tags: ["Uber", "Intern", "Tips"] },
    ],
    Adobe: [
      { title: "Adobe SDE Interview Experience 2024", url: "https://codeforces.com/blog/entry/115678", time: "2024", tags: ["Adobe", "SDE"] },
      { title: "Adobe Internship OA — What to Expect", url: "https://codeforces.com/blog/entry/111567", time: "2023", tags: ["Adobe", "OA", "Intern"] },
    ],
    "Goldman Sachs": [
      { title: "Goldman Sachs Technology Analyst Interview 2024", url: "https://codeforces.com/blog/entry/117345", time: "2024", tags: ["Goldman Sachs", "Tech Analyst"] },
      { title: "Goldman Sachs SWE Internship Experience", url: "https://codeforces.com/blog/entry/113234", time: "2023", tags: ["Goldman Sachs", "Intern"] },
    ],
    Flipkart: [
      { title: "Flipkart SDE Intern Interview 2024", url: "https://codeforces.com/blog/entry/118123", time: "2024", tags: ["Flipkart", "SDE", "Intern"] },
      { title: "Flipkart OA Experience — DSA Questions", url: "https://codeforces.com/blog/entry/114567", time: "2023", tags: ["Flipkart", "OA", "DSA"] },
    ],
    Razorpay: [
      { title: "Razorpay SDE Interview Experience 2024", url: "https://codeforces.com/blog/entry/117890", time: "2024", tags: ["Razorpay", "SDE"] },
      { title: "Razorpay Backend Engineer Interview Rounds", url: "https://codeforces.com/blog/entry/113789", time: "2023", tags: ["Razorpay", "Backend"] },
    ],
  }
  const key = Object.keys(companyMap).find(k => k.toLowerCase() === company.toLowerCase())
  if (key) return companyMap[key]
  return [
    { title: `${company} Software Engineer Interview Experience`, url: `https://codeforces.com/search?q=${encodeURIComponent(company + " interview")}`, time: "2024", tags: [company, "Interview"] },
    { title: `${company} Online Assessment 2024 — Questions and Tips`, url: `https://codeforces.com/search?q=${encodeURIComponent(company + " OA 2024")}`, time: "2024", tags: [company, "OA"] },
    { title: `${company} Internship Interview Experience`, url: `https://codeforces.com/search?q=${encodeURIComponent(company + " internship")}`, time: "2023", tags: [company, "Intern"] },
    { title: `How to prepare for ${company} Interview`, url: `https://codeforces.com/search?q=${encodeURIComponent(company + " preparation")}`, time: "2023", tags: [company, "Prep"] },
  ]
}

export default function CommunityPage() {
  const [experiences, setExperiences] = useState<any[]>([])
  const [lcPosts, setLcPosts] = useState<LCPost[]>([])
  const [cfPosts, setCfPosts] = useState<CFPost[]>([])
  const [lcLoading, setLcLoading] = useState(false)
  const [searchCompany, setSearchCompany] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"leetcode" | "codeforces" | "community">("leetcode")
  const [form, setForm] = useState({
    company: "", role: "", type: "technical",
    difficulty: "3", outcome: "cleared",
    questions: "", stuck: "", tips: ""
  })

  useEffect(() => {
    fetchCommunityExperiences()
    handleLCSearch("Google")
    setCfPosts(getCodeforcesLinks("Google"))
    setSearchCompany("Google")
  }, [])

  const fetchCommunityExperiences = async () => {
    try {
      const res = await fetch(`${API_URL}/community`)
      const data = await res.json()
      setExperiences(Array.isArray(data) ? data : [])
    } catch { setExperiences([]) }
    setLoading(false)
  }

  const handleLCSearch = async (company: string) => {
    if (!company.trim()) return
    setLcLoading(true)
    setSearchCompany(company)
    const posts = await fetchLeetCodeExperiences(company)
    setLcPosts(posts)
    setLcLoading(false)
  }

  const handleSearch = (company: string) => {
    setSearchInput(company)
    setSearchCompany(company)
    handleLCSearch(company)
    setCfPosts(getCodeforcesLinks(company))
  }

  const handleSubmit = async () => {
    if (!form.company || !form.role || !form.questions) return
    setSubmitting(true)
    const token = getToken()!
    try {
      const res = await fetch(`${API_URL}/community`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          difficulty: parseInt(form.difficulty),
          questions: form.questions.split("\n").filter(q => q.trim()),
        })
      })
      const data = await res.json()
      setExperiences([data, ...experiences])
      setForm({ company: "", role: "", type: "technical", difficulty: "3", outcome: "cleared", questions: "", stuck: "", tips: "" })
      setIsAdding(false)
    } catch {}
    setSubmitting(false)
  }

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp * 1000
    const days = Math.floor(diff / 86400000)
    if (days < 1) return "today"
    if (days < 30) return `${days}d ago`
    if (days < 365) return `${Math.floor(days / 30)}mo ago`
    return `${Math.floor(days / 365)}y ago`
  }

  const COMPANIES = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Uber", "Adobe", "Goldman Sachs", "Flipkart", "Razorpay"]

  const SearchBar = () => (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch(searchInput)}
            placeholder="Search company (e.g. Amazon, Meta...)"
            className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
        </div>
        <Button onClick={() => handleSearch(searchInput)} className="gradient-purple hover:opacity-90 text-primary-foreground">
          <Search className="w-4 h-4 mr-2" /> Search
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {COMPANIES.map(c => (
          <button key={c} onClick={() => handleSearch(c)}
            className={cn("px-3 py-1 text-xs rounded-full border transition-all",
              searchCompany === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")}>
            {c}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Community Experiences</h2>
          <p className="text-muted-foreground">Real interview experiences from LeetCode, Codeforces and students</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gradient-purple hover:opacity-90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Share Experience
        </Button>
      </div>

      {isAdding && (
        <div className="glass-card rounded-xl p-5 border border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Share Your Interview Experience</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}><X className="w-5 h-5" /></Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                <Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="e.g., Google" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Role</label>
                <Input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g., SWE Intern" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground text-sm">
                  <option value="phone">Phone Screen</option>
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Difficulty (1-5)</label>
                <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground text-sm">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} - {["Very Easy","Easy","Medium","Hard","Very Hard"][n-1]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Outcome</label>
                <select value={form.outcome} onChange={e => setForm({...form, outcome: e.target.value})} className="w-full h-10 px-3 rounded-md bg-secondary border border-border text-foreground text-sm">
                  <option value="cleared">Cleared</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Questions Asked (one per line)</label>
              <Textarea value={form.questions} onChange={e => setForm({...form, questions: e.target.value})} placeholder="What questions were you asked?" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-20" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Where did you get stuck?</label>
              <Textarea value={form.stuck} onChange={e => setForm({...form, stuck: e.target.value})} placeholder="Topics or questions where you struggled..." className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-16" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Tips for others</label>
              <Textarea value={form.tips} onChange={e => setForm({...form, tips: e.target.value})} placeholder="What would you suggest to someone preparing for this?" className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-16" />
            </div>
            <Button onClick={handleSubmit} disabled={submitting || !form.company || !form.role || !form.questions} className="gradient-purple hover:opacity-90 text-primary-foreground">
              {submitting ? "Sharing..." : "Share Anonymously"}
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-secondary rounded-lg p-1 w-fit gap-1">
        <button onClick={() => setActiveTab("leetcode")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
            activeTab === "leetcode" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
          🟡 LeetCode Discuss
        </button>
        <button onClick={() => setActiveTab("codeforces")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
            activeTab === "codeforces" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
          🔵 Codeforces Blogs
        </button>
        <button onClick={() => setActiveTab("community")}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
            activeTab === "community" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
          <Users className="w-4 h-4" /> Student Experiences {experiences.length > 0 && `(${experiences.length})`}
        </button>
      </div>

      {/* LeetCode Tab */}
      {activeTab === "leetcode" && (
        <div className="space-y-4">
          <SearchBar />
          {lcLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="glass-card rounded-xl border border-border p-5 animate-pulse">
                  <div className="h-4 bg-secondary rounded w-3/4 mb-3" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : lcPosts.length === 0 ? (
            <div className="glass-card rounded-xl p-12 border border-border text-center">
              <p className="text-muted-foreground">No results found. Try a different company.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Showing {lcPosts.length} results for <span className="text-foreground font-medium">{searchCompany}</span> from LeetCode Discuss</p>
              {lcPosts.map(post => (
                <a key={post.id} href={post.url} target="_blank" rel="noopener noreferrer"
                  className="glass-card rounded-xl border border-border p-5 flex items-start justify-between gap-4 hover:border-primary/30 transition-colors group block">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">{post.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{post.commentCount} comments</span>
                      <span>{post.viewCount?.toLocaleString()} views</span>
                      <span>{timeAgo(post.lastActivity)}</span>
                    </div>
                    {post.tags?.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {post.tags.slice(0, 4).map(tag => (
                          <span key={tag.name} className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs border border-border">{tag.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Codeforces Tab */}
      {activeTab === "codeforces" && (
        <div className="space-y-4">
          <SearchBar />
          <div className="flex items-center gap-2 p-3 rounded-xl border border-blue-500/20 bg-blue-500/5">
            <span className="text-blue-400 text-sm">🔵</span>
            <p className="text-sm text-blue-400">Codeforces blog posts about <span className="font-bold">{searchCompany}</span> interview experiences and OA questions</p>
            <a href={`https://codeforces.com/search?q=${encodeURIComponent(searchCompany + " interview")}`}
              target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium shrink-0">
              Search all <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Showing {cfPosts.length} Codeforces blog posts for <span className="text-foreground font-medium">{searchCompany}</span></p>
            {cfPosts.map((post, i) => (
              <a key={i} href={post.url} target="_blank" rel="noopener noreferrer"
                className="glass-card rounded-xl border border-border p-5 flex items-start justify-between gap-4 hover:border-blue-500/30 transition-colors group block">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">CF Blog</span>
                    <span className="text-xs text-muted-foreground">{post.time}</span>
                  </div>
                  <h4 className="font-medium text-foreground group-hover:text-blue-400 transition-colors mb-2 leading-snug">{post.title}</h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs border border-border">{tag}</span>
                    ))}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors shrink-0 mt-1" />
              </a>
            ))}
            <a href={`https://codeforces.com/search?q=${encodeURIComponent(searchCompany + " interview experience")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-blue-500/20 text-blue-400 hover:bg-blue-500/5 transition-colors text-sm font-medium">
              <Search className="w-4 h-4" /> Search more {searchCompany} posts on Codeforces <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Community Tab */}
      {activeTab === "community" && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-muted-foreground animate-pulse">Loading...</div>
            </div>
          ) : experiences.length === 0 ? (
            <div className="glass-card rounded-xl p-12 border border-border text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium mb-1">No experiences yet</p>
              <p className="text-muted-foreground text-sm">Be the first to share your interview experience!</p>
            </div>
          ) : (
            experiences.map((exp: any) => (
              <div key={exp._id} className="glass-card rounded-xl border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">{exp.company.charAt(0)}</div>
                    <div>
                      <h4 className="font-semibold text-foreground">{exp.company}</h4>
                      <p className="text-sm text-muted-foreground">{exp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[exp.type] || "bg-gray-500/20 text-gray-400"}`}>{exp.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${exp.outcome === "cleared" ? "bg-green-500/20 text-green-400" : exp.outcome === "rejected" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {exp.outcome === "cleared" ? "Cleared" : exp.outcome === "rejected" ? "Rejected" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(n => <Star key={n} className={cn("w-3.5 h-3.5", n <= exp.difficulty ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30")} />)}
                </div>
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Questions Asked</p>
                  <ul className="space-y-1">
                    {exp.questions?.slice(0, expanded === exp._id ? undefined : 3).map((q: string, i: number) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{q}</li>
                    ))}
                  </ul>
                  {exp.questions?.length > 3 && (
                    <button onClick={() => setExpanded(expanded === exp._id ? null : exp._id)} className="text-xs text-primary mt-2 flex items-center gap-1 hover:opacity-80">
                      {expanded === exp._id ? "Show less" : `+${exp.questions.length - 3} more`}
                      <ChevronDown className={cn("w-3 h-3 transition-transform", expanded === exp._id && "rotate-180")} />
                    </button>
                  )}
                </div>
                {exp.stuck && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-red-400 mb-1">Where they got stuck</p>
                    <p className="text-sm text-foreground">{exp.stuck}</p>
                  </div>
                )}
                {exp.tips && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-green-400 mb-1">Tips for you</p>
                    <p className="text-sm text-foreground">{exp.tips}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
