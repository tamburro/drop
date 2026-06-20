import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { StorefrontForm } from "@/components/storefront/storefront-form"

export default async function StorefrontPage() {
  const session = await auth()
  const user = await db.user.findUniqueOrThrow({ where: { id: session!.user!.id! } })

  const socials = (user.socials as { instagram?: string; tiktok?: string; site?: string } | null) ?? {}

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-tight text-foreground">Minha vitrine</h1>
        <p className="text-sm text-muted-foreground">
          Sua identidade pública. Os drops aparecem na sua vitrine em lancedrop.vercel.app/@handle.
        </p>
      </div>

      <StorefrontForm
        initial={{
          handle: user.handle ?? "",
          brandName: user.brandName ?? user.name ?? "",
          avatar: user.avatar ?? "",
          accentColor: user.accentColor ?? "#12A8C4",
          bio: user.bio ?? "",
          instagram: socials.instagram ?? "",
          tiktok: socials.tiktok ?? "",
          site: socials.site ?? "",
        }}
      />
    </div>
  )
}
