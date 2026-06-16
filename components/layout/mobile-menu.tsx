"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const LINKS = [
  { href: "/explorar", label: "Explorar" },
  { href: "/#planos", label: "Planos" },
  { href: "/login", label: "Entrar" },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[57px] z-40 border-b border-border bg-background/95 backdrop-blur">
          <nav className="flex flex-col p-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm text-foreground transition-colors hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent px-4 py-3 text-center text-sm font-medium text-accent-foreground"
            >
              Começar grátis
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
