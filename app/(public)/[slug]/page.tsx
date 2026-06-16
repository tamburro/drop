import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Countdown } from "@/components/drop/countdown"
import { DropPurchase } from "@/components/drop/drop-purchase"

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Em breve",
  SCHEDULED: "Agendado",
  LIVE: "Ao vivo",
  SOLD_OUT: "Esgotado",
  ENDED: "Encerrado",
}

export default async function PublicDropPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const drop = await db.drop.findUnique({ where: { slug } })
  if (!drop || drop.status === "DRAFT") notFound()

  const paid = await db.order.findMany({
    where: { dropId: drop.id, status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    select: { items: true },
  })
  const sold = paid.reduce(
    (acc, o) => acc + (o.items as { quantity: number }[]).reduce((s, i) => s + i.quantity, 0),
    0
  )
  const remaining = Math.max(0, drop.stock - sold)
  const isLive = drop.status === "LIVE"

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          {drop.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={drop.coverImage}
              alt={drop.title}
              className="aspect-square w-full rounded-xl border border-border object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-border bg-card">
              <span className="text-4xl font-bold text-accent">Drop</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary">{STATUS_LABELS[drop.status]}</Badge>
            <h1 className="text-3xl font-bold text-foreground">{drop.title}</h1>
            {drop.description && (
              <p className="text-muted-foreground">{drop.description}</p>
            )}
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-foreground">
              R$ {(drop.price / 100).toFixed(2)}
            </span>
            <span className="pb-1 text-sm text-muted-foreground">
              {remaining > 0 ? `${remaining} disponíveis` : "esgotado"}
            </span>
          </div>

          {!isLive && drop.status !== "SOLD_OUT" && drop.status !== "ENDED" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Lançamento em</p>
              <Countdown launchAt={drop.launchAt.toISOString()} />
            </div>
          )}

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                {isLive && remaining > 0 ? "Finalizar compra" : "Lista de espera"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DropPurchase dropId={drop.id} isLive={isLive} remaining={remaining} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
