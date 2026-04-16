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
    text: "text-blue-300",
    border: "border-blue-500/20 bg-[linear-gradient(180deg,rgba(59,130,246,0.12),rgba(17,17,24,0.92))]",
  },
  yellow: {
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.12),rgba(17,17,24,0.92))]",
  },
  purple: {
    bg: "bg-violet-500/10",
    text: "text-violet-300",
    border: "border-violet-500/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.12),rgba(17,17,24,0.92))]",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-300",
    border: "border-green-500/20 bg-[linear-gradient(180deg,rgba(34,197,94,0.12),rgba(17,17,24,0.92))]",
  },
}

export function StatCard({ title, value, icon: Icon, color, change }: StatCardProps) {
  const colors = colorVariants[color]

  return (
    <div className={cn(
      "glass-card rounded-xl p-5 border relative overflow-hidden",
      colors.border
    )}>
      <div className="absolute inset-x-0 top-0 h-px bg-white/8" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p className="text-xs text-muted-foreground mt-1">{change}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.text)} />
        </div>
      </div>
    </div>
  )
}
