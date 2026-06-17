import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { TrialBanner } from "@/components/layout/trial-banner"
import { daysLeftInTrial, isTrialActive } from "@/lib/subscription"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Home, Package, ShoppingBag, BarChart2, Settings, Store } from "lucide-react"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await db.user.findUniqueOrThrow({ where: { id: session.user.id } })

  const showTrial = isTrialActive(user)
  const days = daysLeftInTrial(user)

  return (
    <div className="flex h-screen bg-background">
      <aside className="flex w-56 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
          <Logo className="h-7 w-auto text-accent" />
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {[
            { href: "/dashboard", label: "Início", icon: Home },
            { href: "/dashboard/drops", label: "Drops", icon: Package },
            { href: "/dashboard/storefront", label: "Minha vitrine", icon: Store },
            { href: "/dashboard/orders", label: "Pedidos", icon: ShoppingBag },
            { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
            { href: "/settings/billing", label: "Configurações", icon: Settings },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        {showTrial && <TrialBanner daysLeft={days} />}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
