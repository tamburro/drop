import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { tokens } from "@/design-system/tokens"

const SIZES = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"] as const

const meta: Meta = { title: "Design Tokens/Typography" }
export default meta
type Story = StoryObj

export const Scale: Story = {
  render: () => (
    <div style={{ padding: 24, color: tokens.colors.foreground }}>
      {SIZES.map((key) => (
        <div
          key={key}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 24,
            padding: "12px 0",
            borderBottom: `1px solid ${tokens.colors.border}`,
          }}
        >
          <span style={{ width: 56, fontSize: 12, color: tokens.colors.mutedForeground, fontFamily: "monospace" }}>
            {key}
          </span>
          <span style={{ fontSize: tokens.typography[key], fontFamily: "var(--font-sans), sans-serif" }}>
            Lance drops.
          </span>
          <span style={{ fontSize: 11, color: tokens.colors.mutedForeground, fontFamily: "monospace" }}>
            {tokens.typography[key]}
          </span>
        </div>
      ))}
    </div>
  ),
}
