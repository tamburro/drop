"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

type Initial = {
  handle: string
  brandName: string
  avatar: string
  accentColor: string
  bio: string
  instagram: string
  tiktok: string
  site: string
}

export function StorefrontForm({ initial }: { initial: Initial }) {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState<"idle" | "saving">("idle")
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  function set<K extends keyof Initial>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("saving")
    setMessage(null)
    const res = await fetch("/api/storefront", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle: form.handle,
        brandName: form.brandName,
        avatar: form.avatar,
        accentColor: form.accentColor,
        bio: form.bio,
        socials: { instagram: form.instagram, tiktok: form.tiktok, site: form.site },
      }),
    })
    const data = await res.json()
    setStatus("idle")
    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? "Erro ao salvar" })
      return
    }
    setMessage({ type: "ok", text: "Vitrine salva com sucesso." })
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="handle">@handle (URL da sua vitrine)</Label>
          <Input
            id="handle"
            value={form.handle}
            onChange={(e) => set("handle", e.target.value.toLowerCase())}
            placeholder="suamarca"
            required
          />
          <p className="text-xs text-muted-foreground">usedrop-br.vercel.app/{form.handle || "suamarca"}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandName">Nome da marca</Label>
          <Input id="brandName" value={form.brandName} onChange={(e) => set("brandName", e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar">Avatar (URL)</Label>
          <Input id="avatar" value={form.avatar} onChange={(e) => set("avatar", e.target.value)} placeholder="https://..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accentColor">Cor de acento</Label>
          <div className="flex items-center gap-3">
            <input
              id="accentColor"
              type="color"
              value={form.accentColor}
              onChange={(e) => set("accentColor", e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent"
            />
            <Input value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="max-w-[140px]" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            maxLength={280}
            rows={3}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@perfil" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input id="tiktok" value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="@perfil" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Input id="site" value={form.site} onChange={(e) => set("site", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        {message && (
          <p className={message.type === "ok" ? "text-sm text-accent" : "text-sm text-destructive"}>{message.text}</p>
        )}

        <Button type="submit" disabled={status === "saving"} className="bg-accent text-accent-foreground hover:bg-accent/90">
          {status === "saving" ? "Salvando..." : "Salvar vitrine"}
        </Button>
      </form>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Prévia</p>
        <Card className="border-border bg-card" style={{ ["--accent" as string]: form.accentColor }}>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            {form.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.avatar} alt="" className="h-16 w-16 rounded-full border border-border object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: form.accentColor }}>
                <span className="text-lg font-bold text-background">
                  {(form.brandName || "D").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-bold text-foreground">{form.brandName || "Sua marca"}</p>
              <p className="text-xs" style={{ color: form.accentColor }}>@{form.handle || "suamarca"}</p>
            </div>
            {form.bio && <p className="text-xs text-muted-foreground">{form.bio}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
