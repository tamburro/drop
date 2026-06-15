import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaywallGate } from "@/components/paywall/paywall-gate"
import { hasAccess, isSubscribed, isTrialActive } from "@/lib/subscription"
import { PLAN_LIMITS } from "@/lib/plans"

export default async function AnalyticsPage() {
  const session = await auth()
  const user = await db.user.findUniqueOrThrow({ where: { id: session!.user!.id! } })

  const hasAnalytics = PLAN_LIMITS[user.plan].analytics

  if (!hasAnalytics) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <PaywallGate
          locked={true}
          title="Analytics PRO"
          description="Veja conversão de waitlist, receita por drop e taxa de sell-out. Disponível no plano PRO."
        >
          <div />
        </PaywallGate>
      </div>
    )
  }

  const drops = await db.drop.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { orders: true, waitlistEntries: true } },
      orders: { where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } }, select: { total: true } },
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>

      <div className="space-y-4">
        {drops.map((drop) => {
          const revenue = drop.orders.reduce((acc, o) => acc + o.total, 0) / 100
          const conversionRate =
            drop._count.waitlistEntries > 0
              ? ((drop._count.orders / drop._count.waitlistEntries) * 100).toFixed(1)
              : "0"
          const soldOut = drop.status === "SOLD_OUT"

          return (
            <Card key={drop.id} className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">{drop.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Waitlist</p>
                  <p className="text-xl font-bold text-foreground">{drop._count.waitlistEntries}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pedidos</p>
                  <p className="text-xl font-bold text-foreground">{drop._count.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conversão</p>
                  <p className="text-xl font-bold text-accent">{conversionRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Receita</p>
                  <p className="text-xl font-bold text-foreground">R$ {revenue.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
