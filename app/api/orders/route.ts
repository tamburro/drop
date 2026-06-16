import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createOrderSchema } from "@/lib/validations"
import { createOrderCheckoutSession } from "@/lib/stripe"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const orders = await db.order.findMany({
    where: { drop: { userId: session.user.id } },
    include: { drop: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const parsed = createOrderSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  const { dropId, buyerEmail, buyerName, quantity } = parsed.data

  const drop = await db.drop.findUnique({ where: { id: dropId } })
  if (!drop) return NextResponse.json({ error: "Drop não encontrado" }, { status: 404 })
  if (drop.status !== "LIVE") {
    return NextResponse.json({ error: "Este drop não está aberto para compra" }, { status: 409 })
  }

  const paidOrders = await db.order.findMany({
    where: { dropId, status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    select: { items: true },
  })
  const sold = paidOrders.reduce(
    (acc, o) => acc + (o.items as { quantity: number }[]).reduce((s, i) => s + i.quantity, 0),
    0
  )
  if (sold + quantity > drop.stock) {
    return NextResponse.json({ error: "Estoque insuficiente" }, { status: 409 })
  }

  const order = await db.order.create({
    data: {
      dropId,
      buyerEmail,
      buyerName,
      items: [{ name: drop.title, quantity, unitPrice: drop.price }],
      total: drop.price * quantity,
    },
  })

  const checkout = await createOrderCheckoutSession({
    orderId: order.id,
    dropTitle: drop.title,
    dropSlug: drop.slug,
    unitAmount: drop.price,
    quantity,
    buyerEmail,
  })

  return NextResponse.json({ url: checkout.url }, { status: 201 })
}
