import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface AppPageHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  actionVariant?: "default" | "outline" | "secondary" | "destructive"
  className?: string
}

export function AppPageHeader({
  title,
  subtitle,
  icon: Icon,
  actionLabel,
  onAction,
  actionHref,
  actionVariant = "default",
  className,
}: AppPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(124,58,237,0.1)] text-primary">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
          <h1 className="page-title">{title}</h1>
        </div>
        {subtitle ? <p className="body-copy mt-2">{subtitle}</p> : null}
      </div>

      {actionLabel ? (
        actionHref ? (
          <Button asChild variant={actionVariant}>
            <a href={actionHref}>{actionLabel}</a>
          </Button>
        ) : (
          <Button variant={actionVariant} onClick={onAction}>
            {actionLabel}
          </Button>
        )
      ) : null}
    </div>
  )
}
