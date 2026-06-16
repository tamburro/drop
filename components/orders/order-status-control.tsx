"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type Status = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"

const NEXT_ACTIONS: Partial<Record<Status, { label: string; to: Status; variant?: "outline" }[]>> = {
  PAID: [
    { label: "Marcar enviado", to: "SHIPPED" },
    { label: "Cancelar", to: "CANCELLED", variant: "outline" },
  ],
  SHIPPED: [{ label: "Marcar entregue", to: "DELIVERED" }],
}

export function OrderStatusControl({ orderId, status }: { orderId: string; status: Status }) {
  const router = useRouter()
  const [loading, setLoading] = useState<Status | null>(null)
  const [error, setError] = useState(false)

  const actions = NEXT_ACTIONS[status]
  if (!actions) return null

  async function update(to: Status) {
    setLoading(to)
    setError(false)
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: to }),
    })
    if (!res.ok) {
      setError(true)
      setLoading(null)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      {actions.map((a) => (
        <Button
          key={a.to}
          size="sm"
          variant={a.variant ?? "default"}
          disabled={loading !== null}
          onClick={() => update(a.to)}
          className={a.variant === "outline" ? "border-border text-foreground" : "rounded-full bg-accent text-accent-foreground hover:bg-accent/90"}
        >
          {loading === a.to ? "..." : a.label}
        </Button>
      ))}
      {error && <span className="text-xs text-destructive">Erro</span>}
    </div>
  )
}
