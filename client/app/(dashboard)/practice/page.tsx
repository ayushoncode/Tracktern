"use client"

import { useState, useMemo } from "react"
import { Code2, ExternalLink, CheckCircle, Filter, Flame, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const patterns = [
  { name: "Arrays & Hashing", problems: 9, color: "bg-blue-500/20 text-blue-400" },
  { name: "Two Pointers", problems: 5, color: "bg-purple-500/20 text-purple-400" },
  { name: "Sliding Window", problems: 6, color: "bg-green-500/20 text-green-400" },
  { name: "Stack", problems: 7, color: "bg-yellow-500/20 text-yellow-400" },
  { name: "Binary Search", problems: 7, color: "bg-orange-500/20 text-orange-400" },
  { name: "Linked List", problems: 11, color: "bg-pink-500/20 text-pink-400" },
  { name: "Trees", problems: 15, color: "bg-cyan-500/20 text-cyan-400" },
  { name: "Graphs", problems: 13, color: "bg-red-500/20 text-red-400" },
  { name: "Dynamic Programming", problems: 24, color: "bg-violet-500/20 text-violet-400" },
]

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", pattern: "Arrays & Hashing", link: "https://leetcode.com/problems/two-sum/" },
  { id: 2, title: "Valid Anagram", difficulty: "Easy", pattern: "Arrays & Hashing", link: "https://leetcode.com/problems/valid-anagram/" },
  { id: 3, title: "Contains Duplicate", difficulty: "Easy", pattern: "Arrays & Hashing", link: "https://leetcode.com/problems/contains-duplicate/" },
  { id: 4, title: "Group Anagrams", difficulty: "Medium", pattern: "Arrays & Hashing", link: "https://leetcode.com/problems/group-anagrams/" },
  { id: 5, title: "Top K Frequent Elements", difficulty: "Medium", pattern: "Arrays & Hashing", link: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { id: 6, title: "Valid Palindrome", difficulty: "Easy", pattern: "Two Pointers", link: "https://leetcode.com/problems/valid-palindrome/" },
  { id: 7, title: "3Sum", difficulty: "Medium", pattern: "Two Pointers", link: "https://leetcode.com/problems/3sum/" },
  { id: 8, title: "Container With Most Water", difficulty: "Medium", pattern: "Two Pointers", link: "https://leetcode.com/problems/container-with-most-water/" },
  { id: 9, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", pattern: "Sliding Window", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: 10, title: "Longest Substring Without Repeating", difficulty: "Medium", pattern: "Sliding Window", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: 11, title: "Minimum Window Substring", difficulty: "Hard", pattern: "Sliding Window", link: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: 12, title: "Valid Parentheses", difficulty: "Easy", pattern: "Stack", link: "https://leetcode.com/problems/valid-parentheses/" },
  { id: 13, title: "Min Stack", difficulty: "Medium", pattern: "Stack", link: "https://leetcode.com/problems/min-stack/" },
  { id: 14, title: "Daily Temperatures", difficulty: "Medium", pattern: "Stack", link: "https://leetcode.com/problems/daily-temperatures/" },
  { id: 15, title: "Binary Search", difficulty: "Easy", pattern: "Binary Search", link: "https://leetcode.com/problems/binary-search/" },
  { id: 16, title: "Search in Rotated Array", difficulty: "Medium", pattern: "Binary Search", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: 17, title: "Find Minimum in Rotated Array", difficulty: "Medium", pattern: "Binary Search", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: 18, title: "Reverse Linked List", difficulty: "Easy", pattern: "Linked List", link: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: 19, title: "Merge Two Sorted Lists", difficulty: "Easy", pattern: "Linked List", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: 20, title: "Reorder List", difficulty: "Medium", pattern: "Linked List", link: "https://leetcode.com/problems/reorder-list/" },
  { id: 21, title: "LRU Cache", difficulty: "Medium", pattern: "Linked List", link: "https://leetcode.com/problems/lru-cache/" },
  { id: 22, title: "Invert Binary Tree", difficulty: "Easy", pattern: "Trees", link: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: 23, title: "Maximum Depth of Binary Tree", difficulty: "Easy", pattern: "Trees", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: 24, title: "Level Order Traversal", difficulty: "Medium", pattern: "Trees", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: 25, title: "Validate Binary Search Tree", difficulty: "Medium", pattern: "Trees", link: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: 26, title: "Lowest Common Ancestor", difficulty: "Medium", pattern: "Trees", link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
  { id: 27, title: "Number of Islands", difficulty: "Medium", pattern: "Graphs", link: "https://leetcode.com/problems/number-of-islands/" },
  { id: 28, title: "Clone Graph", difficulty: "Medium", pattern: "Graphs", link: "https://leetcode.com/problems/clone-graph/" },
  { id: 29, title: "Course Schedule", difficulty: "Medium", pattern: "Graphs", link: "https://leetcode.com/problems/course-schedule/" },
  { id: 30, title: "Pacific Atlantic Water Flow", difficulty: "Medium", pattern: "Graphs", link: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id: 31, title: "Climbing Stairs", difficulty: "Easy", pattern: "Dynamic Programming", link: "https://leetcode.com/problems/climbing-stairs/" },
  { id: 32, title: "House Robber", difficulty: "Medium", pattern: "Dynamic Programming", link: "https://leetcode.com/problems/house-robber/" },
  { id: 33, title: "Coin Change", difficulty: "Medium", pattern: "Dynamic Programming", link: "https://leetcode.com/problems/coin-change/" },
  { id: 34, title: "Longest Common Subsequence", difficulty: "Medium", pattern: "Dynamic Programming", link: "https://leetcode.com/problems/longest-common-subsequence/" },
  { id: 35, title: "Word Break", difficulty: "Medium", pattern: "Dynamic Programming", link: "https://leetcode.com/problems/word-break/" },
]

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/20 text-green-400",
  Medium: "bg-yellow-500/20 text-yellow-400",
  Hard: "bg-red-500/20 text-red-400",
}

// Get daily problem based on day of year
const getDailyProblem = () => {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const diff = Number(new Date()) - Number(start)
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return problems[dayOfYear % problems.length]
}

// Generate heatmap data for last 52 weeks
const generateHeatmapData = (solved: number[]) => {
  const weeks = []
  const today = new Date()
  const solvedDates = JSON.parse(localStorage.getItem("tracktern_solve_dates") || "{}")

  for (let w = 51; w >= 0; w--) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (w * 7 + (6 - d)))
      const key = date.toISOString().split("T")[0]
      week.push({ date: key, count: solvedDates[key] || 0 })
    }
    weeks.push(week)
  }
  return weeks
}

const getHeatColor = (count: number) => {
  if (count === 0) return "bg-secondary"
  if (count === 1) return "bg-green-900"
  if (count === 2) return "bg-green-700"
  if (count === 3) return "bg-green-500"
  return "bg-green-400"
}

export default function PracticePage() {
  const [solved, setSolved] = useState<number[]>(() => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem("tracktern_solved") || "[]")
  })
  const [selectedPattern, setSelectedPattern] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const dailyProblem = getDailyProblem()
  const heatmapData = useMemo(() => {
    if (typeof window === "undefined") return []
    return generateHeatmapData(solved)
  }, [solved])

  const toggleSolved = (id: number) => {
    const newSolved = solved.includes(id)
      ? solved.filter(i => i !== id)
      : [...solved, id]
    setSolved(newSolved)
    localStorage.setItem("tracktern_solved", JSON.stringify(newSolved))

    // Track solve date
    if (!solved.includes(id)) {
      const today = new Date().toISOString().split("T")[0]
      const dates = JSON.parse(localStorage.getItem("tracktern_solve_dates") || "{}")
      dates[today] = (dates[today] || 0) + 1
      localStorage.setItem("tracktern_solve_dates", JSON.stringify(dates))
    }
  }

  const filtered = problems.filter(p => {
    if (selectedPattern !== "All" && p.pattern !== selectedPattern) return false
    if (selectedDifficulty !== "All" && p.difficulty !== selectedDifficulty) return false
    return true
  })

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const totalSolved = solved.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Daily Practice</h2>
          <p className="text-muted-foreground">Pattern-wise DSA problems to crack any interview</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{totalSolved}/{problems.length}</div>
          <div className="text-xs text-muted-foreground">Problems solved</div>
        </div>
      </div>

      {/* Daily Problem */}
      <div className="glass-card rounded-xl p-5 border border-primary/30 bg-primary/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-foreground">Today's Problem</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">{dailyProblem.id}. {dailyProblem.title}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{dailyProblem.pattern}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColor[dailyProblem.difficulty]}`}>
              {dailyProblem.difficulty}
            </span>
            <a href={dailyProblem.link} target="_blank" className="px-4 py-2 rounded-lg gradient-purple text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-1">
              Solve <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass-card rounded-xl p-5 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Submission Activity</h3>
          </div>
          <span className="text-sm text-muted-foreground">{totalSolved} submissions in the past year</span>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date}: ${day.count} solved`}
                    className={`w-3 h-3 rounded-sm ${getHeatColor(day.count)} transition-colors cursor-default`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Less
            {[0,1,2,3,4].map(n => (
              <div key={n} className={`w-3 h-3 rounded-sm ${getHeatColor(n)}`} />
            ))}
            More
          </div>
        </div>
      </div>

      {/* Pattern Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {patterns.map((p) => {
          const patternSolved = solved.filter(id => problems.find(pr => pr.id === id && pr.pattern === p.name)).length
          return (
            <button key={p.name} onClick={() => setSelectedPattern(selectedPattern === p.name ? "All" : p.name)}
              className={cn("glass-card rounded-xl p-3 border text-left transition-all hover:border-primary/30",
                selectedPattern === p.name ? "border-primary" : "border-border"
              )}>
              <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-2 ${p.color}`}>{p.name}</div>
              <div className="text-sm font-bold text-foreground">{patternSolved}/{p.problems}</div>
              <div className="w-full bg-secondary rounded-full h-1 mt-1">
                <div className="bg-primary rounded-full h-1 transition-all" style={{ width: `${(patternSolved/p.problems)*100}%` }} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {["All", "Easy", "Medium", "Hard"].map(d => (
          <button key={d} onClick={() => setSelectedDifficulty(d)}
            className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all",
              selectedDifficulty === d ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
            )}>
            {d}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} problems</span>
      </div>

      {/* Problems Table */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">
            {selectedPattern === "All" ? "All Problems" : selectedPattern}
          </h3>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((problem) => (
            <div key={problem.id} className={cn("flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors", problem.id === dailyProblem.id && "bg-primary/5")}>
              <button onClick={() => toggleSolved(problem.id)} className="shrink-0">
                <CheckCircle className={cn("w-5 h-5 transition-colors", solved.includes(problem.id) ? "text-green-400 fill-green-400/20" : "text-muted-foreground/30 hover:text-muted-foreground")} />
              </button>
              {problem.id === dailyProblem.id && (
                <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded shrink-0">Today</span>
              )}
              <div className="flex-1 min-w-0">
                <span className={cn("text-sm font-medium", solved.includes(problem.id) ? "line-through text-muted-foreground" : "text-foreground")}>
                  {problem.id}. {problem.title}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-muted-foreground hidden md:block">{problem.pattern}</span>
              <a href={problem.link} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
