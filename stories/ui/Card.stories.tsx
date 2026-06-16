import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const meta: Meta = { title: "UI/Card" }
export default meta
type Story = StoryObj

export const DropCard: Story = {
  render: () => (
    <Card className="w-80 border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Cápsula Aurora</CardTitle>
        <CardDescription className="text-muted-foreground">NÉVOA · 50 unidades</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-foreground">R$ 249,00</p>
        <p className="text-sm text-accent">Ao vivo</p>
      </CardContent>
    </Card>
  ),
}
