import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TrialBanner } from "@/components/layout/trial-banner"

const meta: Meta<typeof TrialBanner> = {
  title: "Produto/TrialBanner",
  component: TrialBanner,
}
export default meta
type Story = StoryObj<typeof TrialBanner>

export const Padrao: Story = { args: { daysLeft: 7 } }
export const UmDia: Story = { args: { daysLeft: 1 } }
