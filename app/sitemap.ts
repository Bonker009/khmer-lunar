import type { MetadataRoute } from "next"
import { MAX_YEAR, MIN_YEAR, todayISO } from "@/lib/khmer"
import { absoluteUrl, localizedPath } from "@/lib/site"

// Rebuilt daily so the year/month windows below move forward.
export const revalidate = 86400

type Entry = MetadataRoute.Sitemap[number]

function entry(
  path: string,
  changeFrequency: Entry["changeFrequency"],
  priority: number,
  lastModified?: string
): Entry {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        km: absoluteUrl(localizedPath(path, "km")),
        en: absoluteUrl(localizedPath(path, "en")),
      },
    },
  }
}

const inRange = (year: number) => year >= MIN_YEAR && year <= MAX_YEAR

export default function sitemap(): MetadataRoute.Sitemap {
  const today = todayISO()
  const year = Number(today.slice(0, 4))

  const pages = [
    entry("/", "daily", 1, today),
    entry("/calendar", "daily", 0.9, today),
    entry("/holidays", "weekly", 0.9),
    entry("/convert", "monthly", 0.7),
    entry("/count", "monthly", 0.7),
    entry("/docs", "monthly", 0.5),
  ]

  // Holiday pages people plan for: last year through five years ahead
  const holidayYears = Array.from({ length: 7 }, (_, i) => year - 1 + i)
    .filter(inRange)
    .map((y) => entry(`/holidays/${y}`, "yearly", 0.6))

  // Month pages for last, this and next year
  const calendarMonths = [year - 1, year, year + 1]
    .filter(inRange)
    .flatMap((y) => Array.from({ length: 12 }, (_, m) => entry(`/calendar/${y}/${m + 1}`, "monthly", 0.5)))

  return [...pages, ...holidayYears, ...calendarMonths]
}
