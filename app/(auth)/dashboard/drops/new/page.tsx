import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NewDropForm } from "@/components/drops/new-drop-form"

export default async function NewDropPage() {
  const session = await auth()
  const user = await db.user.findUniqueOrThrow({ where: { id: session!.user!.id! } })

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl uppercase tracking-tight text-foreground">Novo drop</h1>
      <NewDropForm handle={user.handle} />
    </div>
  )
}
