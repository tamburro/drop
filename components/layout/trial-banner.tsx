"use client"

import { ButtonLink } from "@/components/ui/button-link"

interface TrialBannerProps {
  daysLeft: number
}

export function TrialBanner({ daysLeft }: TrialBannerProps) {
  return (
    <div className="flex items-center justify-between bg-accent/10 border-b border-accent/20 px-4 py-2 text-sm">
      <span className="text-foreground">
        Trial gratuito — <strong>{daysLeft} dia{daysLeft !== 1 ? "s" : ""}</strong> restante{daysLeft !== 1 ? "s" : ""}
      </span>
      <ButtonLink
        href="/settings/billing"
        size="sm"
        className="h-7 bg-accent text-accent-foreground hover:bg-accent/90"
      >
        Fazer upgrade
      </ButtonLink>
    </div>
  )
}
