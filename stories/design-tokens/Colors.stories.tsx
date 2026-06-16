import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { tokens } from "@/design-system/tokens"

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          height: 72,
          borderRadius: 12,
          background: value,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      <div style={{ fontSize: 12, color: tokens.colors.foreground }}>{name}</div>
      <div style={{ fontSize: 11, color: tokens.colors.mutedForeground, fontFamily: "monospace" }}>{value}</div>
    </div>
  )
}

function Grid({ entries }: { entries: [string, string][] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 20,
        padding: 24,
      }}
    >
      {entries.map(([name, value]) => (
        <Swatch key={name} name={name} value={value} />
      ))}
    </div>
  )
}

const meta: Meta = { title: "Design Tokens/Colors" }
export default meta
type Story = StoryObj

export const Theme: Story = {
  render: () => <Grid entries={Object.entries(tokens.colors)} />,
}

export const Sidebar: Story = {
  render: () => <Grid entries={Object.entries(tokens.sidebar)} />,
}
