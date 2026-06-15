import { Drop, Order, WaitlistEntry, Product, User, Plan, DropStatus, OrderStatus } from "@prisma/client"

export type { Drop, Order, WaitlistEntry, Product, User, Plan, DropStatus, OrderStatus }

export type DropWithCounts = Drop & {
  _count: {
    orders: number
    waitlistEntries: number
  }
}

export type OrderWithDrop = Order & {
  drop: Drop
}
