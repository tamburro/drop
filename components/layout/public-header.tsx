import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { MobileMenu } from "@/components/layout/mobile-menu"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" aria-label="Drop — início">
          <Logo className="h-7 w-auto text-accent" />
        </Link>

        <nav className="hidden items-center gap-5 sm:flex">
          <Link href="/explorar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Explorar
          </Link>
          <Link href="/#planos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Planos
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Entrar
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Começar grátis
          </Link>
        </nav>

        <MobileMenu />
      </div>
    </header>
  )
}
