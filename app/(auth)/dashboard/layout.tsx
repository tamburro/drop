import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { hasAccess } from "@/lib/subscription"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = await db.user.findUniqueOrThrow({ where: { id: session!.user!.id! } })

  if (!hasAccess(user)) redirect("/settings/billing?expired=true")

  return <>{children}</>
}
