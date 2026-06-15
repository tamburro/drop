import { z } from "zod/v4"

export const createDropSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres").max(100),
  description: z.string().max(1000).optional(),
  launchAt: z.string().datetime(),
  stock: z.number().int().min(1, "Estoque mínimo: 1"),
  price: z.number().int().min(100, "Preço mínimo: R$1,00"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens"),
})

export const joinWaitlistSchema = z.object({
  email: z.email("Email inválido"),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
})

export type CreateDropInput = z.infer<typeof createDropSchema>
export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>
