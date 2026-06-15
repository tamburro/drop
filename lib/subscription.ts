import { Plan } from "@prisma/client"

type UserForSubscription = {
  plan: Plan
  trialEndsAt: Date | null
  stripeCurrentPeriodEnd: Date | null
}

export function isTrialActive(user: UserForSubscription): boolean {
  return user.plan === "TRIAL" && !!user.trialEndsAt && user.trialEndsAt > new Date()
}

export function isSubscribed(user: UserForSubscription): boolean {
  return (
    user.plan === "PRO" &&
    !!user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd > new Date()
  )
}

export function hasAccess(user: UserForSubscription): boolean {
  return isTrialActive(user) || isSubscribed(user)
}

export function daysLeftInTrial(user: UserForSubscription): number {
  if (!user.trialEndsAt) return 0
  const diff = user.trialEndsAt.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
