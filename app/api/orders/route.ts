import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

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
