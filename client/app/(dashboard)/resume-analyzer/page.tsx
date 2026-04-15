"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  FileSearch,
  FileText,
  Upload,
  Loader2,
  Sparkles,
  Target,
  X,
} from "lucide-react"

import { getToken } from "@/lib/api"
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

  const analyze = async (resumeText = resume) => {
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
        setError(data?.message || "Could not analyze this resume right now. Please try again.")
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

      const extractedResume = extractedText.trim()

      setResume(extractedResume)
      setUploadedFileName(file.name)

      if (company.trim() && role.trim() && token) {
        await analyze(extractedResume)
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
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-background p-5 sm:p-7 lg:p-8">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_60%)] lg:block" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Resume Analyzer
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Tune your resume for the role you actually want
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Upload a PDF or DOCX, or paste your resume text, then get an AI review with score, gaps, keywords, and next-step suggestions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-fit">
            <StatCard label="Target company" value={company || "Choose one"} icon={Building2} />
            <StatCard label="Resume length" value={resumeStats.words ? `${resumeStats.words} words` : "No text yet"} icon={FileText} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <section className="glass-card rounded-[26px] border border-border p-4 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">Resume input</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add the job context first so the analysis can be tailored.
              </p>
            </div>
            <div className="hidden rounded-2xl border border-border bg-secondary/40 px-3 py-2 text-right text-xs text-muted-foreground sm:block">
              <p>{resumeStats.words} words</p>
              <p>{resumeStats.chars} characters</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company">
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
                className="h-11 w-full rounded-xl border border-border bg-secondary/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </Field>

            <Field label="Role">
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SWE Intern"
                className="h-11 w-full rounded-xl border border-border bg-secondary/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </Field>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                "rounded-2xl border border-dashed bg-secondary/30 p-4 transition",
                isDragging ? "border-primary bg-primary/10" : "border-border"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-border bg-background/70 p-3">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">PDF, DOCX, or TXT</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Drag and drop here or choose a file. We extract the text in your browser and send only the resume text to the analyzer API.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={extracting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
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
                <div className="mt-3 flex flex-col gap-2 rounded-xl border border-border bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between">
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
                <p className="mt-3 text-xs text-muted-foreground">
                  Uploaded files will auto-run the analysis for {company.trim()} and {role.trim()}.
                </p>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">
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
              className="min-h-[300px] w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm leading-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 sm:min-h-[360px]"
            />
          </Field>

          {error ? (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}

          {!token ? (
            <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-200">
              Sign in to use the analyzer API.
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={analyze}
              disabled={!canAnalyze}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
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
                </>
              )}
            </button>

            <div className="flex items-center text-xs text-muted-foreground">
              The review is tailored to <span className="mx-1 font-semibold text-foreground">{company || "your target company"}</span>
              for <span className="ml-1 font-semibold text-foreground">{role || "your target role"}</span>.
            </div>
          </div>
        </section>

        <section className="space-y-4">
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
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Analysis summary
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-foreground">Match overview</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {result.summary || "Analysis complete."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ScoreCard label="Overall" score={result.overallScore} />
                    <ScoreCard label="ATS" score={result.atsScore} />
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

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="min-w-[145px] rounded-2xl border border-border bg-background/70 p-3 backdrop-blur">
      <Icon className="mb-2 h-4 w-4 text-primary" />
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
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
            className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground transition hover:border-primary/40 hover:bg-primary/10"
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
    <div className="glass-card flex min-h-[260px] flex-col items-center justify-center rounded-[26px] border border-border p-8 text-center">
      <div className="mb-4 rounded-2xl border border-border bg-secondary/50 p-4">
        <Icon className={cn("h-7 w-7 text-muted-foreground", iconClassName)} />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function ScoreCard({
  label,
  score,
}: {
  label: string
  score?: number
}) {
  const toneClassName =
    typeof score !== "number"
      ? "text-muted-foreground"
      : score >= 80
        ? "text-green-400"
        : score >= 60
          ? "text-yellow-400"
          : "text-red-400"

  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className={cn("mt-2 text-3xl font-black", toneClassName)}>{typeof score === "number" ? score : "--"}</div>
      <p className="mt-1 text-xs text-muted-foreground">out of 100</p>
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
    <div className={cn("glass-card rounded-3xl border p-5 sm:p-6", accentClassName)}>
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
    <div className={cn("glass-card rounded-3xl border p-5 sm:p-6", accentClassName)}>
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
