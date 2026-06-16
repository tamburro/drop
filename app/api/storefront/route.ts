import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { storefrontSchema } from "@/lib/validations"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const parsed = storefrontSchema.safeParse(await req.json())
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return NextResponse.json({ error: first?.message ?? "Dados inválidos" }, { status: 400 })
  }

  const { handle, brandName, avatar, accentColor, bio, socials } = parsed.data

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        handle,
        brandName,
        avatar: avatar || null,
        accentColor,
        bio: bio || null,
        socials: socials ?? Prisma.JsonNull,
      },
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Esse @handle já está em uso" }, { status: 409 })
    }
    throw e
  }

  return NextResponse.json({ ok: true })
}
