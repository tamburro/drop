"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export function NewDropForm({ handle }: { handle: string | null }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    slug: "",
    slugTouched: false,
    description: "",
    coverImage: "",
    price: "",
    stock: "",
    launchAt: "",
    status: "DRAFT",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function onTitle(value: string) {
    setForm((f) => ({ ...f, title: value, slug: f.slugTouched ? f.slug : slugify(value) }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const priceCents = Math.round(parseFloat(form.price.replace(",", ".")) * 100)
    const stock = parseInt(form.stock, 10)
    if (!form.launchAt) return setError("Informe a data de lançamento")
    if (Number.isNaN(priceCents) || priceCents < 100) return setError("Preço mínimo: R$ 1,00")
    if (Number.isNaN(stock) || stock < 1) return setError("Estoque mínimo: 1")

    setLoading(true)
    const res = await fetch("/api/drops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        slug: form.slug,
        description: form.description || undefined,
        coverImage: form.coverImage,
        price: priceCents,
        stock,
        launchAt: new Date(form.launchAt).toISOString(),
        status: form.status,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setLoading(false)
      setError(typeof data.error === "string" ? data.error : "Erro ao criar drop")
      return
    }
    router.push("/dashboard/drops")
    router.refresh()
  }

  if (!handle) {
    return (
      <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-accent">
        Configure sua vitrine (@handle) antes de criar um drop.{" "}
        <a href="/dashboard/storefront" className="underline">
          Ir para Minha vitrine
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" value={form.title} onChange={(e) => onTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value), slugTouched: true }))}
          onFocus={() => set("slugTouched", true)}
          required
        />
        <p className="text-xs text-muted-foreground">usedrop-br.vercel.app/{handle}/{form.slug || "slug"}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Capa (URL)</Label>
        <Input id="coverImage" value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://..." />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" inputMode="decimal" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="99,90" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Estoque</Label>
          <Input id="stock" type="number" min={1} value={form.stock} onChange={(e) => set("stock", e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="launchAt">Lançamento</Label>
          <Input id="launchAt" type="datetime-local" value={form.launchAt} onChange={(e) => set("launchAt", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="DRAFT">Rascunho</option>
            <option value="SCHEDULED">Agendado</option>
            <option value="LIVE">Ao vivo</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
        {loading ? "Criando..." : "Criar drop"}
      </Button>
    </form>
  )
}
