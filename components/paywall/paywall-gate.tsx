"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ButtonLink } from "@/components/ui/button-link"
import { Lock } from "lucide-react"

interface PaywallGateProps {
  title?: string
  description?: string
  children: React.ReactNode
  locked: boolean
}

export function PaywallGate({
  title = "Recurso PRO",
  description = "Faça upgrade para acessar este recurso.",
  children,
  locked,
}: PaywallGateProps) {
  if (!locked) return <>{children}</>

  return (
    <Card className="border-accent/20 bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <Lock className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <ButtonLink href="/settings/billing" className="bg-accent text-accent-foreground hover:bg-accent/90">
          Fazer upgrade para PRO
        </ButtonLink>
      </CardContent>
    </Card>
  )
}
