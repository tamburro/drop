import Link from "next/link"
import { Package, Users, ShoppingBag, Truck, BarChart2, QrCode, ArrowUpRight } from "lucide-react"
import { DEMO_CREATORS, cover, avatar } from "@/lib/landing-data"
import { Cursor } from "@/components/landing/cursor"
import { Reveal } from "@/components/landing/reveal"
import { MagneticLink } from "@/components/landing/magnetic"
import { PublicHeader } from "@/components/layout/public-header"
import HeroWave from "@/components/ui/dynamic-wave-canvas-background"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { MagicCard } from "@/components/ui/magic-card"
import { BorderBeam } from "@/components/ui/border-beam"
import { AvatarCircles } from "@/components/ui/avatar-circles"
import { Marquee } from "@/components/ui/marquee"
import { NumberTicker } from "@/components/ui/number-ticker"

const STATUS = { LIVE: "Ao vivo", SCHEDULED: "Em breve", SOLD_OUT: "Esgotado" } as const

const allDrops = DEMO_CREATORS.flatMap((c) =>
  c.drops.map((d) => ({ ...d, handle: c.handle, brand: c.brandName }))
)

// colunas alternadas para o mural: 1 capa alta, depois 2 empilhadas, e assim por diante
const wallSource = [...allDrops, ...allDrops, ...allDrops]
const heroColumns: { type: "tall" | "stack"; drops: typeof allDrops }[] = []
let wallIdx = 0
for (let c = 0; heroColumns.length < 10; c++) {
  if (c % 2 === 0) {
    heroColumns.push({ type: "tall", drops: [wallSource[wallIdx % wallSource.length]] })
    wallIdx += 1
  } else {
    heroColumns.push({
      type: "stack",
      drops: [wallSource[wallIdx % wallSource.length], wallSource[(wallIdx + 1) % wallSource.length]],
    })
    wallIdx += 2
  }
}

const bento = [
  { name: "Drop Builder", description: "Página de lançamento com countdown, galeria e estoque limitado em minutos.", Icon: Package, span: "md:col-span-1", cover: null as string | null },
  { name: "Checkout com Pix", description: "Cartão e Pix no seu próprio checkout, sem redirecionar pra outra plataforma.", Icon: QrCode, span: "md:col-span-2", cover: "nevoa-capsula-aurora" },
  { name: "Waitlist Engine", description: "Coleta emails com acesso antecipado priorizado para os inscritos.", Icon: Users, span: "md:col-span-2", cover: null },
  { name: "Order Manager", description: "Pedidos, status de envio e comunicação com o comprador num painel só.", Icon: Truck, span: "md:col-span-1", cover: null },
  { name: "Drop Analytics", description: "Conversão de waitlist, receita por drop e taxa de sell-out em tempo real.", Icon: BarChart2, span: "md:col-span-1", cover: null },
  { name: "Loja própria", description: "Sua vitrine, sua marca, seu público — sem intermediários.", Icon: ShoppingBag, span: "md:col-span-2", cover: "raiz-jaqueta" },
]

const steps = [
  { n: "01", title: "Crie o drop", text: "Capa, descrição, preço, estoque e data. Pronto em minutos." },
  { n: "02", title: "Junte a waitlist", text: "Fãs entram na fila e ganham acesso antecipado no lançamento." },
  { n: "03", title: "Esgote no lançamento", text: "Countdown, escassez real e checkout com Pix. Venda fechada." },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-x-clip bg-background text-foreground">
      <Cursor />

      {/* wordmark vertical */}
      <div className="pointer-events-none fixed right-2 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 text-xs uppercase tracking-[0.4em] text-muted-foreground/40 lg:block">
        Drops sem parar
      </div>

      <PublicHeader />

      {/* HERO — mural de produtos */}
      <section id="drops" className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-0 h-[72vh] overflow-hidden">
          <HeroWave className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-6 pt-16 text-center">
          <h1 className="font-display text-6xl uppercase leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-8xl">
            Lance drops.
            <br />
            <span className="text-accent">Venda pra quem</span>
            <br />
            realmente quer.
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
            A loja dos criadores que esgotam em minutos — waitlist priorizada, countdown e checkout com Pix.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticLink href="/login" className="rounded-full bg-accent px-7 py-3 font-medium text-accent-foreground">
              Criar meu primeiro drop
            </MagneticLink>
            <MagneticLink href="/explorar" className="rounded-full border border-foreground px-7 py-3 font-medium text-foreground">
              Ver drops ao vivo
            </MagneticLink>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Grátis. Sem cartão. Sem mensalidade no plano Free.</p>
        </div>

        {/* faixa de transição: funde o wave em preto ANTES dos cards (não cobre os nomes) */}
        <div className="pointer-events-none h-12 w-full bg-gradient-to-b from-transparent to-background sm:h-20" />

        {/* mural de capas — marquee horizontal (→), colunas alternadas, pausa no hover */}
        <div className="group/wall relative overflow-hidden">
          <div className="marquee-track flex w-max gap-2 px-1">
            {[...heroColumns, ...heroColumns].map((col, i) => (
              <div key={i} className="flex h-[300px] w-40 shrink-0 flex-col gap-2 sm:h-[380px] sm:w-52">
                {col.drops.map((d, j) => (
                  <Link
                    key={`${i}-${j}`}
                    href={`/${d.handle}/${d.slug}`}
                    data-cursor
                    className={`group relative ${col.type === "tall" ? "h-full" : "h-1/2"} overflow-hidden rounded-lg`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover(d.slug, col.type === "tall" ? 700 : 500)}
                      alt={d.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/50" />
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 text-xs font-medium text-foreground drop-shadow">
                      {d.brand}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                    <span className="absolute bottom-2 left-2 rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent backdrop-blur">
                      {STATUS[d.status]}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background" />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-5xl px-6 py-28">
        <Reveal>
          <h2 className="font-display text-4xl uppercase tracking-tight text-foreground md:text-5xl">Como funciona</h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-display text-5xl text-accent/40">{s.n}</span>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES — bento */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-4xl uppercase tracking-tight text-foreground md:text-5xl">
            Tudo pra esgotar
          </h2>
        </Reveal>
        <Reveal className="mt-12">
          <BentoGrid className="grid-cols-1 md:grid-cols-3">
            {bento.map((f) => (
              <BentoCard
                key={f.name}
                name={f.name}
                description={f.description}
                Icon={f.Icon}
                className={f.span}
                background={
                  f.cover ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover(f.cover, 800)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-45"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-card/30" />
                    </>
                  ) : (
                    <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
                  )
                }
              />
            ))}
          </BentoGrid>
        </Reveal>
      </section>

      {/* STATS BAND */}
      <section className="px-6 py-16">
        <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-r from-primary to-accent px-8 py-12">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="font-display text-5xl text-accent-foreground">
                R$ <NumberTicker value={2.4} decimalPlaces={1} className="text-accent-foreground" />M+
              </p>
              <p className="mt-1 text-sm text-accent-foreground/80">em drops vendidos</p>
            </div>
            <div>
              <p className="font-display text-5xl text-accent-foreground">
                <NumberTicker value={120} className="text-accent-foreground" />k+
              </p>
              <p className="mt-1 text-sm text-accent-foreground/80">na waitlist</p>
            </div>
            <div>
              <p className="font-display text-5xl text-accent-foreground">
                <NumberTicker value={1800} className="text-accent-foreground" />
              </p>
              <p className="mt-1 text-sm text-accent-foreground/80">criadores na plataforma</p>
            </div>
          </div>
          <BorderBeam size={140} duration={9} colorFrom="#F0F4F8" colorTo="#12A8C4" />
        </Reveal>
      </section>

      {/* CRIADORES */}
      <section className="py-20">
        <div className="mx-auto mb-10 max-w-5xl px-6">
          <Reveal className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-4xl uppercase tracking-tight text-foreground md:text-5xl">
              Criadores no Drop
            </h2>
            <AvatarCircles
              avatarUrls={DEMO_CREATORS.map((c) => ({ imageUrl: avatar(c.handle), profileUrl: `/${c.handle}` }))}
            />
          </Reveal>
        </div>
        <div className="relative">
          <Marquee pauseOnHover className="[--duration:35s]">
            {DEMO_CREATORS.map((c) => (
              <Link
                key={c.handle}
                href={`/${c.handle}`}
                data-cursor
                className="flex w-64 items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-accent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar(c.handle)} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{c.brandName}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.niche}</p>
                </div>
              </Link>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>
      </section>

      {/* PRICING */}
      <section id="planos" className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-4xl uppercase tracking-tight text-foreground md:text-5xl">Planos</h2>
          <p className="mt-2 text-muted-foreground">A taxa é a diferença. No Pro, você fica com tudo.</p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { name: "Free", price: "Grátis", fee: "5% por venda", features: ["1 drop ativo", "100 na waitlist", "Checkout próprio"], highlight: false },
            { name: "Trial", price: "14 dias", fee: "0% de taxa", features: ["Tudo ilimitado", "Analytics", "Sem cartão"], highlight: false },
            { name: "PRO", price: "R$ 69/mês", fee: "0% de taxa", features: ["Drops ilimitados", "Analytics completo", "Suporte prioritário"], highlight: true },
          ].map((p) => (
            <Reveal key={p.name} className="h-full">
              <MagicCard className="h-full rounded-2xl">
                <div className="relative flex h-full flex-col p-6">
                  {p.highlight && (
                    <>
                      <span className="mb-3 inline-block w-fit rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        RECOMENDADO
                      </span>
                      <BorderBeam size={70} duration={6} />
                    </>
                  )}
                  <div className="font-display text-2xl uppercase text-foreground">{p.name}</div>
                  <div className="mt-1 text-2xl font-bold text-accent">{p.price}</div>
                  <div className="mt-1 text-sm font-medium text-foreground">{p.fee}</div>
                  <ul className="my-6 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-accent">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <MagneticLink
                    href="/login"
                    className={`mt-auto w-full rounded-full px-5 py-3 text-sm font-medium ${p.highlight ? "bg-accent text-accent-foreground" : "border border-border text-foreground"}`}
                  >
                    Começar
                  </MagneticLink>
                </div>
              </MagicCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border px-6 py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
          <Reveal>
            <h2 className="font-display text-4xl uppercase tracking-tight text-foreground md:text-6xl">
              Comece seu<br />primeiro drop
            </h2>
          </Reveal>
          <MagneticLink href="/login" className="rounded-full bg-accent px-8 py-4 font-medium text-accent-foreground">
            Criar grátis →
          </MagneticLink>
          <div className="spin-badge mt-4 flex h-24 w-24 items-center justify-center rounded-full border border-accent/30">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent">drop • drop •</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-display text-accent">DROP</span> — Lance drops. Venda para quem realmente quer.
          </p>
        </div>
      </footer>
    </div>
  )
}
