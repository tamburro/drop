"use client"

import { useEffect, useRef } from "react"

type P = { x: number; y: number; vx: number; vy: number; r: number }

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const cv = canvas
    const c = ctx

    let w = 0, h = 0, raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mouse = { x: -9999, y: -9999 }
    let particles: P[] = []

    function resize() {
      const rect = cv.parentElement!.getBoundingClientRect()
      w = rect.width
      h = rect.height
      cv.width = w * dpr
      cv.height = h * dpr
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(110, Math.floor((w * h) / 14000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.4,
      }))
    }

    function step() {
      c.clearRect(0, 0, w, h)
      for (const p of particles) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < 120) {
          const f = (120 - dist) / 120
          p.vx += (dx / dist) * f * 0.6
          p.vy += (dy / dist) * f * 0.6
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        c.beginPath()
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        c.fillStyle = "rgba(18, 168, 196, 0.55)"
        c.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 90) {
            c.beginPath()
            c.moveTo(a.x, a.y)
            c.lineTo(b.x, b.y)
            c.strokeStyle = `rgba(10, 58, 74, ${0.5 * (1 - d / 90)})`
            c.stroke()
          }
        }
      }
      raf = requestAnimationFrame(step)
    }

    function onMove(e: MouseEvent) {
      const rect = cv.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    step()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)
    cv.parentElement!.addEventListener("mouseleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      cv.parentElement?.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
}
