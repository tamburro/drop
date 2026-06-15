import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { joinWaitlistSchema } from "@/lib/validations"
import { PLAN_LIMITS } from "@/lib/plans"
import { sendWaitlistConfirmation } from "@/lib/email"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = joinWaitlistSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 })
  }

  const { dropId } = body as { dropId: string }
  if (!dropId) return NextResponse.json({ error: "dropId obrigatório" }, { status: 400 })

  const drop = await db.drop.findUnique({
    where: { id: dropId },
    include: { user: true, _count: { select: { waitlistEntries: true } } },
  })
  if (!drop) return NextResponse.json({ error: "Drop não encontrado" }, { status: 404 })

  const limit = PLAN_LIMITS[drop.user.plan].waitlistEntries
  if (limit !== Infinity && drop._count.waitlistEntries >= limit) {
    return NextResponse.json({ error: "Waitlist lotada" }, { status: 409 })
  }

  const existing = await db.waitlistEntry.findUnique({
    where: { dropId_email: { dropId, email: parsed.data.email } },
  })
  if (existing) {
    return NextResponse.json({ position: existing.position, alreadyJoined: true })
  }

  const position = drop._count.waitlistEntries + 1
  const entry = await db.waitlistEntry.create({
    data: { dropId, email: parsed.data.email, position },
  })

  await sendWaitlistConfirmation(parsed.data.email, drop.title, position).catch(() => {})

  return NextResponse.json({ position: entry.position }, { status: 201 })
}
