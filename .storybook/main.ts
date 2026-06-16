import type { StorybookConfig } from "@storybook/nextjs-vite"
import { fileURLToPath } from "node:url"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  framework: { name: "@storybook/nextjs-vite", options: {} },
  async viteFinal(cfg) {
    cfg.plugins = cfg.plugins ?? []
    cfg.plugins.push(tailwindcss())
    cfg.resolve = cfg.resolve ?? {}
    cfg.resolve.alias = {
      ...(cfg.resolve.alias ?? {}),
      "@": path.resolve(dirname, ".."),
    }
    return cfg
  },
}

export default config
