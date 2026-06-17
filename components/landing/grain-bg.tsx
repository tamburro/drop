"use client"

import { GrainGradient, grainGradientPresets } from "@paper-design/shaders-react"

// cores do design system do Drop (background / primary / accent)
const DROP_COLORS = ["#0A3A4A", "#12A8C4", "#0A3A4A", "#040508"]

export function GrainBg({ className }: { className?: string }) {
  return (
    <GrainGradient
      {...grainGradientPresets[0].params}
      colors={DROP_COLORS}
      colorBack="#040508"
      speed={0.6}
      softness={0.7}
      intensity={0.45}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  )
}
