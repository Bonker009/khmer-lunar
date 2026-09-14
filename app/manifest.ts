import type { MetadataRoute } from "next"
import { seoCopy } from "@/lib/i18n/seo"
import { BRAND_COLORS } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ប្រតិទិនចន្ទគតិ · Khmer Lunar Calendar",
    short_name: "Khmer Lunar",
    description: seoCopy("home", "en").description,
    lang: "km",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: BRAND_COLORS.backgroundLight,
    theme_color: BRAND_COLORS.blue600,
    categories: ["utilities", "reference", "lifestyle"],
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
