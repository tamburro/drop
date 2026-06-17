"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"

import { cn } from "@/lib/utils"

interface MagicCardProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
  gradientFrom?: string
  gradientTo?: string
}

export function MagicCard({
  children,
  className,
  gradientSize = 220,
  gradientColor = "#0D2A38",
  gradientOpacity = 0.8,
  gradientFrom = "#12A8C4",
  gradientTo = "#0A3A4A",
}: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [mouseX, mouseY, gradientSize])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <motion.div
      className={cn("group relative isolate overflow-hidden rounded-[inherit] border border-transparent", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{
        background: useMotionTemplate`
          linear-gradient(var(--color-background) 0 0) padding-box,
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            var(--color-border) 100%
          ) border-box
        `,
      }}
    >
      <div className="absolute inset-px z-20 rounded-[inherit] bg-background" />
      <motion.div
        className="pointer-events-none absolute inset-px z-30 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 100%
            )
          `,
          opacity: gradientOpacity,
        }}
      />
      <div className="relative z-40">{children}</div>
    </motion.div>
  )
}
