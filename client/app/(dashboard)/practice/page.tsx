"use client"

import { useState, useEffect } from "react"
import { Code2, ExternalLink, CheckCircle, Flame, Trophy, Target, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const PATTERNS = [
  { topic: "Array + Basic Hashing", patterns: 2, questionsCount: 14, color: "bg-blue-500/20 text-blue-400 border-blue-500/20" },
  { topic: "String + Basic Hashing", patterns: 2, questionsCount: 14, color: "bg-purple-500/20 text-purple-400 border-purple-500/20" },
  { topic: "Binary Search", patterns: 6, questionsCount: 21, color: "bg-orange-500/20 text-orange-400 border-orange-500/20" },
  { topic: "Sorting", patterns: 7, questionsCount: 21, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20" },
  { topic: "Number Theory", patterns: 5, questionsCount: 18, color: "bg-red-500/20 text-red-400 border-red-500/20" },
  { topic: "Matrix", patterns: 5, questionsCount: 18, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20" },
  { topic: "Two Pointers", patterns: 3, questionsCount: 14, color: "bg-green-500/20 text-green-400 border-green-500/20" },
  { topic: "Prefix Sum", patterns: 5, questionsCount: 18, color: "bg-teal-500/20 text-teal-400 border-teal-500/20" },
  { topic: "Linked Lists", patterns: 6, questionsCount: 21, color: "bg-pink-500/20 text-pink-400 border-pink-500/20" },
  { topic: "Sliding Window", patterns: 2, questionsCount: 14, color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20" },
  { topic: "Bit Manipulation", patterns: 5, questionsCount: 18, color: "bg-violet-500/20 text-violet-400 border-violet-500/20" },
  { topic: "Stack", patterns: 4, questionsCount: 14, color: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
  { topic: "Queue & Deque", patterns: 3, questionsCount: 14, color: "bg-lime-500/20 text-lime-400 border-lime-500/20" },
  { topic: "Monotonic Stack & Queue", patterns: 2, questionsCount: 14, color: "bg-rose-500/20 text-rose-400 border-rose-500/20" },
  { topic: "Priority Queue & Heap", patterns: 3, questionsCount: 14, color: "bg-sky-500/20 text-sky-400 border-sky-500/20" },
  { topic: "Greedy", patterns: 6, questionsCount: 21, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
  { topic: "Recursion", patterns: 2, questionsCount: 14, color: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/20" },
  { topic: "Backtracking", patterns: 3, questionsCount: 14, color: "bg-blue-500/20 text-blue-400 border-blue-500/20" },
  { topic: "Trie", patterns: 3, questionsCount: 14, color: "bg-purple-500/20 text-purple-400 border-purple-500/20" },
  { topic: "Design", patterns: 7, questionsCount: 21, color: "bg-orange-500/20 text-orange-400 border-orange-500/20" },
  { topic: "Dynamic Programming", patterns: 12, questionsCount: 42, color: "bg-red-500/20 text-red-400 border-red-500/20" },
  { topic: "Tree", patterns: 12, questionsCount: 42, color: "bg-green-500/20 text-green-400 border-green-500/20" },
]

const PROBLEMS = [
  { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Array + Basic Hashing", link: "https://leetcode.com/problems/two-sum/" },
  { id: 2, title: "Contains Duplicate", difficulty: "Easy", topic: "Array + Basic Hashing", link: "https://leetcode.com/problems/contains-duplicate/" },
  { id: 3, title: "Valid Anagram", difficulty: "Easy", topic: "String + Basic Hashing", link: "https://leetcode.com/problems/valid-anagram/" },
  { id: 4, title: "Group Anagrams", difficulty: "Medium", topic: "String + Basic Hashing", link: "https://leetcode.com/problems/group-anagrams/" },
  { id: 5, title: "Binary Search", difficulty: "Easy", topic: "Binary Search", link: "https://leetcode.com/problems/binary-search/" },
  { id: 6, title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: 7, title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: 8, title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { id: 9, title: "Sort Colors", difficulty: "Medium", topic: "Sorting", link: "https://leetcode.com/problems/sort-colors/" },
  { id: 10, title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", link: "https://leetcode.com/problems/merge-intervals/" },
  { id: 11, title: "Largest Number", difficulty: "Medium", topic: "Sorting", link: "https://leetcode.com/problems/largest-number/" },
  { id: 12, title: "Count Primes", difficulty: "Medium", topic: "Number Theory", link: "https://leetcode.com/problems/count-primes/" },
  { id: 13, title: "Power of Two", difficulty: "Easy", topic: "Number Theory", link: "https://leetcode.com/problems/power-of-two/" },
  { id: 14, title: "Rotate Image", difficulty: "Medium", topic: "Matrix", link: "https://leetcode.com/problems/rotate-image/" },
  { id: 15, title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", link: "https://leetcode.com/problems/spiral-matrix/" },
  { id: 16, title: "Valid Palindrome", difficulty: "Easy", topic: "Two Pointers", link: "https://leetcode.com/problems/valid-palindrome/" },
  { id: 17, title: "3Sum", difficulty: "Medium", topic: "Two Pointers", link: "https://leetcode.com/problems/3sum/" },
  { id: 18, title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", link: "https://leetcode.com/problems/container-with-most-water/" },
  { id: 19, title: "Running Sum of 1d Array", difficulty: "Easy", topic: "Prefix Sum", link: "https://leetcode.com/problems/running-sum-of-1d-array/" },
  { id: 20, title: "Subarray Sum Equals K", difficulty: "Medium", topic: "Prefix Sum", link: "https://leetcode.com/problems/subarray-sum-equals-k/" },
  { id: 21, title: "Reverse Linked List", difficulty: "Easy", topic: "Linked Lists", link: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: 22, title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: 23, title: "LRU Cache", difficulty: "Medium", topic: "Linked Lists", link: "https://leetcode.com/problems/lru-cache/" },
  { id: 24, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Sliding Window", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: 25, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: 26, title: "Number of 1 Bits", difficulty: "Easy", topic: "Bit Manipulation", link: "https://leetcode.com/problems/number-of-1-bits/" },
  { id: 27, title: "Counting Bits", difficulty: "Easy", topic: "Bit Manipulation", link: "https://leetcode.com/problems/counting-bits/" },
  { id: 28, title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", link: "https://leetcode.com/problems/valid-parentheses/" },
  { id: 29, title: "Min Stack", difficulty: "Medium", topic: "Stack", link: "https://leetcode.com/problems/min-stack/" },
  { id: 30, title: "Daily Temperatures", difficulty: "Medium", topic: "Monotonic Stack & Queue", link: "https://leetcode.com/problems/daily-temperatures/" },
  { id: 31, title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Monotonic Stack & Queue", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  { id: 32, title: "Kth Largest Element in Array", difficulty: "Medium", topic: "Priority Queue & Heap", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { id: 33, title: "Top K Frequent Elements", difficulty: "Medium", topic: "Priority Queue & Heap", link: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { id: 34, title: "Jump Game", difficulty: "Medium", topic: "Greedy", link: "https://leetcode.com/problems/jump-game/" },
  { id: 35, title: "Gas Station", difficulty: "Medium", topic: "Greedy", link: "https://leetcode.com/problems/gas-station/" },
  { id: 36, title: "Fibonacci Number", difficulty: "Easy", topic: "Recursion", link: "https://leetcode.com/problems/fibonacci-number/" },
  { id: 37, title: "Pow(x, n)", difficulty: "Medium", topic: "Recursion", link: "https://leetcode.com/problems/powx-n/" },
  { id: 38, title: "Subsets", difficulty: "Medium", topic: "Backtracking", link: "https://leetcode.com/problems/subsets/" },
  { id: 39, title: "Combination Sum", difficulty: "Medium", topic: "Backtracking", link: "https://leetcode.com/problems/combination-sum/" },
  { id: 40, title: "Permutations", difficulty: "Medium", topic: "Backtracking", link: "https://leetcode.com/problems/permutations/" },
  { id: 41, title: "Implement Trie", difficulty: "Medium", topic: "Trie", link: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { id: 42, title: "Word Search II", difficulty: "Hard", topic: "Trie", link: "https://leetcode.com/problems/word-search-ii/" },
  { id: 43, title: "LRU Cache", difficulty: "Medium", topic: "Design", link: "https://leetcode.com/problems/lru-cache/" },
  { id: 44, title: "Design Twitter", difficulty: "Medium", topic: "Design", link: "https://leetcode.com/problems/design-twitter/" },
  { id: 45, title: "Climbing Stairs", difficulty: "Easy", topic: "Dynamic Programming", link: "https://leetcode.com/problems/climbing-stairs/" },
  { id: 46, title: "House Robber", difficulty: "Medium", topic: "Dynamic Programming", link: "https://leetcode.com/problems/house-robber/" },
  { id: 47, title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", link: "https://leetcode.com/problems/coin-change/" },
  { id: 48, title: "Longest Common Subsequence", difficulty: "Medium", topic: "Dynamic Programming", link: "https://leetcode.com/problems/longest-common-subsequence/" },
  { id: 49, title: "Word Break", difficulty: "Medium", topic: "Dynamic Programming", link: "https://leetcode.com/problems/word-break/" },
  { id: 50, title: "Invert Binary Tree", difficulty: "Easy", topic: "Tree", link: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: 51, title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Tree", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: 52, title: "Level Order Traversal", difficulty: "Medium", topic: "Tree", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: 53, title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Tree", link: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: 54, title: "Number of Islands", difficulty: "Medium", topic: "Tree", link: "https://leetcode.com/problems/number-of-islands/" },
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
  const [solved, setSolved] = useState<number[]>([])
  const [selectedTopic, setSelectedTopic] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [streak, setStreak] = useState(0)
  const [history, setHistory] = useState<Record<string, boolean>>({})
  const [weekData, setWeekData] = useState<{ day: string; done: boolean }[]>([])
  const [dailyDone, setDailyDone] = useState(false)

  const dailyProblem = getDailyProblem()

  useEffect(() => {
    const savedSolved = JSON.parse(localStorage.getItem("practice_solved") || "[]")
    const savedHistory = JSON.parse(localStorage.getItem("practice_daily_history") || "{}")
    const savedStreak = parseInt(localStorage.getItem("practice_streak") || "0")
    setSolved(savedSolved)
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

  const toggleSolved = (id: number) => {
    const newSolved = solved.includes(id) ? solved.filter(i => i !== id) : [...solved, id]
    setSolved(newSolved)
    localStorage.setItem("practice_solved", JSON.stringify(newSolved))
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

  const filtered = PROBLEMS.filter(p => {
    if (selectedTopic !== "All" && p.topic !== selectedTopic) return false
    if (selectedDifficulty !== "All" && p.difficulty !== selectedDifficulty) return false
    return true
  })

  const totalSolved = solved.length
  const totalProblems = PROBLEMS.length

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            Daily Practice
          </h2>
          <p className="text-muted-foreground mt-1">Pattern-wise DSA mastery — 22 topics, crack any interview</p>
        </div>
        <div className="text-right glass-card rounded-xl border border-border px-5 py-3">
          <div className="text-2xl font-bold text-primary">{totalSolved}<span className="text-muted-foreground text-base font-normal">/{totalProblems}</span></div>
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
            <span className="text-2xl font-bold text-foreground">{PATTERNS.length}</span>
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
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Today's Problem</span>
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

      {/* Pattern Cards */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">Pattern-Wise Mastery <span className="text-muted-foreground font-normal text-sm">— 22 topics</span></h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PATTERNS.map((p) => {
            const topicSolved = solved.filter(id => PROBLEMS.find(pr => pr.id === id && pr.topic === p.topic)).length
            const topicTotal = PROBLEMS.filter(pr => pr.topic === p.topic).length || p.questionsCount
            return (
              <button key={p.topic}
                onClick={() => setSelectedTopic(selectedTopic === p.topic ? "All" : p.topic)}
                className={cn("glass-card rounded-xl p-3 border text-left transition-all hover:border-primary/40",
                  selectedTopic === p.topic ? "border-primary bg-primary/5" : "border-border"
                )}>
                <div className={cn("text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-2 border", p.color)}>
                  {p.topic}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-foreground">{topicSolved}/{topicTotal}</span>
                  <span className="text-xs text-muted-foreground">{p.patterns} patterns</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${topicTotal > 0 ? (topicSolved / topicTotal) * 100 : 0}%` }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm text-muted-foreground">Difficulty:</span>
        {["All", "Easy", "Medium", "Hard"].map(d => (
          <button key={d} onClick={() => setSelectedDifficulty(d)}
            className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all",
              selectedDifficulty === d ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
            )}>
            {d}
          </button>
        ))}
        {selectedTopic !== "All" && (
          <button onClick={() => setSelectedTopic("All")} className="px-3 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground hover:border-red-400/50 hover:text-red-400 transition-all ml-2">
            Clear filter x
          </button>
        )}
      </div>

      {/* Problems Table */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            {selectedTopic === "All" ? "All Problems" : selectedTopic}
            <span className="text-muted-foreground text-sm font-normal ml-2">({filtered.length} problems)</span>
          </h3>
          <span className="text-sm text-muted-foreground">
            {solved.filter(id => filtered.find(p => p.id === id)).length}/{filtered.length} solved
          </span>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((problem) => (
            <div key={problem.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
              <button onClick={() => toggleSolved(problem.id)} className="shrink-0">
                <CheckCircle className={cn("w-5 h-5 transition-colors",
                  solved.includes(problem.id) ? "text-green-400 fill-green-400/20" : "text-muted-foreground/30 hover:text-muted-foreground"
                )} />
              </button>
              <div className="flex-1 min-w-0">
                <span className={cn("text-sm font-medium",
                  solved.includes(problem.id) ? "line-through text-muted-foreground" : "text-foreground"
                )}>
                  {problem.id}. {problem.title}
                </span>
              </div>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border hidden sm:block", diffColor[problem.difficulty])}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-muted-foreground hidden lg:block max-w-32 truncate">{problem.topic}</span>
              <a href={problem.link} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
