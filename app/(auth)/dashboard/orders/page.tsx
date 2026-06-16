import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { OrderStatusControl } from "@/components/orders/order-status-control"

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
}

export default async function OrdersPage() {
  const session = await auth()

  const orders = await db.order.findMany({
    where: { drop: { userId: session!.user!.id! } },
    include: { drop: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl uppercase tracking-tight text-foreground">Pedidos</h1>

      {orders.length === 0 && (
        <p className="text-muted-foreground">Nenhum pedido ainda.</p>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="border-border bg-card">
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{order.buyerEmail}</span>
                  <Badge>{STATUS_LABELS[order.status]}</Badge>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{order.drop.title}</span>
                  <span>R$ {(order.total / 100).toFixed(2)}</span>
                  <span>
                    {formatDistanceToNow(order.createdAt, { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
              </div>
              <OrderStatusControl orderId={order.id} status={order.status} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
