import { Badge } from "@/components/ui/badge"

type Status = "wishlist" | "applied" | "shortlisted" | "interview" | "offer" | "rejected"

export function StatusPill({ status }: { status: Status | string }) {
  const variant = (["wishlist", "applied", "shortlisted", "interview", "offer", "rejected"].includes(status)
    ? status
    : "outline") as "wishlist" | "applied" | "shortlisted" | "interview" | "offer" | "rejected" | "outline"

  return <Badge variant={variant}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}
