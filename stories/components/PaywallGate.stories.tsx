import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PaywallGate } from "@/components/paywall/paywall-gate"

const meta: Meta<typeof PaywallGate> = {
  title: "Produto/PaywallGate",
  component: PaywallGate,
}
export default meta
type Story = StoryObj<typeof PaywallGate>

export const Bloqueado: Story = {
  args: {
    locked: true,
    title: "Analytics é PRO",
    description: "Faça upgrade para ver conversão de waitlist e sell-out.",
    children: <div className="p-6 text-foreground">Conteúdo protegido</div>,
  },
}

export const Liberado: Story = {
  args: {
    locked: false,
    children: <div className="rounded-lg border border-border bg-card p-6 text-foreground">Conteúdo liberado</div>,
  },
}
