import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = (stripe as any).webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId) break

      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id

      await db.user.update({
        where: { id: userId },
        data: {
          plan: "PRO",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: process.env.STRIPE_PRICE_ID_PRO,
        },
      })
      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = (invoice as any).parent?.subscription_details?.subscription
      if (!subscriptionId) break

      const user = await db.user.findFirst({ where: { stripeSubscriptionId: subscriptionId } })
      if (!user) break

      await db.user.update({
        where: { id: user.id },
        data: {
          plan: "PRO",
          stripeCurrentPeriodEnd: new Date((invoice as any).period_end * 1000),
        },
      })
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const user = await db.user.findFirst({ where: { stripeSubscriptionId: sub.id } })
      if (!user) break

      await db.user.update({
        where: { id: user.id },
        data: { stripeCurrentPeriodEnd: new Date((sub as any).current_period_end * 1000) },
      })
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      const user = await db.user.findFirst({ where: { stripeSubscriptionId: sub.id } })
      if (!user) break

      await db.user.update({
        where: { id: user.id },
        data: { plan: "FREE", stripeSubscriptionId: null, stripePriceId: null },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
