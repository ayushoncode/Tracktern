import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-[rgba(139,92,246,0.19)] bg-[rgba(139,92,246,0.08)] text-[#A78BFA]',
        secondary: 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-foreground',
        destructive: 'border-[rgba(239,68,68,0.19)] bg-[rgba(239,68,68,0.08)] text-[#F87171]',
        outline: 'border-[rgba(255,255,255,0.12)] bg-transparent text-foreground',
        applied: 'border-[rgba(59,130,246,0.19)] bg-[rgba(59,130,246,0.08)] text-[#60A5FA]',
        shortlisted: 'border-[rgba(245,158,11,0.19)] bg-[rgba(245,158,11,0.08)] text-[#FBB947]',
        interview: 'border-[rgba(139,92,246,0.19)] bg-[rgba(139,92,246,0.08)] text-[#A78BFA]',
        offer: 'border-[rgba(34,197,94,0.19)] bg-[rgba(34,197,94,0.08)] text-[#4ADE80]',
        rejected: 'border-[rgba(239,68,68,0.19)] bg-[rgba(239,68,68,0.08)] text-[#F87171]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
