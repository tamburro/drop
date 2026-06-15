export const PLAN_LIMITS = {
  FREE: {
    drops: 1,
    waitlistEntries: 100,
    feePercent: 5,
    analytics: false,
  },
  TRIAL: {
    drops: Infinity,
    waitlistEntries: Infinity,
    feePercent: 0,
    analytics: true,
  },
  PRO: {
    drops: Infinity,
    waitlistEntries: Infinity,
    feePercent: 0,
    analytics: true,
  },
} as const

export type PlanKey = keyof typeof PLAN_LIMITS
