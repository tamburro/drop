import Link from "next/link"
import { Package, Users, ShoppingBag, Truck, BarChart2, QrCode } from "lucide-react"
import { DEMO_CREATORS, cover, avatar } from "@/lib/landing-data"
import { Cursor } from "@/components/landing/cursor"
import { Reveal } from "@/components/landing/reveal"
import { MagneticLink } from "@/components/landing/magnetic"
import { Logo } from "@/components/ui/logo"

const STATUS = { LIVE: "Ao vivo", SCHEDULED: "Em breve", SOLD_OUT: "Esgotado" } as const

const allDrops = DEMO_CREATORS.flatMap((c) =>
  c.drops.map((d) => ({ ...d, handle: c.handle, brand: c.brandName }))
)

const features = [
  { icon: Package, title: "Drop Builder", description: "Página de lançamento com countdown, galeria e estoque limitado em minutos." },
  { icon: Users, title: "Waitlist Engine", description: "Coleta emails com acesso antecipado para inscritos prioritários." },
  { icon: QrCode, title: "Checkout com Pix", description: "Carrinho e pagamento próprio — cartão e Pix — sem redirecionar pra outra plataforma.", highlight: true },
  { icon: Truck, title: "Order Manager", description: "Pedidos, status de envio e comunicação com o comprador num painel só." },
  { icon: BarChart2, title: "Drop Analytics", description: "Conversão de waitlist, receita por drop e taxa de sell-out em tempo real." },
  { icon: ShoppingBag, title: "Loja própria", description: "Sua vitrine, sua marca, seu público. Sem intermediários." },
]

const steps = [
  { n: "01", title: "Crie o drop", text: "Capa, descrição, preço, estoque e data. Pronto em minutos." },
  { n: "02", title: "Junte a waitlist", text: "Fãs entram na fila e ganham acesso antecipado no lançamento." },
  { n: "03", title: "Esgote no lançamento", text: "Countdown, escassez real e checkout com Pix. Venda fechada." },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <Cursor />

      {/* wordmark vertical */}
      <div className="pointer-events-none fixed right-2 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 text-xs uppercase tracking-[0.4em] text-muted-foreground/40 lg:block">
        Drops sem parar
      </div>

      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/70 px-6 py-4 backdrop-blur">
        <Logo className="h-7 w-auto text-accent" />
        <div className="flex items-center gap-5">
          <Link href="/explorar" data-cursor className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block">
            Explorar
          </Link>
          <Link href="#planos" data-cursor className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block">
            Planos
          </Link>
          <Link href="/login" data-cursor className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Entrar
          </Link>
          <MagneticLink href="/login" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
            Começar grátis
          </MagneticLink>
        </div>
      </nav>

      {/* HERO — mural de produtos */}
      <section id="drops" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh]">
          <div className="absolute left-1/2 top-0 h-[50vh] w-[60vh] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
        </div>

        <div className="mx-auto max-w-4xl px-6 pb-12 pt-20 text-center">
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
            <MagneticLink href="/explorar" className="rounded-full border border-border px-7 py-3 font-medium text-foreground">
              Ver drops ao vivo
            </MagneticLink>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Grátis. Sem cartão. Sem mensalidade no plano Free.</p>
        </div>

        {/* mural de capas reais */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {[...allDrops, ...allDrops].slice(0, 12).map((d, i) => (
              <Link
                key={`${d.slug}-${i}`}
                href={`/${d.handle}/${d.slug}`}
                data-cursor
                className="group relative aspect-square overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover(d.slug, 500)}
                  alt={d.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/25 transition-colors group-hover:bg-transparent" />
                <span className="absolute left-2 top-2 rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent backdrop-blur">
                  {STATUS[d.status]}
                </span>
                <div className="absolute inset-x-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs font-medium text-foreground">{d.title}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{d.brand}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-background" />
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

      {/* FEATURES */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-4xl uppercase tracking-tight text-foreground md:text-5xl">
            Tudo pra esgotar
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={(i % 3) * 80}
              className={`rounded-2xl border p-6 ${f.highlight ? "border-accent bg-accent/5" : "border-border bg-card"}`}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <f.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                {f.title}
                {f.highlight && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                    BR
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="px-6 py-16">
        <Reveal className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-primary to-accent px-8 py-12">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[
              ["0%", "de taxa no Pro"],
              ["Pix", "nativo no checkout"],
              ["Waitlist", "com acesso priorizado"],
            ].map(([big, small]) => (
              <div key={small}>
                <p className="font-display text-4xl text-accent-foreground md:text-5xl">{big}</p>
                <p className="mt-1 text-sm text-accent-foreground/80">{small}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CRIADORES */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-4xl uppercase tracking-tight text-foreground md:text-5xl">
            Criadores no Drop
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {DEMO_CREATORS.map((c, i) => (
            <Reveal key={c.handle} delay={(i % 3) * 70}>
              <Link
                href={`/${c.handle}`}
                data-cursor
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-accent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar(c.handle)} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{c.brandName}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.niche}</p>
                </div>
              </Link>
            </Reveal>
          ))}
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
            <Reveal
              key={p.name}
              className={`rounded-2xl border p-6 ${p.highlight ? "border-accent bg-accent/5" : "border-border bg-card"}`}
            >
              {p.highlight && (
                <span className="mb-3 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                  RECOMENDADO
                </span>
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
                className={`w-full rounded-full px-5 py-3 text-sm font-medium ${p.highlight ? "bg-accent text-accent-foreground" : "border border-border text-foreground"}`}
              >
                Começar
              </MagneticLink>
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
