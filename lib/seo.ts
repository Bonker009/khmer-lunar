import type { Metadata } from "next"
import type { Lang } from "@/lib/khmer/constants"
import { localizedPath, SITE_NAME } from "@/lib/site"

const OG_LOCALE: Record<Lang, string> = { km: "km_KH", en: "en_US" }

/**
 * Per-page metadata: self-referencing canonical, hreflang alternates for both
 * languages, and matching Open Graph / Twitter fields.
 */
export function pageMetadata({
  path,
  lang,
  title,
  description,
  absoluteTitle = false,
}: {
  /** Path without the language parameter, e.g. "/holidays/2027" */
  path: string
  lang: Lang
  title: string
  description: string
  /** Skip the "| site name" title template (used on the home page) */
  absoluteTitle?: boolean
}): Metadata {
  const url = localizedPath(path, lang)
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        km: localizedPath(path, "km"),
        en: localizedPath(path, "en"),
        "x-default": path,
      },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME[lang],
      locale: OG_LOCALE[lang],
      alternateLocale: [OG_LOCALE[lang === "km" ? "en" : "km"]],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
