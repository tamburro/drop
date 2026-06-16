"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type OtherDrop = { slug: string; title: string; price: number; coverImage: string | null }

type Props = {
  dropId: string
  dropTitle: string
  unitPrice: number
  isLive: boolean
  remaining: number
  handle: string
  otherDrops: OtherDrop[]
}

export function DropPurchase({ dropId, dropTitle, unitPrice, isLive, remaining, handle, otherDrops }: Props) {
  const soldOut = remaining <= 0

  if (isLive && !soldOut) {
    return (
      <BuyForm
        dropId={dropId}
        dropTitle={dropTitle}
        unitPrice={unitPrice}
        remaining={remaining}
        handle={handle}
        otherDrops={otherDrops}
      />
    )
  }
  return <WaitlistForm dropId={dropId} soldOut={soldOut} />
}

function formatBRL(cents: number) {
  return `R$ ${(cents / 100).toFixed(2)}`
}

function BuyForm({
  dropId,
  dropTitle,
  unitPrice,
  remaining,
  handle,
  otherDrops,
}: {
  dropId: string
  dropTitle: string
  unitPrice: number
  remaining: number
  handle: string
  otherDrops: OtherDrop[]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<{ name: string; email: string; quantity: number } | null>(null)

  function onConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPending({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      quantity: Number(fd.get("quantity")),
    })
    setError(null)
    setOpen(true)
  }

  async function onPay() {
    if (!pending) return
    setLoading(true)
    setError(null)
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dropId,
        buyerEmail: pending.email,
        buyerName: pending.name || undefined,
        quantity: pending.quantity,
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

  const total = pending ? unitPrice * pending.quantity : 0

  return (
    <>
      <form onSubmit={onConfirm} className="space-y-4">
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
          <Input id="quantity" name="quantity" type="number" min={1} max={Math.min(remaining, 10)} defaultValue={1} required />
        </div>
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          Comprar agora
        </Button>
      </form>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button aria-label="Fechar" className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-full max-w-sm flex-col border-l border-border bg-card p-6 shadow-xl">
            <button className="absolute right-4 top-4 text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-2 text-accent">
              <Check className="h-5 w-5" />
              <span className="font-semibold">Quase lá</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="font-medium text-foreground">{dropTitle}</p>
                <p className="text-sm text-muted-foreground">Quantidade: {pending?.quantity}</p>
              </div>
              <p className="font-semibold text-foreground">{formatBRL(total)}</p>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">{formatBRL(total)}</span>
            </div>

            {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

            <Button onClick={onPay} disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? "Redirecionando..." : "Ir para o pagamento"}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Cartão ou Pix no checkout seguro.</p>

            {otherDrops.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Leve também</p>
                <div className="space-y-3">
                  {otherDrops.map((d) => (
                    <a key={d.slug} href={`/${handle}/${d.slug}`} className="flex items-center gap-3 rounded-lg border border-border p-2 transition-colors hover:border-accent">
                      {d.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={d.coverImage} alt="" className="h-12 w-12 rounded-md object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/10 text-accent">
                          {d.title.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{formatBRL(d.price)}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  )
}

function WaitlistForm({ dropId, soldOut }: { dropId: string; soldOut: boolean }) {
  const [position, setPosition] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setLoading(true)
    setError(null)
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dropId, email: fd.get("email") }),
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
        <p className="text-xs text-muted-foreground">Avisaremos você quando o drop abrir, com acesso antecipado.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
      <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
        {loading ? "Entrando..." : "Entrar na lista de espera"}
      </Button>
    </form>
  )
}
