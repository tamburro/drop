import type { Metadata } from "next"
import { Space_Grotesk, Geist_Mono, Anton } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Providers } from "@/components/layout/providers"

const sans = Space_Grotesk({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const anton = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://usedrop-br.vercel.app"),
  title: "Drop — Lance drops. Venda para quem realmente quer.",
  description: "Plataforma de loja para criadores que lançam produtos limitados com lista de espera.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/images/favicon_32.svg", type: "image/svg+xml" },
      { url: "/images/favicon_32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon_16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/images/logo_apple.png",
  },
  openGraph: {
    title: "Drop — Lance drops. Venda para quem realmente quer.",
    description: "Plataforma de loja para criadores que lançam produtos limitados com lista de espera.",
    type: "website",
    images: [{ url: "/images/og_social.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og_social.jpg"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          {children}
          <Toaster theme="dark" />
        </Providers>
      </body>
    </html>
  )
}
