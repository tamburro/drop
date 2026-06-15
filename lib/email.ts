import { Resend } from "resend"

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY não configurada")
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendWaitlistConfirmation(email: string, dropTitle: string, position: number) {
  await getResend().emails.send({
    from: "Drop <onboarding@resend.dev>",
    to: email,
    subject: `Você está na fila para "${dropTitle}"`,
    html: `<h2>Você entrou na fila!</h2><p>Sua posição: <strong>#${position}</strong></p><p>Você será notificado quando o drop <strong>${dropTitle}</strong> abrir.</p>`,
  })
}

export async function sendOrderConfirmation(email: string, orderId: string, dropTitle: string, total: number) {
  await getResend().emails.send({
    from: "Drop <onboarding@resend.dev>",
    to: email,
    subject: `Pedido confirmado — ${dropTitle}`,
    html: `<h2>Pedido confirmado!</h2><p>Obrigado pela compra de <strong>${dropTitle}</strong>.</p><p>Total: R$ ${(total / 100).toFixed(2)}</p><p>Pedido: ${orderId}</p>`,
  })
}
