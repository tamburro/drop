import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm rounded-2xl border-border bg-card">
        <CardHeader className="text-center">
          <div className="mb-2 font-display text-3xl tracking-wide text-accent">DROP</div>
          <CardTitle className="font-display text-xl uppercase tracking-tight text-foreground">Entrar</CardTitle>
          <CardDescription className="text-muted-foreground">
            Lance drops. Venda para quem realmente quer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            action={async (formData) => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}
          >
            <Button type="submit" className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              Entrar com Google
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-card px-2">ou</span>
            </div>
          </div>

          <form
            action={async (formData) => {
              "use server"
              const email = formData.get("email") as string
              await signIn("resend", { email, redirectTo: "/dashboard" })
            }}
            className="space-y-3"
          >
            <div className="space-y-1">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="border-input bg-background text-foreground"
              />
            </div>
            <Button type="submit" variant="outline" className="w-full rounded-full border-border text-foreground">
              Entrar com Magic Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
