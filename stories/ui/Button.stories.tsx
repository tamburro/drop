import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: { children: "Começar grátis" },
}
export default meta
type Story = StoryObj<typeof Button>

export const Accent: Story = {
  args: { className: "bg-accent text-accent-foreground hover:bg-accent/90" },
}
export const Default: Story = {}
export const Outline: Story = { args: { variant: "outline" } }
export const Secondary: Story = { args: { variant: "secondary" } }
export const Ghost: Story = { args: { variant: "ghost" } }
export const Destructive: Story = { args: { variant: "destructive", children: "Excluir drop" } }
