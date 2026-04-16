import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: "blue" | "yellow" | "purple" | "green"
  change?: string
}

const colorVariants = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  purple: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
  },
}

export function StatCard({ title, value, icon: Icon, color, change }: StatCardProps) {
  const colors = colorVariants[color]

  return (
    <div className={cn(
      "glass-card rounded-xl border border-[rgba(255,255,255,0.08)] px-6 py-5",
    )}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-number mt-2">{value}</p>
          {change && (
            <p className="mt-2 text-xs text-muted-foreground">{change}</p>
          )}
        </div>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(124,58,237,0.1)]", colors.bg)}>
          <Icon className={cn("h-4 w-4", colors.text)} />
        </div>
      </div>
    </div>
  )
}
