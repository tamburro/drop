"use client"

import { useEffect, useState } from "react"

function diff(target: number) {
  const ms = Math.max(0, target - Date.now())
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms % 86400000) / 3600000),
    m: Math.floor((ms % 3600000) / 60000),
    s: Math.floor((ms % 60000) / 1000),
    done: ms <= 0,
  }
}

export function Countdown({ launchAt }: { launchAt: string }) {
  const target = new Date(launchAt).getTime()
  const [t, setT] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (t.done) return null

  const cells: [number, string][] = [
    [t.d, "dias"],
    [t.h, "h"],
    [t.m, "min"],
    [t.s, "s"],
  ]

  return (
    <div className="flex gap-3">
      {cells.map(([value, label]) => (
        <div key={label} className="flex flex-col items-center rounded-lg border border-border bg-card px-3 py-2">
          <span className="font-mono text-2xl font-bold text-foreground">{String(value).padStart(2, "0")}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}
