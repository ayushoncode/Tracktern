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
      { text: "Design YouTube's video upload pipeline", stuck: false },
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
const results = ["All", "Selected", "Rejected"];

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
        <h1 className="text-2xl font-semibold text-gray-900">Community Interview Experiences</h1>
        <p className="text-gray-500 text-sm mt-1">
          Real questions, real struggles — shared by people like you.
        </p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {d}
          </button>
        ))}
        <div className="w-px bg-gray-200 mx-1" />
        {results.map((r) => (
          <button
            key={r}
            onClick={() => setResult(r)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              result === r
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((exp) => (
          <div key={exp.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">{exp.user}</p>
                <p className="text-sm text-gray-500">{exp.role}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  exp.result === "Selected" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {exp.result}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {exp.difficulty}
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              {exp.company} — {exp.round} — {exp.date}
            </p>

            <div className="mb-3 flex flex-col gap-2">
              {exp.questions.map((q, i) => (
                <div key={i} className={`text-sm px-3 py-2 rounded-lg flex items-start gap-2 ${
                  q.stuck ? "bg-red-50 border-l-4 border-red-400" : "bg-gray-50"
                }`}>
                  {q.stuck && <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                  <span className={q.stuck ? "text-red-700" : "text-gray-700"}>{q.text}</span>
                  {q.stuck && (
                    <span className="ml-auto text-xs text-red-400 font-medium whitespace-nowrap">got stuck</span>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800 mb-3">
              <span className="font-medium">Tip: </span>{exp.tip}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike(exp.id)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  liked.includes(exp.id) ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                {exp.likes + (liked.includes(exp.id) ? 1 : 0)} helpful
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600">
                <MessageSquare className="w-4 h-4" /> Comment
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">No experiences found. Be the first to share!</p>
      )}
    </div>
  );
}
EOFcat > ~/Tracktern/client/app/community/page.tsx << 'EOF'
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
      { text: "Design YouTube's video upload pipeline", stuck: false },
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
const results = ["All", "Selected", "Rejected"];

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
        <h1 className="text-2xl font-semibold text-gray-900">Community Interview Experiences</h1>
        <p className="text-gray-500 text-sm mt-1">
          Real questions, real struggles — shared by people like you.
        </p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                ? "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {d}
          </button>
        ))}
        <div className="w-px bg-gray-200 mx-1" />
        {results.map((r) => (
          <button
            key={r}
            onClick={() => setResult(r)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              result === r
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((exp) => (
          <div key={exp.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">{exp.user}</p>
                <p className="text-sm text-gray-500">{exp.role}</p>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  exp.result === "Selected" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {exp.result}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {exp.difficulty}
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              {exp.company} — {exp.round} — {exp.date}
            </p>

            <div className="mb-3 flex flex-col gap-2">
              {exp.questions.map((q, i) => (
                <div key={i} className={`text-sm px-3 py-2 rounded-lg flex items-start gap-2 ${
                  q.stuck ? "bg-red-50 border-l-4 border-red-400" : "bg-gray-50"
                }`}>
                  {q.stuck && <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                  <span className={q.stuck ? "text-red-700" : "text-gray-700"}>{q.text}</span>
                  {q.stuck && (
                    <span className="ml-auto text-xs text-red-400 font-medium whitespace-nowrap">got stuck</span>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800 mb-3">
              <span className="font-medium">Tip: </span>{exp.tip}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike(exp.id)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  liked.includes(exp.id) ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                {exp.likes + (liked.includes(exp.id) ? 1 : 0)} helpful
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600">
                <MessageSquare className="w-4 h-4" /> Comment
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">No experiences found. Be the first to share!</p>
      )}
    </div>
  );
}
