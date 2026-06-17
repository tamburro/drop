import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Drop",
    short_name: "Drop",
    description: "Lance drops. Venda para quem realmente quer.",
    start_url: "/",
    display: "standalone",
    background_color: "#040508",
    theme_color: "#040508",
    icons: [
      { src: "/images/192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/512x512.png", sizes: "512x512", type: "image/png" },
      { src: "/images/maskable_icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
