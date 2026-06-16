import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ButtonLink } from "@/components/ui/button-link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  SCHEDULED: "Agendado",
  LIVE: "Ao vivo",
  SOLD_OUT: "Esgotado",
  ENDED: "Encerrado",
}

export default async function DropsPage() {
  const session = await auth()
  const drops = await db.drop.findMany({
    where: { userId: session!.user!.id! },
    include: { _count: { select: { orders: true, waitlistEntries: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl uppercase tracking-tight text-foreground">Drops</h1>
        <ButtonLink href="/dashboard/drops/new" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
          + Novo Drop
        </ButtonLink>
      </div>

      {drops.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <p className="text-muted-foreground">Nenhum drop criado ainda.</p>
            <ButtonLink
              href="/dashboard/drops/new"
              className="mt-4 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Criar primeiro drop
            </ButtonLink>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {drops.map((drop) => (
          <Card key={drop.id} className="border-border bg-card">
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{drop.title}</span>
                  <Badge variant="secondary">{STATUS_LABELS[drop.status]}</Badge>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{drop._count.orders} pedidos</span>
                  <span>{drop._count.waitlistEntries} na fila</span>
                  <span>{formatDistanceToNow(drop.createdAt, { addSuffix: true, locale: ptBR })}</span>
                </div>
              </div>
              <ButtonLink
                href={`/dashboard/drops/${drop.id}`}
                variant="outline"
                size="sm"
                className="border-border text-foreground"
              >
                Gerenciar
              </ButtonLink>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
