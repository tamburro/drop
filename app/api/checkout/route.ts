import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createCheckoutSession, createCustomerPortalSession } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const user = await db.user.findUniqueOrThrow({ where: { id: session.user.id } })

  const { action } = await req.json() as { action?: string }

  if (action === "portal") {
    if (!user.stripeCustomerId) {
      return NextResponse.json({ error: "Sem assinatura ativa" }, { status: 400 })
    }
    const portalSession = await createCustomerPortalSession(user.stripeCustomerId)
    return NextResponse.json({ url: portalSession.url })
  }

  const checkoutSession = await createCheckoutSession(user.id, user.email!)
  return NextResponse.json({ url: checkoutSession.url })
}
