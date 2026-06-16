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
  coverImage: z.url("URL inválida").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "SCHEDULED", "LIVE"]).default("DRAFT"),
})

export const joinWaitlistSchema = z.object({
  email: z.email("Email inválido"),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
})

export const storefrontSchema = z.object({
  handle: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens"),
  brandName: z.string().min(1, "Informe o nome da marca").max(60),
  avatar: z.url("URL inválida").optional().or(z.literal("")),
  accentColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, "Use uma cor hex (ex: #12A8C4)"),
  bio: z.string().max(280).optional().or(z.literal("")),
  socials: z
    .object({
      instagram: z.string().max(120).optional().or(z.literal("")),
      tiktok: z.string().max(120).optional().or(z.literal("")),
      site: z.url("URL inválida").optional().or(z.literal("")),
    })
    .optional(),
})

export const createOrderSchema = z.object({
  dropId: z.string().min(1, "dropId obrigatório"),
  buyerEmail: z.email("Email inválido"),
  buyerName: z.string().max(120).optional(),
  quantity: z.number().int().min(1, "Quantidade mínima: 1").max(10, "Máximo 10 por pedido"),
})

export type CreateDropInput = z.infer<typeof createDropSchema>
export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type StorefrontInput = z.infer<typeof storefrontSchema>
