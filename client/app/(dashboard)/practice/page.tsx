"use client"

import { useState, useEffect } from "react"
import { Code2, ExternalLink, CheckCircle, Flame, Trophy, Target, Calendar, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SHEET_DATA = [
  {
    topic: "Array + Basic Hashing", patterns: 2, total: 34, color: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    subPatterns: [
      { name: "Arrays", count: 15 },
      { name: "Arrays + Hashing", count: 19 },
    ]
  },
  {
    topic: "String + Basic Hashing", patterns: 2, total: 30, color: "bg-purple-500/20 text-purple-400 border-purple-500/20",
    subPatterns: [
      { name: "Strings", count: 12 },
      { name: "Strings + Hashing", count: 15 },
    ]
  },
  {
    topic: "Binary Search", patterns: 6, total: 41, color: "bg-orange-500/20 text-orange-400 border-orange-500/20",
    subPatterns: [
      { name: "Basic Problems on Sorted Array", count: 7 },
      { name: "Lower And Upper Bound", count: 6 },
      { name: "Binary Search On Rotated Sorted Array", count: 5 },
      { name: "Binary Search on Answer", count: 12 },
      { name: "Floating Point Binary Search", count: 5 },
      { name: "Miscellaneous Binary Search Problems", count: 6 },
    ]
  },
  {
    topic: "Sorting", patterns: 7, total: 51, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
    subPatterns: [
      { name: "Basic Sorting Problems (Array)", count: 10 },
      { name: "Basic Sorting Problems (Strings)", count: 6 },
      { name: "Sorting Based On Matrix", count: 5 },
      { name: "Standard Sorting Algorithms", count: 6 },
      { name: "Problems on Sorting Algorithms", count: 9 },
      { name: "Custom Sort & Lambda", count: 6 },
      { name: "Problems on Intervals + Sorting + Greedy", count: 9 },
    ]
  },
  {
    topic: "Number Theory", patterns: 5, total: 55, color: "bg-red-500/20 text-red-400 border-red-500/20",
    subPatterns: [
      { name: "Basic Maths", count: 15 },
      { name: "Divisibility & Factors", count: 10 },
      { name: "Prime Numbers", count: 10 },
      { name: "GCD/LCM", count: 10 },
      { name: "Modular Arithmetic", count: 10 },
    ]
  },
  {
    topic: "Matrix", patterns: 5, total: 36, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
    subPatterns: [
      { name: "Traversal Based Problems", count: 7 },
      { name: "Modify Matrix Problems", count: 10 },
      { name: "Searching On Matrix", count: 7 },
      { name: "Standard Problems with Hashing", count: 8 },
      { name: "Chess Related Problems", count: 4 },
    ]
  },
  {
    topic: "Two Pointers", patterns: 3, total: 29, color: "bg-green-500/20 text-green-400 border-green-500/20",
    subPatterns: [
      { name: "Standard Problems on Array", count: 10 },
      { name: "Standard Problems on Strings", count: 10 },
      { name: "Two Pointers + Hashing", count: 10 },
    ]
  },
  {
    topic: "Prefix Sum", patterns: 5, total: 30, color: "bg-teal-500/20 text-teal-400 border-teal-500/20",
    subPatterns: [
      { name: "Prefix Sum on Array", count: 8 },
      { name: "Prefix Sum on Binary Array", count: 5 },
      { name: "Prefix Sum + Hash Map", count: 8 },
      { name: "2D Prefix Sum", count: 5 },
      { name: "Difference Array", count: 4 },
    ]
  },
  {
    topic: "Linked Lists", patterns: 6, total: 57, color: "bg-pink-500/20 text-pink-400 border-pink-500/20",
    subPatterns: [
      { name: "Traversal in Singly Linked List", count: 10 },
      { name: "Insertion/Deletion in Singly Linked List", count: 8 },
      { name: "Linked List with Two Pointers/Hash Table", count: 17 },
      { name: "Doubly Linked List", count: 7 },
      { name: "Circular Linked List & Cycle Related Problems", count: 8 },
      { name: "Sort/Merge in Linked List", count: 7 },
    ]
  },
  {
    topic: "Sliding Window", patterns: 2, total: 24, color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20",
    subPatterns: [
      { name: "Fixed Size Window", count: 12 },
      { name: "Variable Size Window", count: 12 },
    ]
  },
  {
    topic: "Bit Manipulation", patterns: 5, total: 43, color: "bg-violet-500/20 text-violet-400 border-violet-500/20",
    subPatterns: [
      { name: "Math Based Bit Problems", count: 10 },
      { name: "Array & Matrix Related Problems", count: 8 },
      { name: "String Related Problems", count: 8 },
      { name: "Hash Table Related Problems", count: 8 },
      { name: "Operator Based Problems", count: 9 },
    ]
  },
  {
    topic: "Stack", patterns: 4, total: 33, color: "bg-amber-500/20 text-amber-400 border-amber-500/20",
    subPatterns: [
      { name: "Basic Stack Problems", count: 7 },
      { name: "Conversion/Expression Related Problems", count: 6 },
      { name: "Nested Structure Verification Problems", count: 8 },
      { name: "Hard Problems on Stack", count: 12 },
    ]
  },
  {
    topic: "Queue & Deque", patterns: 3, total: 25, color: "bg-lime-500/20 text-lime-400 border-lime-500/20",
    subPatterns: [
      { name: "Basics of Queue & Deque", count: 10 },
      { name: "Queue Based Problems", count: 10 },
      { name: "Deque Based Problems", count: 5 },
    ]
  },
  {
    topic: "Monotonic Stack & Queue", patterns: 2, total: 23, color: "bg-rose-500/20 text-rose-400 border-rose-500/20",
    subPatterns: [
      { name: "Monotonic Stack", count: 15 },
      { name: "Monotonic Queue/Deque", count: 8 },
    ]
  },
  {
    topic: "Priority Queue & Heap", patterns: 3, total: 28, color: "bg-sky-500/20 text-sky-400 border-sky-500/20",
    subPatterns: [
      { name: "Max/Min Heap", count: 15 },
      { name: "Custom Comparator in Priority Queue", count: 7 },
      { name: "Two Heap", count: 6 },
    ]
  },
  {
    topic: "Greedy", patterns: 6, total: 60, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    subPatterns: [
      { name: "Greedy with Sorting + Two Pointers", count: 10 },
      { name: "Greedy with Counting / Hash Map", count: 10 },
      { name: "Math + Greedy", count: 10 },
      { name: "One-Pass Greedy", count: 10 },
      { name: "Greedy instead of DP", count: 10 },
      { name: "Greedy with Heap", count: 10 },
    ]
  },
  {
    topic: "Recursion", patterns: 2, total: 20, color: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/20",
    subPatterns: [
      { name: "Basic Recursive Problems", count: 10 },
      { name: "Recursion Based Problems", count: 10 },
    ]
  },
  {
    topic: "Backtracking", patterns: 3, total: 22, color: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    subPatterns: [
      { name: "Subsets/Permutations/Combinations", count: 8 },
      { name: "Array & String Based Problems", count: 7 },
      { name: "Matrix Based Problems", count: 7 },
    ]
  },
  {
    topic: "Trie", patterns: 3, total: 20, color: "bg-purple-500/20 text-purple-400 border-purple-500/20",
    subPatterns: [
      { name: "Basic Trie Operations", count: 8 },
      { name: "Prefix Matching", count: 7 },
      { name: "Bitwise Trie", count: 5 },
    ]
  },
  {
    topic: "Design", patterns: 7, total: 42, color: "bg-orange-500/20 text-orange-400 border-orange-500/20",
    subPatterns: [
      { name: "Array & String Based Design Problems", count: 8 },
      { name: "Hash Table Based Design Problems", count: 8 },
      { name: "Linked List Based Design Problems", count: 7 },
      { name: "Stack & Queue Based Design Problems", count: 4 },
      { name: "Heap Based Design Problems", count: 5 },
      { name: "Trie Based Design Problems", count: 5 },
      { name: "Tree Based Design Problems", count: 5 },
    ]
  },
  {
    topic: "Dynamic Programming", patterns: 12, total: 166, color: "bg-red-500/20 text-red-400 border-red-500/20",
    subPatterns: [
      { name: "Linear DP", count: 29 },
      { name: "Knapsack", count: 11 },
      { name: "Multi Dimensional DP", count: 22 },
      { name: "DP Interval Problem", count: 10 },
      { name: "Bit DP", count: 10 },
      { name: "Digit DP", count: 3 },
      { name: "DP on Trees", count: 8 },
      { name: "DP on Strings", count: 23 },
      { name: "DP on LCS", count: 11 },
      { name: "DP on LIS", count: 7 },
      { name: "DP on 2D Grid", count: 10 },
      { name: "DP on Cumulative Sum", count: 17 },
    ]
  },
  {
    topic: "Tree", patterns: 12, total: 73, color: "bg-green-500/20 text-green-400 border-green-500/20",
    subPatterns: [
      { name: "Ancestor Problems", count: 5 },
      { name: "Root-to-Leaf Path Problems", count: 6 },
      { name: "Serialize & Deserialize", count: 3 },
      { name: "Leaves Related", count: 4 },
      { name: "Level Order Traversal & BFS Variants", count: 15 },
      { name: "Node Deletion", count: 2 },
      { name: "Tree Construction", count: 10 },
      { name: "Distance Between Two Nodes", count: 3 },
      { name: "Inorder-BST Specific", count: 6 },
      { name: "Flipping & Tree Checking", count: 7 },
      { name: "Counting Nodes or Recovery or Kth or Pruning or Searching", count: 8 },
      { name: "Depth Related", count: 4 },
    ]
  },
]

const DAILY_PROBLEMS = [
  { title: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/" },
  { title: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/" },
  { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
  { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { title: "Search in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { title: "Coin Change", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change/" },
  { title: "Number of Islands", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/" },
  { title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" },
  { title: "Median of Two Sorted Arrays", difficulty: "Hard", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { title: "Merge Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/merge-intervals/" },
  { title: "House Robber", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/" },
  { title: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/" },
  { title: "Word Break", difficulty: "Medium", link: "https://leetcode.com/problems/word-break/" },
  { title: "LRU Cache", difficulty: "Medium", link: "https://leetcode.com/problems/lru-cache/" },
  { title: "Valid Parentheses", difficulty: "Easy", link: "https://leetcode.com/problems/valid-parentheses/" },
  { title: "Kth Largest Element in Array", difficulty: "Medium", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { title: "Combination Sum", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum/" },
  { title: "Jump Game", difficulty: "Medium", link: "https://leetcode.com/problems/jump-game/" },
  { title: "Rotate Image", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-image/" },
  { title: "Largest Rectangle in Histogram", difficulty: "Hard", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  { title: "Word Search II", difficulty: "Hard", link: "https://leetcode.com/problems/word-search-ii/" },
  { title: "Implement Trie", difficulty: "Medium", link: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { title: "Maximum Depth of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { title: "Validate Binary Search Tree", difficulty: "Medium", link: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { title: "Subsets", difficulty: "Medium", link: "https://leetcode.com/problems/subsets/" },
  { title: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" },
  { title: "Gas Station", difficulty: "Medium", link: "https://leetcode.com/problems/gas-station/" },
  { title: "Counting Bits", difficulty: "Easy", link: "https://leetcode.com/problems/counting-bits/" },
  { title: "Daily Temperatures", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/" },
]

const diffColor: Record<string, string> = {
  Easy: "bg-green-500/20 text-green-400 border-green-500/20",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  Hard: "bg-red-500/20 text-red-400 border-red-500/20",
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0]
}

function getDailyProblem() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_PROBLEMS[dayOfYear % DAILY_PROBLEMS.length]
}

export default function PracticePage() {
  const [solvedPatterns, setSolvedPatterns] = useState<Record<string, number>>({})
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [history, setHistory] = useState<Record<string, boolean>>({})
  const [weekData, setWeekData] = useState<{ day: string; done: boolean }[]>([])
  const [dailyDone, setDailyDone] = useState(false)

  const dailyProblem = getDailyProblem()
  const totalSolved = Object.values(solvedPatterns).reduce((a, b) => a + b, 0)
  const grandTotal = SHEET_DATA.reduce((a, b) => a + b.total, 0)

  useEffect(() => {
    const savedSolved = JSON.parse(localStorage.getItem("pattern_solved") || "{}")
    const savedHistory = JSON.parse(localStorage.getItem("practice_daily_history") || "{}")
    const savedStreak = parseInt(localStorage.getItem("practice_streak") || "0")
    setSolvedPatterns(savedSolved)
    setHistory(savedHistory)
    setStreak(savedStreak)
    setDailyDone(savedHistory[getTodayKey()] === true)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const key = d.toISOString().split("T")[0]
      return { day: days[d.getDay()], done: savedHistory[key] === true }
    })
    setWeekData(week)
  }, [])

  const updateSubPatternSolved = (topic: string, subPattern: string, count: number, max: number) => {
    const key = `${topic}__${subPattern}`
    const newVal = Math.min(Math.max(0, count), max)
    const newSolved = { ...solvedPatterns, [key]: newVal }
    setSolvedPatterns(newSolved)
    localStorage.setItem("pattern_solved", JSON.stringify(newSolved))
  }

  const getSubPatternSolved = (topic: string, subPattern: string) => {
    return solvedPatterns[`${topic}__${subPattern}`] || 0
  }

  const getTopicSolved = (topic: string) => {
    return SHEET_DATA.find(s => s.topic === topic)?.subPatterns.reduce((acc, sp) => {
      return acc + (solvedPatterns[`${topic}__${sp.name}`] || 0)
    }, 0) || 0
  }

  const markDailyDone = () => {
    if (dailyDone) return
    const todayKey = getTodayKey()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yKey = yesterday.toISOString().split("T")[0]
    const newStreak = history[yKey] ? streak + 1 : 1
    const newHistory = { ...history, [todayKey]: true }
    setDailyDone(true)
    setStreak(newStreak)
    setHistory(newHistory)
    localStorage.setItem("practice_daily_history", JSON.stringify(newHistory))
    localStorage.setItem("practice_streak", newStreak.toString())
    setWeekData(prev => prev.map((d, i) => i === 6 ? { ...d, done: true } : d))
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            Daily Practice
          </h2>
          <p className="text-muted-foreground mt-1">Pattern-Wise Mastery — 22 topics, {grandTotal} problems</p>
        </div>
        <div className="glass-card rounded-xl border border-border px-5 py-3 text-right">
          <div className="text-2xl font-bold text-primary">{totalSolved}<span className="text-muted-foreground text-base font-normal">/{grandTotal}</span></div>
          <div className="text-xs text-muted-foreground">Total Solved</div>
        </div>
      </div>

      {/* Stats */}
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
          <p className="text-xs text-muted-foreground">Problems Solved</p>
        </div>
        <div className="glass-card rounded-xl border border-border p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-foreground">{SHEET_DATA.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Topics</p>
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
              <div className={cn("w-full h-8 rounded-md transition-colors", d.done ? "bg-primary" : "bg-secondary")} />
              <span className="text-xs text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Problem */}
      <div className="glass-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Problem of the Day</span>
          {dailyDone && (
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
              Solved today
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{dailyProblem.title}</h3>
        <span className={cn("text-xs px-2 py-1 rounded-full border font-medium", diffColor[dailyProblem.difficulty])}>
          {dailyProblem.difficulty}
        </span>
        <div className="flex gap-3 mt-4">
          <a href={dailyProblem.link} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-purple text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Solve on LeetCode <ExternalLink className="w-4 h-4" />
          </a>
          {!dailyDone ? (
            <button onClick={markDailyDone}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium hover:bg-green-500/20 transition-colors">
              <CheckCircle className="w-4 h-4" /> Mark Done
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Done! Come back tomorrow
            </div>
          )}
        </div>
      </div>

      {/* Pattern Wise Sheet */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">
          Pattern-Wise Mastery
          <span className="text-muted-foreground font-normal text-sm ml-2">— 22 topics</span>
        </h3>
        <div className="space-y-3">
          {SHEET_DATA.map((sheet) => {
            const topicSolved = getTopicSolved(sheet.topic)
            const pct = Math.round((topicSolved / sheet.total) * 100)
            const isExpanded = expandedTopic === sheet.topic

            return (
              <div key={sheet.topic} className="glass-card rounded-xl border border-border overflow-hidden">
                {/* Topic Header */}
                <button
                  onClick={() => setExpandedTopic(isExpanded ? null : sheet.topic)}
                  className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground text-sm">{sheet.topic}</span>
                        <span className="text-xs text-muted-foreground">{sheet.patterns} patterns</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-48 bg-secondary rounded-full h-1.5">
                          <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <span className="text-sm font-bold text-primary">{topicSolved}</span>
                    <span className="text-sm text-muted-foreground">/{sheet.total}</span>
                  </div>
                </button>

                {/* Sub Patterns */}
                {isExpanded && (
                  <div className="border-t border-border divide-y divide-border">
                    {sheet.subPatterns.map((sp) => {
                      const spSolved = getSubPatternSolved(sheet.topic, sp.name)
                      const spPct = Math.round((spSolved / sp.count) * 100)
                      return (
                        <div key={sp.name} className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/20 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm text-foreground">{sp.name}</span>
                              <span className="text-xs text-muted-foreground ml-2 shrink-0">{spSolved}/{sp.count}</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-1">
                              <div className="bg-primary rounded-full h-1 transition-all" style={{ width: `${spPct}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => updateSubPatternSolved(sheet.topic, sp.name, spSolved - 1, sp.count)}
                              className="w-6 h-6 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-sm font-bold transition-colors flex items-center justify-center"
                            >
                              -
                            </button>
                            <button
                              onClick={() => updateSubPatternSolved(sheet.topic, sp.name, spSolved + 1, sp.count)}
                              className={cn("w-6 h-6 rounded text-sm font-bold transition-colors flex items-center justify-center",
                                spSolved === sp.count
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-primary/20 text-primary hover:bg-primary/30"
                              )}
                            >
                              +
                            </button>
                            {spSolved === sp.count && (
                              <CheckCircle className="w-4 h-4 text-green-400 ml-1" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
