import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createDropSchema } from "@/lib/validations"
import { PLAN_LIMITS } from "@/lib/plans"
import { hasAccess } from "@/lib/subscription"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const drops = await db.drop.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { orders: true, waitlistEntries: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(drops)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const user = await db.user.findUniqueOrThrow({ where: { id: session.user.id } })

  if (!hasAccess(user)) {
    return NextResponse.json({ error: "Acesso expirado. Faça upgrade para continuar." }, { status: 403 })
  }

  const limit = PLAN_LIMITS[user.plan].drops
  if (limit !== Infinity) {
    const activeDrops = await db.drop.count({
      where: { userId: user.id, status: { in: ["LIVE", "SCHEDULED"] } },
    })
    if (activeDrops >= limit) {
      return NextResponse.json(
        { error: `Limite de ${limit} drop(s) ativo(s) no plano FREE. Faça upgrade para criar mais.` },
        { status: 403 }
      )
    }
  }

  if (!user.handle) {
    return NextResponse.json(
      { error: "Configure sua vitrine (@handle) antes de criar um drop." },
      { status: 409 }
    )
  }

  const body = await req.json()
  const parsed = createDropSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json({ error: first?.message ?? "Dados inválidos" }, { status: 400 })
  }

  const { coverImage, ...rest } = parsed.data

  try {
    const drop = await db.drop.create({
      data: {
        ...rest,
        coverImage: coverImage || null,
        userId: user.id,
        launchAt: new Date(parsed.data.launchAt),
      },
    })
    return NextResponse.json(drop, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Esse slug já está em uso" }, { status: 409 })
    }
    throw e
  }
}
