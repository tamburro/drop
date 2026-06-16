import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { isSubscribed, isTrialActive, daysLeftInTrial } from "@/lib/subscription"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { redirect } from "next/navigation"
import { createCheckoutSession, createCustomerPortalSession } from "@/lib/stripe"

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; expired?: string }>
}) {
  const session = await auth()
  const user = await db.user.findUniqueOrThrow({ where: { id: session!.user!.id! } })
  const params = await searchParams

  const trial = isTrialActive(user)
  const subscribed = isSubscribed(user)

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-display text-3xl uppercase tracking-tight text-foreground">Assinatura</h1>

      {params.success && (
        <div className="rounded-md border border-accent/30 bg-accent/10 p-3 text-sm text-accent">
          Upgrade realizado com sucesso! Bem-vindo ao PRO.
        </div>
      )}

      {params.expired && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          Seu trial expirou. Faça upgrade para continuar usando o Drop.
        </div>
      )}

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Plano atual</CardTitle>
            <Badge variant={user.plan === "PRO" ? "default" : "secondary"}>{user.plan}</Badge>
          </div>
          <CardDescription className="text-muted-foreground">
            {trial && `Trial expira em ${daysLeftInTrial(user)} dia(s)`}
            {subscribed && user.stripeCurrentPeriodEnd &&
              `Renova em ${format(user.stripeCurrentPeriodEnd, "dd/MM/yyyy", { locale: ptBR })}`}
            {user.plan === "FREE" && "Plano gratuito com limite de 1 drop ativo"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!subscribed && (
            <form
              action={async () => {
                "use server"
                const s = await auth()
                const u = await db.user.findUniqueOrThrow({ where: { id: s!.user!.id! } })
                const checkout = await createCheckoutSession(u.id, u.email!)
                redirect(checkout.url!)
              }}
            >
              <Button type="submit" className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                Fazer upgrade para PRO — R$ 69/mês
              </Button>
            </form>
          )}

          {subscribed && user.stripeCustomerId && (
            <form
              action={async () => {
                "use server"
                const s = await auth()
                const u = await db.user.findUniqueOrThrow({ where: { id: s!.user!.id! } })
                const portal = await createCustomerPortalSession(u.stripeCustomerId!)
                redirect(portal.url)
              }}
            >
              <Button type="submit" variant="outline" className="w-full border-border text-foreground">
                Gerenciar assinatura
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Planos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "FREE", price: "Grátis", features: ["1 drop ativo", "100 waitlist", "5% de taxa"] },
              { name: "TRIAL", price: "14 dias", features: ["Tudo ilimitado", "0% taxa", "Analytics"] },
              { name: "PRO", price: "R$ 69/mês", features: ["Drops ilimitados", "0% taxa", "Analytics completo"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-4 ${user.plan === plan.name ? "border-accent bg-accent/5" : "border-border"}`}
              >
                <div className="mb-1 font-semibold text-foreground">{plan.name}</div>
                <div className="mb-3 text-sm text-accent">{plan.price}</div>
                <ul className="space-y-1">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground">
                      ✓ {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
