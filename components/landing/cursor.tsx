"use client"

import { useEffect, useRef } from "react"

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    let rx = 0, ry = 0, x = 0, y = 0
    let raf = 0

    function onMove(e: MouseEvent) {
      x = e.clientX
      y = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`
      const t = e.target as HTMLElement
      const active = !!t.closest("a, button, [data-cursor]")
      if (ring.current) ring.current.dataset.active = active ? "true" : "false"
    }
    function loop() {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener("mousemove", onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={ring}
        data-active="false"
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-4 -mt-4 hidden h-8 w-8 rounded-full border border-accent/60 transition-[width,height,opacity] duration-200 data-[active=true]:h-12 data-[active=true]:w-12 data-[active=true]:-ml-6 data-[active=true]:-mt-6 md:block"
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 hidden h-2 w-2 rounded-full bg-accent md:block"
      />
    </>
  )
}
