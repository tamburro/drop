export type DemoDrop = {
  slug: string
  title: string
  description: string
  price: number // centavos
  stock: number
  status: "LIVE" | "SCHEDULED" | "SOLD_OUT"
  launchOffsetHours: number // negativo = passado, positivo = futuro
}

export type DemoCreator = {
  handle: string
  brandName: string
  niche: string
  accentColor: string
  bio: string
  socials: { instagram?: string; tiktok?: string; site?: string }
  drops: DemoDrop[]
}

export function cover(slug: string, size = 800) {
  return `https://picsum.photos/seed/${slug}/${size}/${size}`
}
export function avatar(handle: string, size = 200) {
  return `https://picsum.photos/seed/${handle}-avatar/${size}/${size}`
}

export const DEMO_CREATORS: DemoCreator[] = [
  {
    handle: "nevoa",
    brandName: "NÉVOA",
    niche: "Streetwear oversize",
    accentColor: "#B57EDC",
    bio: "Peças oversize em tiragem limitada. Cada drop, uma estação.",
    socials: { instagram: "@nevoa.club", tiktok: "@nevoa.club" },
    drops: [
      { slug: "nevoa-capsula-aurora", title: "Cápsula Aurora", description: "Moletom + calça em tom aurora. 50 unidades.", price: 24900, stock: 50, status: "LIVE", launchOffsetHours: -48 },
      { slug: "nevoa-moletom-eclipse", title: "Moletom Eclipse", description: "Edição esgotada do inverno passado.", price: 31900, stock: 30, status: "SOLD_OUT", launchOffsetHours: -720 },
    ],
  },
  {
    handle: "oficinabruta",
    brandName: "Oficina Bruta",
    niche: "Objetos de concreto e cerâmica",
    accentColor: "#C2683F",
    bio: "Objetos brutos, feitos à mão. Concreto, cerâmica, imperfeição.",
    socials: { instagram: "@oficinabruta", site: "https://oficinabruta.example" },
    drops: [
      { slug: "bruta-vaso-monolito", title: "Vaso Monolito", description: "Vaso de concreto pigmentado. 20 unidades numeradas.", price: 18900, stock: 20, status: "LIVE", launchOffsetHours: -12 },
    ],
  },
  {
    handle: "lofipixels",
    brandName: "Lo-Fi Pixels",
    niche: "Arte digital e wallpapers",
    accentColor: "#12A8C4",
    bio: "Wallpapers e arte digital com vibe lo-fi. Download imediato.",
    socials: { instagram: "@lofipixels", tiktok: "@lofipixels" },
    drops: [
      { slug: "lofi-wallpapers-vol3", title: "Pack Wallpapers Vol.3", description: "30 wallpapers em 4K. Entrega digital.", price: 2900, stock: 9999, status: "LIVE", launchOffsetHours: -200 },
    ],
  },
  {
    handle: "clubedameianoite",
    brandName: "Clube da Meia-Noite",
    niche: "Vinis e zines",
    accentColor: "#7C6FF0",
    bio: "Prensagens independentes e zines numerados. Para colecionar.",
    socials: { instagram: "@clubedameianoite" },
    drops: [
      { slug: "clube-vinil-sessoes-02", title: "Vinil Sessões 02", description: "Prensagem limitada de 100 cópias.", price: 14900, stock: 100, status: "SCHEDULED", launchOffsetHours: 72 },
    ],
  },
  {
    handle: "raizstudio",
    brandName: "Raiz Studio",
    niche: "Bordados autorais",
    accentColor: "#4FA06B",
    bio: "Bordados autorais peça a peça. Nada se repete.",
    socials: { instagram: "@raizstudio", site: "https://raizstudio.example" },
    drops: [
      { slug: "raiz-jaqueta", title: "Jaqueta Raiz", description: "Jaqueta jeans bordada à mão. 15 unidades.", price: 45900, stock: 15, status: "LIVE", launchOffsetHours: -6 },
    ],
  },
  {
    handle: "hertz",
    brandName: "Hertz",
    niche: "Fones e acessórios de áudio",
    accentColor: "#E0524F",
    bio: "Áudio com design. Drops de fones e acessórios em série curta.",
    socials: { instagram: "@hertz.audio", site: "https://hertz.example" },
    drops: [
      { slug: "hertz-fone-hz1", title: "Fone HZ-1", description: "Fone over-ear edição fundadora. 40 unidades.", price: 39900, stock: 40, status: "SCHEDULED", launchOffsetHours: 12 },
    ],
  },
]
