import { notFound } from "next/navigation"
import Link from "next/link"
import { AtSign, Music2, Globe } from "lucide-react"
import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Countdown } from "@/components/drop/countdown"

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Em breve",
  LIVE: "Ao vivo",
  SOLD_OUT: "Esgotado",
  ENDED: "Encerrado",
}

export default async function VitrinePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params

  const creator = await db.user.findUnique({
    where: { handle },
    include: {
      drops: {
        where: { status: { not: "DRAFT" } },
        orderBy: [{ status: "asc" }, { launchAt: "desc" }],
      },
    },
  })
  if (!creator) notFound()

  const accent = creator.accentColor ?? undefined
  const socials = (creator.socials as { instagram?: string; tiktok?: string; site?: string } | null) ?? {}

  return (
    <div
      className="mx-auto max-w-5xl px-4 py-12"
      style={accent ? ({ ["--accent"]: accent } as React.CSSProperties) : undefined}
    >
      <header className="mb-12 flex flex-col items-center gap-4 text-center">
        {creator.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={creator.avatar} alt="" className="h-24 w-24 rounded-full border border-border object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent">
            <span className="text-3xl font-bold text-accent-foreground">
              {(creator.brandName ?? handle).charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{creator.brandName ?? handle}</h1>
          <p className="text-sm text-accent">@{handle}</p>
        </div>
        {creator.bio && <p className="max-w-md text-sm text-muted-foreground">{creator.bio}</p>}
        <div className="flex gap-4 text-muted-foreground">
          {socials.instagram && (
            <a href={`https://instagram.com/${socials.instagram.replace("@", "")}`} className="hover:text-foreground">
              <AtSign className="h-5 w-5" />
            </a>
          )}
          {socials.tiktok && (
            <a href={`https://tiktok.com/@${socials.tiktok.replace("@", "")}`} className="hover:text-foreground">
              <Music2 className="h-5 w-5" />
            </a>
          )}
          {socials.site && (
            <a href={socials.site} className="hover:text-foreground">
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>
      </header>

      {creator.drops.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">Nenhum drop por aqui ainda.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {creator.drops.map((drop) => (
            <Link
              key={drop.id}
              href={`/${handle}/${drop.slug}`}
              className="group space-y-2"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-card">
                {drop.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={drop.coverImage}
                    alt={drop.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-3xl font-bold text-accent">{drop.title.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute left-2 top-2">
                  <Badge variant={drop.status === "LIVE" ? "default" : "secondary"}>
                    {STATUS_LABELS[drop.status]}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="truncate text-sm font-medium text-foreground">{drop.title}</p>
                <p className="text-sm text-muted-foreground">R$ {(drop.price / 100).toFixed(2)}</p>
                {drop.status === "SCHEDULED" && (
                  <div className="mt-1">
                    <Countdown launchAt={drop.launchAt.toISOString()} />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
