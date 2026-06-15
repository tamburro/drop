import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drop = await db.drop.findUnique({
    where: { id },
    include: { products: true, _count: { select: { orders: true, waitlistEntries: true } } },
  })
  if (!drop) return NextResponse.json({ error: "Drop não encontrado" }, { status: 404 })
  return NextResponse.json(drop)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { id } = await params
  const drop = await db.drop.findUnique({ where: { id } })
  if (!drop || drop.userId !== session.user.id) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
  }

  const body = await req.json()
  const updated = await db.drop.update({ where: { id }, data: body })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const { id } = await params
  const drop = await db.drop.findUnique({ where: { id } })
  if (!drop || drop.userId !== session.user.id) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
  }

  await db.drop.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
