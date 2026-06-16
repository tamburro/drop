import type { Metadata } from "next"
import { Geist, Geist_Mono, Anton } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Providers } from "@/components/layout/providers"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const anton = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Drop — Lance drops. Venda para quem realmente quer.",
  description: "Plataforma de loja para criadores que lançam produtos limitados com lista de espera.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          {children}
          <Toaster theme="dark" />
        </Providers>
      </body>
    </html>
  )
}
