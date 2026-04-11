"use client"

import { useState, useEffect } from "react"
import { Code2, CheckCircle, SkipForward, AlertCircle, Flame, ExternalLink, Trophy, Target, Calendar, ChevronRight, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface Problem {
  title: string
  titleSlug: string
  difficulty: string
  topics: string[]
  companies: string[]
  link: string
}

const FALLBACK_PROBLEMS: Problem[] = [
  { title: "Two Sum", titleSlug: "two-sum", difficulty: "Easy", topics: ["Array", "Hash Table"], companies: ["Google", "Amazon", "Microsoft"], link: "https://leetcode.com/problems/two-sum/" },
  { title: "Best Time to Buy and Sell Stock", titleSlug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", topics: ["Array", "Dynamic Programming"], companies: ["Amazon", "Facebook", "Goldman Sachs"], link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { title: "Contains Duplicate", titleSlug: "contains-duplicate", difficulty: "Easy", topics: ["Array", "Hash Table", "Sorting"], companies: ["Apple", "Airbnb"], link: "https://leetcode.com/problems/contains-duplicate/" },
  { title: "Longest Substring Without Repeating Characters", titleSlug: "longest-substring-without-repeating-characters", difficulty: "Medium", topics: ["String", "Sliding Window"], companies: ["Amazon", "Google", "Bloomberg"], link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { title: "3Sum", titleSlug: "3sum", difficulty: "Medium", topics: ["Array", "Two Pointers", "Sorting"], companies: ["Amazon", "Microsoft", "Adobe"], link: "https://leetcode.com/problems/3sum/" },
  { title: "Binary Tree Level Order Traversal", titleSlug: "binary-tree-level-order-traversal", difficulty: "Medium", topics: ["Tree", "BFS"], companies: ["Facebook", "Amazon", "Microsoft"], link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { title: "Maximum Depth of Binary Tree", titleSlug: "maximum-depth-of-binary-tree", difficulty: "Easy", topics: ["Tree", "DFS", "Recursion"], companies: ["LinkedIn", "Google"], link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { title: "Merge Intervals", titleSlug: "merge-intervals", difficulty: "Medium", topics: ["Array", "Sorting"], companies: ["Google", "Facebook", "Twitter"], link: "https://leetcode.com/problems/merge-intervals/" },
  { title: "Climbing Stairs", titleSlug: "climbing-stairs", difficulty: "Easy", topics: ["Dynamic Programming"], companies: ["Amazon", "Apple", "Adobe"], link: "https://leetcode.com/problems/climbing-stairs/" },
  { title: "Coin Change", titleSlug: "coin-change", difficulty: "Medium", topics: ["Dynamic Programming", "BFS"], companies: ["Amazon", "Microsoft", "Goldman Sachs"], link: "https://leetcode.com/problems/coin-change/" },
  { title: "Number of Islands", titleSlug: "number-of-islands", difficulty: "Medium", topics: ["Graph", "BFS", "DFS"], companies: ["Amazon", "Google", "Facebook"], link: "https://leetcode.com/problems/number-of-islands/" },
  { title: "Reverse Linked List", titleSlug: "reverse-linked-list", difficulty: "Easy", topics: ["Linked List", "Recursion"], companies: ["Amazon", "Microsoft", "Adobe"], link: "https://leetcode.com/problems/reverse-linked-list/" },
  { title: "LRU Cache", titleSlug: "lru-cache", difficulty: "Medium", topics: ["Hash Table", "Linked List", "Design"], companies: ["Amazon", "Google", "Microsoft"], link: "https://leetcode.com/problems/lru-cache/" },
  { title: "Word Break", titleSlug: "word-break", difficulty: "Medium", topics: ["Dynamic Programming", "Trie"], companies: ["Google", "Amazon", "Facebook"], link: "https://leetcode.com/problems/word-break/" },
  { title: "Trapping Rain Water", titleSlug: "trapping-rain-water", difficulty: "Hard", topics: ["Array", "Two Pointers", "Stack"], companies: ["Google", "Amazon", "Apple"], link: "https://leetcode.com/problems/trapping-rain-water/" },
  { title: "Median of Two Sorted Arrays", titleSlug: "median-of-two-sorted-arrays", difficulty: "Hard", topics: ["Array", "Binary Search", "Divide and Conquer"], companies: ["Google", "Amazon", "Microsoft"], link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { title: "Valid Parentheses", titleSlug: "valid-parentheses", difficulty: "Easy", topics: ["String", "Stack"], companies: ["Amazon", "Bloomberg", "Facebook"], link: "https://leetcode.com/problems/valid-parentheses/" },
  { title: "Search in Rotated Sorted Array", titleSlug: "search-in-rotated-sorted-array", difficulty: "Medium", topics: ["Array", "Binary Search"], companies: ["Amazon", "Microsoft", "Facebook"], link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { title: "Course Schedule", titleSlug: "course-schedule", difficulty: "Medium", topics: ["Graph", "Topological Sort", "BFS"], companies: ["Amazon", "Google", "Uber"], link: "https://leetcode.com/problems/course-schedule/" },
  { title: "Minimum Window Substring", titleSlug: "minimum-window-substring", difficulty: "Hard", topics: ["String", "Sliding Window", "Hash Table"], companies: ["Facebook", "Amazon", "Google"], link: "https://leetcode.com/problems/minimum-window-substring/" },
  { title: "Decode Ways", titleSlug: "decode-ways", difficulty: "Medium", topics: ["String", "Dynamic Programming"], companies: ["Facebook", "Amazon"], link: "https://leetcode.com/problems/decode-ways/" },
  { title: "Product of Array Except Self", titleSlug: "product-of-array-except-self", difficulty: "Medium", topics: ["Array", "Prefix Sum"], companies: ["Amazon", "Microsoft", "Facebook"], link: "https://leetcode.com/problems/product-of-array-except-self/" },
  { title: "Find Minimum in Rotated Sorted Array", titleSlug: "find-minimum-in-rotated-sorted-array", difficulty: "Medium", topics: ["Array", "Binary Search"], companies: ["Microsoft", "Amazon"], link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { title: "Serialize and Deserialize Binary Tree", titleSlug: "serialize-and-deserialize-binary-tree", difficulty: "Hard", topics: ["Tree", "Design", "BFS"], companies: ["Facebook", "Amazon", "Google"], link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
  { title: "Longest Palindromic Substring", titleSlug: "longest-palindromic-substring", difficulty: "Medium", topics: ["String", "Dynamic Programming"], companies: ["Amazon", "Microsoft", "Bloomberg"], link: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { title: "Jump Game", titleSlug: "jump-game", difficulty: "Medium", topics: ["Array", "Greedy"], companies: ["Amazon", "Microsoft"], link: "https://leetcode.com/problems/jump-game/" },
  { title: "Rotate Image", titleSlug: "rotate-image", difficulty: "Medium", topics: ["Array", "Math", "Matrix"], companies: ["Amazon", "Microsoft", "Apple"], link: "https://leetcode.com/problems/rotate-image/" },
  { title: "Group Anagrams", titleSlug: "group-anagrams", difficulty: "Medium", topics: ["Array", "Hash Table", "String", "Sorting"], companies: ["Amazon", "Facebook", "Microsoft"], link: "https://leetcode.com/problems/group-anagrams/" },
  { title: "Subsets", titleSlug: "subsets", difficulty: "Medium", topics: ["Array", "Backtracking", "Bit Manipulation"], companies: ["Facebook", "Amazon"], link: "https://leetcode.com/problems/subsets/" },
  { title: "Kth Largest Element in an Array", titleSlug: "kth-largest-element-in-an-array", difficulty: "Medium", topics: ["Array", "Sorting", "Heap"], companies: ["Facebook", "Amazon", "Microsoft"], link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
]

function getDailyProblem(): Problem {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return FALLBACK_PROBLEMS[dayOfYear % FALLBACK_PROBLEMS.length]
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0]
}

export default function PracticePage() {
  const [problem, setProblem] = useState<Problem | null>(null)
  const [status, setStatus] = useState<"pending" | "done" | "skipped" | "struggling">("pending")
  const [streak, setStreak] = useState(0)
  const [totalSolved, setTotalSolved] = useState(0)
  const [history, setHistory] = useState<Record<string, string>>({})
  const [leetcodeUser, setLeetcodeUser] = useState("")
  const [inputUser, setInputUser] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [weekData, setWeekData] = useState<{ day: string; done: boolean }[]>([])

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("practice_history") || "{}")
    const savedStreak = parseInt(localStorage.getItem("practice_streak") || "0")
    const savedTotal = parseInt(localStorage.getItem("practice_total") || "0")
    const savedUser = localStorage.getItem("leetcode_user") || ""
    const todayStatus = savedHistory[getTodayKey()] || "pending"

    setHistory(savedHistory)
    setStreak(savedStreak)
    setTotalSolved(savedTotal)
    setLeetcodeUser(savedUser)
    setInputUser(savedUser)
    setStatus(todayStatus as any)
    setProblem(getDailyProblem())

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const key = d.toISOString().split("T")[0]
      return { day: days[d.getDay()], done: savedHistory[key] === "done" }
    })
    setWeekData(week)
  }, [])

  const handleStatus = (newStatus: "done" | "skipped" | "struggling") => {
    const todayKey = getTodayKey()
    const newHistory = { ...history, [todayKey]: newStatus }
    setStatus(newStatus)
    setHistory(newHistory)
    localStorage.setItem("practice_history", JSON.stringify(newHistory))

    if (newStatus === "done") {
      const newTotal = totalSolved + 1
      setTotalSolved(newTotal)
      localStorage.setItem("practice_total", newTotal.toString())

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yKey = yesterday.toISOString().split("T")[0]
      const newStreak = history[yKey] === "done" ? streak + 1 : 1
      setStreak(newStreak)
      localStorage.setItem("practice_streak", newStreak.toString())
    }

    setWeekData(prev => prev.map((d, i) => i === 6 ? { ...d, done: newStatus === "done" } : d))
  }

  const saveLeetcodeUser = () => {
    localStorage.setItem("leetcode_user", inputUser)
    setLeetcodeUser(inputUser)
  }

  const difficultyColor = (d: string) =>
    d === "Easy" ? "text-green-400 bg-green-500/10 border-green-500/20"
    : d === "Medium" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    : "text-red-400 bg-red-500/10 border-red-500/20"

  const topicProblems = FALLBACK_PROBLEMS.filter(p =>
    activeFilter === "All" ? true : p.topics.includes(activeFilter)
  ).slice(0, 8)

  const allTopics = ["All", "Array", "String", "Tree", "Graph", "Dynamic Programming", "Sliding Window", "Binary Search", "Linked List"]

  if (!problem) return null

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Code2 className="w-6 h-6 text-primary" />
          Daily Practice
        </h2>
        <p className="text-muted-foreground mt-1">One problem a day keeps the rejection away 💪</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl border border-border p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-2xl font-bold text-foreground">{streak}</span>
          </div>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="glass-card rounded-xl border border-border p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-2xl font-bold text-foreground">{totalSolved}</span>
          </div>
          <p className="text-xs text-muted-foreground">Total Solved</p>
        </div>
        <div className="glass-card rounded-xl border border-border p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              {Object.values(history).filter(v => v === "done").length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">This Month</p>
        </div>
      </div>

      {/* Weekly Heatmap */}
      <div className="glass-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">This Week</span>
        </div>
        <div className="flex gap-2">
          {weekData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={cn(
                "w-full h-8 rounded-md transition-colors",
                d.done ? "bg-primary" : "bg-secondary"
              )} />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Problem */}
      <div className="glass-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Today's Problem</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              #{(FALLBACK_PROBLEMS.indexOf(problem) + 1).toString().padStart(3, "0")}
            </span>
          </div>
          {status !== "pending" && (
            <span className={cn("text-xs px-3 py-1 rounded-full font-medium border", 
              status === "done" ? "bg-green-500/10 text-green-400 border-green-500/20" :
              status === "struggling" ? "bg-red-500/10 text-red-400 border-red-500/20" :
              "bg-gray-500/10 text-gray-400 border-gray-500/20"
            )}>
              {status === "done" ? "✓ Solved" : status === "struggling" ? "Need Help" : "Skipped"}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3">{problem.title}</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={cn("text-xs px-2 py-1 rounded-full border font-medium", difficultyColor(problem.difficulty))}>
            {problem.difficulty}
          </span>
          {problem.topics.map(t => (
            <span key={t} className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground border border-border">
              {t}
            </span>
          ))}
        </div>

        {/* Companies */}
        <div className="flex items-center gap-2 mb-6">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Asked at:</span>
          {problem.companies.map(c => (
            <span key={c} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{c}</span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-purple text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Solve on LeetCode
            <ExternalLink className="w-4 h-4" />
          </a>

          {status === "pending" && (
            <>
              <button
                onClick={() => handleStatus("done")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium hover:bg-green-500/20 transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Mark Solved
              </button>
              <button
                onClick={() => handleStatus("struggling")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                <AlertCircle className="w-4 h-4" /> Need Help
              </button>
              <button
                onClick={() => handleStatus("skipped")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-muted-foreground border border-border text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                <SkipForward className="w-4 h-4" /> Skip
              </button>
            </>
          )}

          {status === "done" && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Great job! Come back tomorrow 🎉
            </div>
          )}

          {status === "struggling" && (
            <button
              onClick={() => handleStatus("done")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium hover:bg-green-500/20 transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Got it now!
            </button>
          )}
        </div>
      </div>

      {/* LeetCode Username */}
      <div className="glass-card rounded-xl border border-border p-5">
        <h4 className="text-sm font-semibold text-foreground mb-1">Connect LeetCode Profile</h4>
        <p className="text-xs text-muted-foreground mb-3">Enter your username to track your real stats on LeetCode</p>
        <div className="flex gap-3">
          <input
            value={inputUser}
            onChange={e => setInputUser(e.target.value)}
            placeholder="your-leetcode-username"
            className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={saveLeetcodeUser}
            className="px-4 py-2 text-sm rounded-lg gradient-purple text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Save
          </button>
          {leetcodeUser && (
            
              href={`https://leetcode.com/${leetcodeUser}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors"
            >
              View Profile <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Problem Bank */}
      <div className="glass-card rounded-xl border border-border p-6">
        <h4 className="text-base font-semibold text-foreground mb-4">Problem Bank</h4>

        {/* Topic Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {allTopics.map(t => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-all",
                activeFilter === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Problem List */}
        <div className="space-y-2">
          {topicProblems.map((p, i) => (
            
              key={i}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">{p.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", difficultyColor(p.difficulty))}>
                  {p.difficulty}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
