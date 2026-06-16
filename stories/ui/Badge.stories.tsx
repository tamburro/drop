import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Badge } from "@/components/ui/badge"

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  args: { children: "Ao vivo" },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {}
export const Secondary: Story = { args: { variant: "secondary", children: "Agendado" } }
export const Accent: Story = {
  args: { className: "bg-accent text-accent-foreground", children: "PRO" },
}
