import Link from "next/link"
import { db } from "@/lib/db"

export const metadata = {
  title: "Explorar criadores — Drop",
}

export default async function ExplorarPage() {
  const creators = await db.user.findMany({
    where: { handle: { not: null }, drops: { some: { status: { not: "DRAFT" } } } },
    include: {
      drops: {
        where: { status: { not: "DRAFT" } },
        orderBy: { launchAt: "desc" },
        select: { coverImage: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl uppercase tracking-tight text-foreground md:text-5xl">
          Explorar criadores
        </h1>
        <p className="mt-2 text-muted-foreground">Marcas e criadores lançando drops agora.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {creators.map((c) => {
          const live = c.drops.filter((d) => d.status === "LIVE").length
          const cover = c.drops.find((d) => d.coverImage)?.coverImage
          const accent = c.accentColor ?? undefined
          return (
            <Link
              key={c.id}
              href={`/${c.handle}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent"
              style={accent ? ({ ["--accent"]: accent } as React.CSSProperties) : undefined}
            >
              <div className="relative h-36 w-full overflow-hidden bg-secondary">
                {cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="flex items-center gap-3 p-4">
                {c.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full border border-border object-cover" />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    {(c.brandName ?? c.handle ?? "D").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{c.brandName ?? c.handle}</p>
                  <p className="text-xs text-accent">
                    {live > 0 ? `${live} drop${live > 1 ? "s" : ""} ao vivo` : "Sem drops ativos"}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {creators.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">Nenhum criador por aqui ainda.</p>
      )}
    </div>
  )
}
