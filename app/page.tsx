import { ButtonLink } from "@/components/ui/button-link"
import { Badge } from "@/components/ui/badge"
import { Package, Users, ShoppingBag, BarChart2, Zap, Shield } from "lucide-react"

const features = [
  { icon: Package, title: "Drop Builder", description: "Crie páginas de lançamento com countdown, galeria e estoque limitado em minutos." },
  { icon: Users, title: "Waitlist Engine", description: "Coleta emails com acesso antecipado para inscritos prioritários automaticamente." },
  { icon: ShoppingBag, title: "Checkout Próprio", description: "Carrinho e pagamento Stripe integrado sem redirecionar para outra plataforma." },
  { icon: Zap, title: "Order Manager", description: "Pedidos, status de envio e comunicação com comprador em um painel unificado." },
  { icon: BarChart2, title: "Drop Analytics", description: "Conversão de waitlist, receita por drop e taxa de sell-out em tempo real." },
  { icon: Shield, title: "Sem intermediários", description: "Você vende direto para o seu público. 0% de taxa no plano PRO." },
]

const plans = [
  { name: "Free", price: "Grátis", features: ["1 drop ativo", "100 entradas na waitlist", "5% de taxa por venda"], cta: "Começar grátis", highlight: false },
  { name: "Trial", price: "14 dias", features: ["Tudo ilimitado", "0% de taxa", "Analytics completo"], cta: "Iniciar trial", highlight: false },
  { name: "PRO", price: "R$ 69/mês", features: ["Drops ilimitados", "0% de taxa", "Analytics completo", "Suporte prioritário"], cta: "Assinar PRO", highlight: true },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-xl font-bold text-accent">Drop</span>
        <div className="flex items-center gap-4">
          <ButtonLink href="/login" variant="ghost" size="sm">Entrar</ButtonLink>
          <ButtonLink href="/login" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Começar grátis</ButtonLink>
        </div>
      </nav>

      <section className="flex flex-col items-center px-6 py-32 text-center">
        <Badge className="mb-6 border-accent/30 bg-accent/10 text-accent" variant="outline">
          Lançamentos limitados que vendem
        </Badge>
        <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          Lance drops.{" "}
          <span className="text-accent">Venda para quem realmente quer.</span>
        </h1>
        <p className="mb-10 max-w-xl text-lg text-muted-foreground">
          Plataforma de loja para criadores e marcas de nicho que lançam produtos limitados com lista de espera e checkout próprio.
        </p>
        <div className="flex gap-4">
          <ButtonLink href="/login" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Criar meu primeiro drop
          </ButtonLink>
          <ButtonLink href="#features" size="lg" variant="outline" className="border-border text-foreground">
            Ver como funciona
          </ButtonLink>
        </div>
      </section>

      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Tudo que você precisa para lançar
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Planos simples</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-xl border p-6 ${plan.highlight ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
                {plan.highlight && (
                  <Badge className="mb-3 bg-accent text-accent-foreground">Popular</Badge>
                )}
                <div className="mb-1 text-lg font-bold text-foreground">{plan.name}</div>
                <div className="mb-4 text-2xl font-bold text-accent">{plan.price}</div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-accent">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href="/login"
                  variant={plan.highlight ? "default" : "outline"}
                  className={`w-full ${plan.highlight ? "bg-accent text-accent-foreground hover:bg-accent/90" : "border-border text-foreground"}`}
                >
                  {plan.cta}
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <span className="font-bold text-accent">Drop</span> — Lance drops. Venda para quem realmente quer.
      </footer>
    </div>
  )
}
