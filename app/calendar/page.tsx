import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"
import { CalendarView } from "@/components/khmer/calendar-view"
import { seoCopy } from "@/lib/i18n/seo"
import { getServerLang } from "@/lib/i18n/server"
import { todayISO } from "@/lib/khmer"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang()
  return pageMetadata({ path: "/calendar", lang, ...seoCopy("calendar", lang) })
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

/** The current month. Older `?year=&month=` links move to /calendar/[year]/[month]. */
export default async function CalendarPage(props: PageProps<"/calendar">) {
  const searchParams = await props.searchParams
  const weekStart = first(searchParams.weekStart) === "1" ? 1 : 0
  const year = first(searchParams.year)
  const month = first(searchParams.month)
  if (year && month) {
    permanentRedirect(`/calendar/${year}/${month}${weekStart ? "?weekStart=1" : ""}`)
  }

  const [todayYear, todayMonth] = todayISO().split("-").map(Number)
  return <CalendarView year={todayYear} month={todayMonth} weekStart={weekStart} />
}
