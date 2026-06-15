import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { updateOrderStatusSchema } from "@/lib/validations"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { id } = await params
  const order = await db.order.findUnique({
    where: { id },
    include: { drop: true },
  })
  if (!order || order.drop.userId !== session.user.id) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
  }

  const body = await req.json()
  const parsed = updateOrderStatusSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Status inválido" }, { status: 400 })

  const updated = await db.order.update({
    where: { id },
    data: {
      status: parsed.data.status,
      ...(parsed.data.status === "SHIPPED" ? { shippedAt: new Date() } : {}),
    },
  })

  return NextResponse.json(updated)
}
