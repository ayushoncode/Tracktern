import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
  onCta?: () => void
}

export function EmptyState({ icon: Icon, title, subtitle, ctaLabel, ctaHref, onCta }: EmptyStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] px-6 py-10 text-center">
      <Icon className="h-8 w-8 text-[#52525B]" />
      <h3 className="mt-4 text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-[13px] text-muted-foreground">{subtitle}</p>
      {ctaLabel ? (
        ctaHref ? (
          <Button asChild className="mt-5">
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        ) : (
          <Button className="mt-5" onClick={onCta}>
            {ctaLabel}
          </Button>
        )
      ) : null}
    </div>
  )
}
