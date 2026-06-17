"use client"

import { GrainGradient, grainGradientPresets } from "@paper-design/shaders-react"

// puxado para o acento cyan do Drop, com a primária teal, sobre o fundo escuro
const DROP_COLORS = ["#12A8C4", "#0A3A4A", "#12A8C4", "#1FC8E0"]

export function GrainBg({ className }: { className?: string }) {
  return (
    <GrainGradient
      {...grainGradientPresets[0].params}
      colors={DROP_COLORS}
      colorBack="#040508"
      speed={0.6}
      softness={0.6}
      intensity={0.65}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  )
}
