import type { Preview } from "@storybook/nextjs-vite"
import { tokens } from "../design-system/tokens"
import "../app/globals.css"

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "drop-dark",
      values: [
        { name: "drop-dark", value: tokens.colors.background },
        { name: "card", value: tokens.colors.card },
      ],
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  decorators: [
    (Story) => {
      document.body.style.background = tokens.colors.background
      document.body.style.color = tokens.colors.foreground
      return Story()
    },
  ],
}

export default preview
