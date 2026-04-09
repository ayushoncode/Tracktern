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
      "glass-card rounded-xl p-5 border",
      colors.border
    )}>
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
