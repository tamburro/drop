"use client"

import { useRef } from "react"
import Link from "next/link"

export function MagneticLink({
  href,
  children,
  className = "",
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(pointer: coarse)").matches) return
    const r = el.getBoundingClientRect()
    const mx = e.clientX - (r.left + r.width / 2)
    const my = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`
  }
  function reset() {
    if (ref.current) ref.current.style.transform = ""
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      data-cursor
      className={`inline-flex items-center justify-center transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </Link>
  )
}
