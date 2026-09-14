import type { Lang } from "@/lib/khmer/constants"

/** Returns the origin of `value` (e.g. "https://khmerlunar.com"), or null if it isn't a valid absolute URL. */
function toOrigin(value: string | undefined) {
  if (!value?.trim()) return null
  try {
    return new URL(value.trim()).origin
  } catch {
    return null
  }
}

/**
 * Canonical site origin for metadata, the sitemap and structured data.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://khmerlunar.com). A blank or
 * invalid value falls through, since `new URL("")` in generateMetadata would throw.
 */
export const SITE_URL =
  toOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
  toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ??
  "http://localhost:3000"

export const SITE_NAME: Record<Lang, string> = {
  km: "ប្រតិទិនចន្ទគតិ",
  en: "Khmer Lunar Calendar",
}

/** Khmer is the default language (no parameter); English pages add `?lang=en`. */
export function localizedPath(path: string, lang: Lang) {
  if (lang === "km") return path
  return `${path}${path.includes("?") ? "&" : "?"}lang=en`
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`

/**
 * Brand colors for places that can't read CSS tokens: generated images and
 * browser chrome. Values mirror design-system.md.
 */
export const BRAND_COLORS = {
  blue600: "#00518D",
  blue700: "#013F6F",
  blue100: "#D8ECFF",
  amber400: "#FFB147",
  backgroundLight: "#F8FAFD",
  backgroundDark: "#070B12",
} as const
