import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { tokens } from "@/design-system/tokens"

const meta: Meta = { title: "Design Tokens/Spacing" }
export default meta
type Story = StoryObj

export const Scale: Story = {
  render: () => (
    <div style={{ padding: 24, color: tokens.colors.foreground }}>
      {Object.entries(tokens.spacing).map(([key, value]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 0" }}>
          <span style={{ width: 32, fontSize: 12, color: tokens.colors.mutedForeground, fontFamily: "monospace" }}>
            {key}
          </span>
          <div style={{ height: 16, width: value, background: tokens.colors.accent, borderRadius: 4 }} />
          <span style={{ fontSize: 11, color: tokens.colors.mutedForeground, fontFamily: "monospace" }}>{value}</span>
        </div>
      ))}
    </div>
  ),
}
