import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { CalendarView } from "@/components/khmer/calendar-view"
import { calendarMonthCopy } from "@/lib/i18n/seo"
import { getServerLang } from "@/lib/i18n/server"
import { MAX_YEAR, MIN_YEAR } from "@/lib/khmer"
import { pageMetadata } from "@/lib/seo"

function parse({ year, month }: { year: string; month: string }) {
  const y = Number(year)
  const m = Number(month)
  if (!Number.isInteger(y) || !Number.isInteger(m) || y < MIN_YEAR || y > MAX_YEAR || m < 1 || m > 12) {
    return null
  }
  return { year: y, month: m, canonical: `/calendar/${y}/${m}`, isCanonical: year === String(y) && month === String(m) }
}

export async function generateMetadata(props: PageProps<"/calendar/[year]/[month]">): Promise<Metadata> {
  const parsed = parse(await props.params)
  if (!parsed) return {}
  const lang = await getServerLang()
  return pageMetadata({ path: parsed.canonical, lang, ...calendarMonthCopy(parsed.year, parsed.month, lang) })
}

export default async function CalendarMonthPage(props: PageProps<"/calendar/[year]/[month]">) {
  const [params, searchParams] = await Promise.all([props.params, props.searchParams])
  const parsed = parse(params)
  if (!parsed) notFound()

  const weekStart = searchParams.weekStart === "1" ? 1 : 0
  // Normalize e.g. /calendar/2026/09 to /calendar/2026/9
  if (!parsed.isCanonical) permanentRedirect(`${parsed.canonical}${weekStart ? "?weekStart=1" : ""}`)

  return <CalendarView year={parsed.year} month={parsed.month} weekStart={weekStart} />
}
