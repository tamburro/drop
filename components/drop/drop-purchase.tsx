"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  dropId: string
  isLive: boolean
  remaining: number
}

export function DropPurchase({ dropId, isLive, remaining }: Props) {
  const soldOut = remaining <= 0

  if (isLive && !soldOut) {
    return <BuyForm dropId={dropId} remaining={remaining} />
  }

  return <WaitlistForm dropId={dropId} soldOut={soldOut} />
}

function BuyForm({ dropId, remaining }: { dropId: string; remaining: number }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dropId,
        buyerEmail: formData.get("email"),
        buyerName: formData.get("name") || undefined,
        quantity: Number(formData.get("quantity")),
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? "Erro ao iniciar pagamento")
      setLoading(false)
      return
    }
    window.location.href = data.url
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" placeholder="Seu nome" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="voce@email.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          max={Math.min(remaining, 10)}
          defaultValue={1}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {loading ? "Redirecionando..." : "Comprar agora"}
      </Button>
    </form>
  )
}

function WaitlistForm({ dropId, soldOut }: { dropId: string; soldOut: boolean }) {
  const [position, setPosition] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dropId, email: formData.get("email") }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? "Erro ao entrar na fila")
      setLoading(false)
      return
    }
    setPosition(data.position)
    setLoading(false)
  }

  if (position !== null) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">Você está na fila!</p>
        <p className="text-2xl font-bold text-accent">#{position}</p>
        <p className="text-xs text-muted-foreground">
          Avisaremos você quando o drop abrir, com acesso antecipado.
        </p>
      </div>
    )
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {soldOut
          ? "Esgotado. Entre na fila para o próximo lote ou drop."
          : "Entre na lista de espera e ganhe acesso antecipado no lançamento."}
      </p>
      <div className="space-y-2">
        <Label htmlFor="wl-email">Email</Label>
        <Input id="wl-email" name="email" type="email" required placeholder="voce@email.com" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {loading ? "Entrando..." : "Entrar na lista de espera"}
      </Button>
    </form>
  )
}
