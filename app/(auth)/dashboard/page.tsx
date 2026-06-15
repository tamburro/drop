import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ButtonLink } from "@/components/ui/button-link"
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const [dropsCount, ordersCount, waitlistCount, revenue] = await Promise.all([
    db.drop.count({ where: { userId } }),
    db.order.count({ where: { drop: { userId }, status: { in: ["PAID", "SHIPPED", "DELIVERED"] } } }),
    db.waitlistEntry.count({ where: { drop: { userId } } }),
    db.order.aggregate({
      where: { drop: { userId }, status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      _sum: { total: true },
    }),
  ])

  const revenueTotal = (revenue._sum.total ?? 0) / 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
        <ButtonLink href="/dashboard/drops/new" className="bg-accent text-accent-foreground hover:bg-accent/90">
          + Novo Drop
        </ButtonLink>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Drops", value: dropsCount, icon: Package },
          { label: "Pedidos", value: ordersCount, icon: ShoppingBag },
          { label: "Na Waitlist", value: waitlistCount, icon: Users },
          { label: "Receita", value: `R$ ${revenueTotal.toFixed(2)}`, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
