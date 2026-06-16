import Stripe from "stripe"

let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY não configurada")
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia" as any,
    })
  }
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

export async function createCheckoutSession(userId: string, email: string) {
  const session = await getStripe().checkout.sessions.create({
    customer_email: email,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID_PRO,
        quantity: 1,
      },
    ],
    metadata: { userId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  })
  return session
}

export async function createOrderCheckoutSession(params: {
  orderId: string
  dropTitle: string
  dropSlug: string
  unitAmount: number
  quantity: number
  buyerEmail: string
}) {
  const methods: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ["card"]
  if (process.env.STRIPE_ENABLE_PIX === "true") methods.push("pix")

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: methods,
    customer_email: params.buyerEmail,
    line_items: [
      {
        price_data: {
          currency: "brl",
          unit_amount: params.unitAmount,
          product_data: { name: params.dropTitle },
        },
        quantity: params.quantity,
      },
    ],
    metadata: { orderId: params.orderId },
    payment_intent_data: { metadata: { orderId: params.orderId } },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${params.dropSlug}?paid=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${params.dropSlug}`,
  })
  return session
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  })
  return session
}
