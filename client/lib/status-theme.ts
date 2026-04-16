export type ApplicationStatus = "applied" | "shortlisted" | "interview" | "offer" | "rejected"

type StatusTheme = {
  label: string
  hex: string
  dotClassName: string
  softClassName: string
  cardClassName: string
  pillClassName: string
  textClassName: string
}

export const STATUS_THEME: Record<ApplicationStatus, StatusTheme> = {
  applied: {
    label: "Applied",
    hex: "#3B82F6",
    dotClassName: "bg-blue-500",
    softClassName: "border-blue-500/20 bg-blue-500/10",
    cardClassName: "border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.12),rgba(17,17,24,0.92))]",
    pillClassName: "bg-blue-500 text-white",
    textClassName: "text-blue-300",
  },
  shortlisted: {
    label: "Shortlisted",
    hex: "#F59E0B",
    dotClassName: "bg-amber-500",
    softClassName: "border-amber-500/20 bg-amber-500/10",
    cardClassName: "border-amber-500/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.12),rgba(17,17,24,0.92))]",
    pillClassName: "bg-amber-500 text-black",
    textClassName: "text-amber-300",
  },
  interview: {
    label: "Interview",
    hex: "#8B5CF6",
    dotClassName: "bg-violet-500",
    softClassName: "border-violet-500/20 bg-violet-500/10",
    cardClassName: "border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),rgba(17,17,24,0.92))]",
    pillClassName: "bg-violet-500 text-white",
    textClassName: "text-violet-300",
  },
  offer: {
    label: "Offer",
    hex: "#22C55E",
    dotClassName: "bg-green-500",
    softClassName: "border-green-500/20 bg-green-500/10",
    cardClassName: "border-green-500/20 bg-[linear-gradient(180deg,rgba(34,197,94,0.12),rgba(17,17,24,0.92))]",
    pillClassName: "bg-green-500 text-white",
    textClassName: "text-green-300",
  },
  rejected: {
    label: "Rejected",
    hex: "#EF4444",
    dotClassName: "bg-red-500",
    softClassName: "border-red-500/20 bg-red-500/10",
    cardClassName: "border-red-500/20 bg-[linear-gradient(180deg,rgba(239,68,68,0.12),rgba(17,17,24,0.92))]",
    pillClassName: "bg-red-500 text-white",
    textClassName: "text-red-300",
  },
}

export function getStatusTheme(status: string) {
  return STATUS_THEME[(status in STATUS_THEME ? status : "applied") as ApplicationStatus]
}
