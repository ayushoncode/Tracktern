"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, AlertCircle, Plus, Search } from "lucide-react";

const experiences = [
  {
    id: 1,
    user: "Rahul M.",
    role: "SDE-2 @ Google",
    company: "Google",
    round: "System Design",
    difficulty: "Hard",
    result: "Selected",
    date: "Apr 2025",
    questions: [
      { text: "Design YouTube video upload pipeline", stuck: false },
      { text: "How would you handle 10M concurrent users?", stuck: true },
      { text: "Explain your sharding strategy", stuck: true },
    ],
    tip: "Revise consistent hashing and CDN internals. They go deep on scale numbers.",
    likes: 42,
  },
  {
    id: 2,
    user: "Priya S.",
    role: "Frontend @ Flipkart",
    company: "Flipkart",
    round: "DSA Round 2",
    difficulty: "Medium",
    result: "Selected",
    date: "Mar 2025",
    questions: [
      { text: "LRU Cache implementation", stuck: false },
      { text: "Flatten nested object to dot notation", stuck: false },
      { text: "Detect cycle in directed graph", stuck: true },
    ],
    tip: "Focus on graph traversal — DFS/BFS came up twice. Write clean code, they check edge cases.",
    likes: 28,
  },
  {
    id: 3,
    user: "Aditya K.",
    role: "Backend @ Razorpay",
    company: "Razorpay",
    round: "System Design",
    difficulty: "Hard",
    result: "Rejected",
    date: "Feb 2025",
    questions: [
      { text: "Design a payment retry system", stuck: true },
      { text: "Idempotency in distributed systems", stuck: true },
      { text: "Database schema for transaction ledger", stuck: false },
    ],
    tip: "I got stuck on idempotency keys — study that topic hard before fintech interviews.",
    likes: 61,
  },
];

const difficulties = ["All", "Easy", "Medium", "Hard"];
const resultOptions = ["All", "Selected", "Rejected"];

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [result, setResult] = useState("All");
  const [liked, setLiked] = useState<number[]>([]);

  const filtered = experiences.filter((e) => {
    const matchSearch =
      e.company.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty === "All" || e.difficulty === difficulty;
    const matchResult = result === "All" || e.result === result;
    return matchSearch && matchDiff && matchResult;
  });

  const toggleLike = (id: number) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Community Interview Experiences</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real questions, real struggles — shared by people like you.
        </p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4" /> Share Experience
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              difficulty === d
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-transparent text-muted-foreground border-border hover:border-purple-500 hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
        <div className="w-px bg-border mx-1" />
        {resultOptions.map((r) => (
          <button
            key={r}
            onClick={() => setResult(r)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              result === r
                ? "bg-green-600 text-white border-green-600"
                : "bg-transparent text-muted-foreground border-border hover:border-green-500 hover:text-foreground"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((exp) => (
          <div key={exp.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-foreground">{exp.user}</p>
                <p className="text-sm text-muted-foreground">{exp.role}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  exp.result === "Selected"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {exp.result}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  exp.difficulty === "Hard"
                    ? "bg-red-500/20 text-red-400"
                    : exp.difficulty === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}>
                  {exp.difficulty}
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {exp.company} — {exp.round} — {exp.date}
            </p>

            <div className="mb-3 flex flex-col gap-2">
              {exp.questions.map((q, i) => (
                <div key={i} className={`text-sm px-3 py-2 rounded-lg flex items-start gap-2 ${
                  q.stuck
                    ? "bg-red-500/10 border-l-4 border-red-500"
                    : "bg-muted/40"
                }`}>
                  {q.stuck && <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                  <span className={q.stuck ? "text-red-300" : "text-foreground"}>{q.text}</span>
                  {q.stuck && (
                    <span className="ml-auto text-xs text-red-400 font-medium whitespace-nowrap">got stuck</span>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-yellow-300 mb-3">
              <span className="font-medium">Tip: </span>{exp.tip}
            </div>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => toggleLike(exp.id)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  liked.includes(exp.id) ? "text-purple-400" : "text-muted-foreground hover:text-purple-400"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                {exp.likes + (liked.includes(exp.id) ? 1 : 0)} helpful
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MessageSquare className="w-4 h-4" /> Comment
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No experiences found. Be the first to share!</p>
      )}
    </div>
  );
}
