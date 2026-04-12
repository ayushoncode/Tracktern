"use client"

import { useState } from "react"
import { Code2, ExternalLink, CheckCircle, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

const patterns = [
  { name: "Arrays & Hashing", problems: 9, done: 0, color: "bg-blue-500/20 text-blue-400" },
  { name: "Two Pointers", problems: 5, done: 0, color: "bg-purple-500/20 text-purple-400" },
  { name: "Sliding Window", problems: 6, done: 0, color: "bg-green-500/20 text-green-400" },
  { name: "Stack", problems: 7, done: 0, color: "bg-yellow-500/20 text-yellow-400" },
  { name: "Binary Search", problems: 7, done: 0, color: "bg-orange-500/20 text-orange-400" },
  { name: "Linked List", problems: 11, done: 0, color: "bg-pink-500/20 text-pink-400" },
  { name: "Trees", problems: 15, done: 0, color: "bg-cyan-500/20 text-cyan-400" },
  { name: "Graphs", problems: 13, done: 0, color: "bg-red-500/20 text-red-400" },
  { name: "Dynamic Programming", problems: 24, done: 0, color: "bg-violet-500/20 text-violet-400" },
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
  { id: 11, title: "Valid Parentheses", difficulty: "Easy", pattern: "Stack", link: "https://leetcode.com/problems/valid-parentheses/" },
  { id: 12, title: "Min Stack", difficulty: "Medium", pattern: "Stack", link: "https://leetcode.com/problems/min-stack/" },
  { id: 13, title: "Binary Search", difficulty: "Easy", pattern: "Binary Search", link: "https://leetcode.com/problems/binary-search/" },
  { id: 14, title: "Search in Rotated Array", difficulty: "Medium", pattern: "Binary Search", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: 15, title: "Reverse Linked List", difficulty: "Easy", pattern: "Linked List", link: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: 16, title: "Merge Two Sorted Lists", difficulty: "Easy", pattern: "Linked List", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: 17, title: "Invert Binary Tree", difficulty: "Easy", pattern: "Trees", link: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: 18, title: "Maximum Depth of Binary Tree", difficulty: "Easy", pattern: "Trees", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: 19, title: "Level Order Traversal", difficulty: "Medium", pattern: "Trees", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: 20, title: "Number of Islands", difficulty: "Medium", pattern: "Graphs", link: "https://leetcode.com/problems/number-of-islands/" },
  { id: 21, title: "Clone Graph", difficulty: "Medium", pattern: "Graphs", link: "https://leetcode.com/problems/clone-graph/" },
  { id: 22, title: "Climbing Stairs", difficulty: "Easy", pattern: "Dynamic Programming", link: "https://leetcode.com/problems/climbing-stairs/" },
  { id: 23, title: "House Robber", difficulty: "Medium", pattern: "Dynamic Programming", link: "https://leetcode.com/problems/house-robber/" },
  { id: 24, title: "Coin Change", difficulty: "Medium", pattern: "Dynamic Programming", link: "https://leetcode.com/problems/coin-change/" },
  { id: 25, title: "Longest Common Subsequence", difficulty: "Medium", pattern: "Dynamic Programming", link: "https://leetcode.com/problems/longest-common-subsequence/" },
]

const difficultyColor: Record<string, string> = {
  Easy: "bg-green-500/20 text-green-400",
  Medium: "bg-yellow-500/20 text-yellow-400",
  Hard: "bg-red-500/20 text-red-400",
}

export default function PracticePage() {
  const [solved, setSolved] = useState<number[]>([])
  const [selectedPattern, setSelectedPattern] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const toggleSolved = (id: number) => {
    setSolved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const filtered = problems.filter(p => {
    if (selectedPattern !== "All" && p.pattern !== selectedPattern) return false
    if (selectedDifficulty !== "All" && p.difficulty !== selectedDifficulty) return false
    return true
  })

  const totalSolved = solved.length

  return (
    <div className="space-y-6">
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
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
        </div>
        {["All", "Easy", "Medium", "Hard"].map(d => (
          <button key={d} onClick={() => setSelectedDifficulty(d)}
            className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all",
              selectedDifficulty === d ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
            )}>
            {d}
          </button>
        ))}
      </div>

      {/* Problems Table */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">
            {selectedPattern === "All" ? "All Problems" : selectedPattern}
            <span className="text-muted-foreground text-sm font-normal ml-2">({filtered.length} problems)</span>
          </h3>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((problem) => (
            <div key={problem.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
              <button onClick={() => toggleSolved(problem.id)} className="shrink-0">
                <CheckCircle className={cn("w-5 h-5 transition-colors", solved.includes(problem.id) ? "text-green-400" : "text-muted-foreground/30 hover:text-muted-foreground")} />
              </button>
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
