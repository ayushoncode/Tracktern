"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  CircleDashed,
  FileSearch,
  FileText,
  Flame,
  Upload,
  Loader2,
  ScanSearch,
  Sparkles,
  Target,
  X,
} from "lucide-react"

import { getToken } from "@/lib/api"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const API = "https://tracktern-27b8.onrender.com/api"

type ResumeAnalysisResult = {
  overallScore?: number
  atsScore?: number
  summary?: string
  strengths?: string[]
  missingSkills?: string[]
  keywordsMissing?: string[]
  suggestions?: string[]
  quickWins?: string[]
}

const COMPANY_SUGGESTIONS = ["Google", "Amazon", "Microsoft", "Meta", "Adobe", "Atlassian"]
const ROLE_SUGGESTIONS = ["SDE Intern", "Frontend Engineer", "Backend Engineer", "Full Stack Developer", "Data Analyst", "Product Manager"]

export default function ResumeAnalyzerPage() {
  const [resume, setResume] = useState("")
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setToken(getToken())
  }, [])

  const canAnalyze = Boolean(resume.trim() && company.trim() && role.trim() && token && !loading && !extracting)

  const resumeStats = useMemo(() => {
    const words = resume.trim() ? resume.trim().split(/\s+/).length : 0
    const chars = resume.length
    return { words, chars }
  }, [resume])

  const readiness = useMemo(() => {
    let score = 0
    if (company.trim()) score += 1
    if (role.trim()) score += 1
    if (resume.trim()) score += 1
    return Math.round((score / 3) * 100)
  }, [company, role, resume])

  const runAnalysis = async (resumeText = resume) => {
    const trimmedResume = resumeText.trim()
    const trimmedCompany = company.trim()
    const trimmedRole = role.trim()

    if (!trimmedResume || !trimmedCompany || !trimmedRole) {
      setError("Add your company, role, and resume text before running the analysis.")
      return false
    }

    if (!token) {
      setError("You need to be signed in to analyze a resume.")
      return false
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch(`${API}/mock-interview/resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resume: trimmedResume,
          company: trimmedCompany,
          role: trimmedRole,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || data?.message || "Could not analyze this resume right now. Please try again.")
        return false
      }

      setResult({
        overallScore: Number.isFinite(data?.overallScore) ? data.overallScore : undefined,
        atsScore: Number.isFinite(data?.atsScore) ? data.atsScore : undefined,
        summary: typeof data?.summary === "string" ? data.summary : "Analysis complete.",
        strengths: Array.isArray(data?.strengths) ? data.strengths : [],
        missingSkills: Array.isArray(data?.missingSkills) ? data.missingSkills : [],
        keywordsMissing: Array.isArray(data?.keywordsMissing) ? data.keywordsMissing : [],
        suggestions: Array.isArray(data?.suggestions) ? data.suggestions : [],
        quickWins: Array.isArray(data?.quickWins) ? data.quickWins : [],
      })
      return true
    } catch {
      setError("Network error while contacting the analyzer API. Please try again in a moment.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const clearUploadedFile = () => {
    setUploadedFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const processFile = async (file: File | undefined) => {
    if (!file) {
      return
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    const fileName = file.name.toLowerCase()
    const isValidExtension = fileName.endsWith(".pdf") || fileName.endsWith(".docx") || fileName.endsWith(".txt")

    if (!validTypes.includes(file.type) && !isValidExtension) {
      setError("Please upload a PDF, DOCX, or TXT resume file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload a file smaller than 5MB.")
      return
    }

    setExtracting(true)
    setError("")

    try {
      const extractedText = await extractTextFromFile(file)

      if (!extractedText.trim()) {
        setError("We could not extract readable text from that file. Try another resume file or paste the text manually.")
        return
      }

      const extractedResume = sanitizeResumeText(extractedText)

      setResume(extractedResume)
      setUploadedFileName(file.name)

      if (company.trim() && role.trim() && token) {
        await runAnalysis(extractedResume)
      }
    } catch {
      setError("We could not read that file. Try a different PDF or DOCX, or paste the resume text manually.")
    } finally {
      setExtracting(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    await processFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    await processFile(file)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-primary/15 bg-[linear-gradient(135deg,rgba(124,58,237,0.22),rgba(15,15,19,0.94)_40%,rgba(6,182,212,0.16))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7 lg:p-9">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.2),transparent_30%)]" />
        <div className="absolute -right-12 top-8 hidden h-56 w-56 rounded-full bg-primary/20 blur-3xl lg:block" />
        <div className="absolute bottom-0 left-1/3 hidden h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl lg:block" />

        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_360px]">
          <div className="space-y-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Resume Analyzer
            </div>

            <div className="max-w-3xl">
              <h1 className="max-w-2xl text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Tune your resume for the role you actually want
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Upload a PDF or DOCX, or paste your resume text, then get an AI review with score, gaps, keywords, and next-step suggestions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroBadge
                label="Target company"
                value={company || "Choose one"}
                icon={Building2}
              />
              <HeroBadge
                label="Target role"
                value={role || "Pick a role"}
                icon={Target}
              />
              <HeroBadge
                label="Resume length"
                value={resumeStats.words ? `${resumeStats.words} words` : "No text yet"}
                icon={FileText}
              />
            </div>
          </div>

          <div className="glass-card rounded-[28px] border border-white/10 bg-background/55 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Ready to analyze</p>
                <p className="mt-2 text-4xl font-black text-foreground">{readiness}%</p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3">
                <ScanSearch className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#7C3AED_0%,#06B6D4_100%)] transition-all"
                style={{ width: `${readiness}%` }}
              />
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <ChecklistItem done={Boolean(company.trim())} label="Choose a company target" />
              <ChecklistItem done={Boolean(role.trim())} label="Pick the role you want to optimize for" />
              <ChecklistItem done={Boolean(resume.trim())} label="Upload or paste resume content" />
            </div>

            <div className="mt-5 rounded-2xl border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">What this catches</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-foreground">
                <MiniFeature icon={CheckCircle2} label="Strengths" />
                <MiniFeature icon={CircleDashed} label="Missing skills" />
                <MiniFeature icon={Flame} label="ATS gaps" />
                <MiniFeature icon={Sparkles} label="Rewrite ideas" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <section className="glass-card rounded-[30px] border border-white/8 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground sm:text-2xl">Resume studio</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Fill the role context, drop in your resume, and polish it before you analyze.
              </p>
            </div>
            <div className="hidden rounded-2xl border border-white/8 bg-white/4 px-3 py-2 text-right text-xs text-muted-foreground sm:block">
              <p>{resumeStats.words} words</p>
              <p>{resumeStats.chars} characters</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Company">
              <SearchableSelect
                value={company}
                onChange={setCompany}
                options={COMPANY_SUGGESTIONS}
                placeholder="e.g. Google"
                searchPlaceholder="Search companies..."
                emptyLabel="No company found."
                icon={Building2}
              />
            </Field>

            <Field label="Role">
              <SearchableSelect
                value={role}
                onChange={setRole}
                options={ROLE_SUGGESTIONS}
                placeholder="e.g. Backend Engineer"
                searchPlaceholder="Search roles..."
                emptyLabel="No role found."
                icon={Target}
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <SuggestionRow
              label="Popular companies"
              values={COMPANY_SUGGESTIONS}
              onPick={setCompany}
            />
            <SuggestionRow
              label="Popular roles"
              values={ROLE_SUGGESTIONS}
              onPick={setRole}
            />
          </div>

          <Field label="Upload resume" className="mt-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "rounded-[26px] border border-dashed p-5 transition-all duration-200",
                isDragging
                  ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(6,182,212,0.18)]"
                  : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Drop your resume here</p>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
                      Drag and drop here or choose a file. We extract the text in your browser and send only the resume text to the analyzer API.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={extracting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/6 px-4 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {extracting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Reading file...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Choose file
                    </>
                  )}
                </button>
              </div>

              {uploadedFileName ? (
                <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{uploadedFileName}</p>
                    <p className="text-xs text-muted-foreground">Text extracted and added to the resume field below.</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearUploadedFile}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear file
                  </button>
                </div>
              ) : null}

              {company.trim() && role.trim() ? (
                <p className="mt-4 rounded-xl bg-white/4 px-3 py-2 text-xs text-muted-foreground">
                  Uploaded files will auto-run the analysis for {company.trim()} and {role.trim()}.
                </p>
              ) : (
                <p className="mt-4 rounded-xl bg-white/4 px-3 py-2 text-xs text-muted-foreground">
                  Add company and role first if you want uploaded files to auto-run analysis.
                </p>
              )}
            </div>
          </Field>

          <Field label="Resume text" className="mt-4">
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here, or upload a file above. Include impact, projects, internships, tools, and measurable outcomes for better analysis."
              className="min-h-[320px] w-full rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-4 py-4 text-sm leading-7 text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 sm:min-h-[380px]"
            />
          </Field>

          {error ? (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          {!token ? (
            <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
              Sign in to use the analyzer API.
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
            <button
              onClick={() => {
                void runAnalysis()
              }}
              disabled={!canAnalyze}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7C3AED_0%,#9061F9_45%,#06B6D4_100%)] px-5 text-sm font-bold text-primary-foreground shadow-[0_18px_40px_rgba(124,58,237,0.28)] transition hover:scale-[0.99] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[190px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : extracting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing resume...
                </>
              ) : (
                <>
                  <FileSearch className="h-4 w-4" />
                  Analyze resume
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-xs leading-6 text-muted-foreground">
              The review is tailored to <span className="mx-1 font-semibold text-foreground">{company || "your target company"}</span>
              for <span className="ml-1 font-semibold text-foreground">{role || "your target role"}</span>.
            </div>
          </div>
        </section>

        <section className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          {loading ? (
            <StateCard
              icon={Loader2}
              title="Analyzing your resume"
              description={`Comparing your resume against ${company || "the target company"} for ${role || "the selected role"}.`}
              iconClassName="animate-spin text-primary"
            />
          ) : null}

          {!loading && !result ? (
            <StateCard
              icon={Target}
              title="Results will appear here"
              description="You’ll see your overall score, ATS score, strengths, missing skills, keywords, and suggestions in a mobile-friendly layout."
            />
          ) : null}

          {result ? (
            <>
              <div className="glass-card rounded-[26px] border border-border p-5 sm:p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Analysis summary
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-foreground">Match overview</h3>
                      <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                        {result.summary || "Analysis complete."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <ScoreRing label="Overall" score={result.overallScore} />
                      <ScoreRing label="ATS" score={result.atsScore} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <MetricStrip
                      label="Strengths found"
                      value={String(result.strengths?.length ?? 0)}
                    />
                    <MetricStrip
                      label="Skill gaps"
                      value={String(result.missingSkills?.length ?? 0)}
                    />
                    <MetricStrip
                      label="Keyword misses"
                      value={String(result.keywordsMissing?.length ?? 0)}
                    />
                  </div>
                </div>
              </div>

              <InsightCard
                title="Strengths"
                icon={CheckCircle2}
                accentClassName="border-green-500/20 bg-green-500/5"
                iconClassName="text-green-400"
                items={result.strengths}
                emptyLabel="No strengths were returned by the API."
              />

              <TagCard
                title="Missing skills"
                accentClassName="border-red-500/20 bg-red-500/5"
                values={result.missingSkills}
                emptyLabel="No missing skills detected."
                tagClassName="border-red-500/20 bg-red-500/10 text-red-300"
              />

              <TagCard
                title="Missing keywords"
                accentClassName="border-yellow-500/20 bg-yellow-500/5"
                values={result.keywordsMissing}
                emptyLabel="No missing keywords detected."
                tagClassName="border-yellow-500/20 bg-yellow-500/10 text-yellow-200"
              />

              <InsightCard
                title="Suggestions"
                icon={Sparkles}
                accentClassName="border-primary/20 bg-primary/5"
                iconClassName="text-primary"
                items={result.suggestions}
                emptyLabel="No suggestions were returned by the API."
              />

              <RewriteCard
                suggestions={result.suggestions}
                quickWins={result.quickWins}
                missingSkills={result.missingSkills}
              />
            </>
          ) : null}
        </section>
      </div>
    </div>
  )
}

async function extractTextFromFile(file: File) {
  const fileName = file.name.toLowerCase()

  if (file.type === "text/plain" || fileName.endsWith(".txt")) {
    return file.text()
  }

  if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
    return extractTextFromPdf(file)
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return extractTextFromDocx(file)
  }

  throw new Error("Unsupported file type")
}

async function extractTextFromPdf(file: File) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  const pages: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()

    if (pageText) {
      pages.push(pageText)
    }
  }

  return pages.join("\n\n")
}

async function extractTextFromDocx(file: File) {
  const mammoth = await import("mammoth")
  const arrayBuffer = await file.arrayBuffer()
  const { value } = await mammoth.extractRawText({ arrayBuffer })
  return value
}

function sanitizeResumeText(text: string) {
  return text
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s([—–•])/g, " $1")
    .trim()
}

function Field({
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
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}

function SuggestionRow({
  label,
  values,
  onPick,
}: {
  label: string
  values: string[]
  onPick: (value: string) => void
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onPick(value)}
            className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-foreground transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10"
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}

function StateCard({
  icon: Icon,
  title,
  description,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  iconClassName?: string
}) {
  return (
    <div className="glass-card flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-white/8 p-8 text-center">
      <div className="mb-4 rounded-2xl border border-white/8 bg-white/4 p-4">
        <Icon className={cn("h-7 w-7 text-muted-foreground", iconClassName)} />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function ScoreRing({
  label,
  score,
}: {
  label: string
  score?: number
}) {
  const safeScore = typeof score === "number" ? Math.max(0, Math.min(100, score)) : 0
  const toneClassName =
    typeof score !== "number"
      ? "text-muted-foreground"
      : score >= 80
        ? "text-green-400"
        : score >= 60
          ? "text-yellow-400"
          : "text-red-400"

  return (
    <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className="mt-3 flex justify-center">
        <div
          className="grid h-24 w-24 place-items-center rounded-full"
          style={{
            background: `conic-gradient(from 180deg, rgba(124,58,237,1) 0deg, rgba(6,182,212,1) ${safeScore * 3.6}deg, rgba(255,255,255,0.08) ${safeScore * 3.6}deg 360deg)`,
          }}
        >
          <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-background text-center">
            <span className={cn("text-2xl font-black", toneClassName)}>{typeof score === "number" ? score : "--"}</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">out of 100</p>
    </div>
  )
}

function InsightCard({
  title,
  icon: Icon,
  items,
  emptyLabel,
  accentClassName,
  iconClassName,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  items?: string[]
  emptyLabel: string
  accentClassName: string
  iconClassName: string
}) {
  return (
    <div className={cn("glass-card rounded-[28px] border p-5 shadow-[0_10px_30px_rgba(0,0,0,0.14)] sm:p-6", accentClassName)}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("h-4 w-4", iconClassName)} />
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-foreground">{title}</h3>
      </div>
      {items?.length ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <p key={`${title}-${index}`} className="text-sm leading-6 text-foreground">
              • {item}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </div>
  )
}

function TagCard({
  title,
  values,
  emptyLabel,
  accentClassName,
  tagClassName,
}: {
  title: string
  values?: string[]
  emptyLabel: string
  accentClassName: string
  tagClassName: string
}) {
  return (
    <div className={cn("glass-card rounded-[28px] border p-5 shadow-[0_10px_30px_rgba(0,0,0,0.14)] sm:p-6", accentClassName)}>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-foreground">{title}</h3>
      {values?.length ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <span
              key={`${title}-${index}`}
              className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", tagClassName)}
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </div>
  )
}

function HeroBadge({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-background/35 p-4 backdrop-blur-xl">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function ChecklistItem({
  done,
  label,
}: {
  done: boolean
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("rounded-full p-1", done ? "bg-emerald-500/15 text-emerald-400" : "bg-white/6 text-muted-foreground")}>
        <CheckCircle2 className="h-4 w-4" />
      </div>
      <p className={cn("text-sm", done ? "text-foreground" : "text-muted-foreground")}>{label}</p>
    </div>
  )
}

function MiniFeature({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2">
      <Icon className="h-4 w-4 text-primary" />
      <span>{label}</span>
    </div>
  )
}

function MetricStrip({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black text-foreground">{value}</p>
    </div>
  )
}

function RewriteCard({
  suggestions,
  quickWins,
  missingSkills,
}: {
  suggestions?: string[]
  quickWins?: string[]
  missingSkills?: string[]
}) {
  const beforeItems = (missingSkills || []).slice(0, 3)
  const afterItems = (quickWins?.length ? quickWins : suggestions || []).slice(0, 3)

  return (
    <div className="glass-card rounded-[28px] border border-cyan-500/20 bg-cyan-500/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.14)] sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <ScanSearch className="h-4 w-4 text-cyan-300" />
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-foreground">Before vs Improve</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/8 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-300">Before</p>
          <div className="mt-3 space-y-2">
            {beforeItems.length ? (
              beforeItems.map((item, index) => (
                <p key={`before-${index}`} className="text-sm leading-6 text-foreground">
                  • Add stronger evidence around {item}
                </p>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Your biggest gaps will appear here once the analyzer finds missing skills.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Improve</p>
          <div className="mt-3 space-y-2">
            {afterItems.length ? (
              afterItems.map((item, index) => (
                <p key={`after-${index}`} className="text-sm leading-6 text-foreground">
                  • {item}
                </p>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Quick rewrite ideas will appear here after analysis.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  icon: Icon,
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
  searchPlaceholder: string
  emptyLabel: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 text-sm text-foreground transition hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className={cn("truncate", value ? "text-foreground" : "text-muted-foreground")}>
              {value || placeholder}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] rounded-2xl border-white/10 bg-[#14141c]/95 p-0 backdrop-blur-xl"
      >
        <Command className="bg-transparent">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className="mx-1 my-1 rounded-xl px-3 py-2"
                >
                  <Check className={cn("h-4 w-4", value === option ? "opacity-100 text-primary" : "opacity-0")} />
                  <span>{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
