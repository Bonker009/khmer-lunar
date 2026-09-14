import type { Metadata } from "next"
import { permanentRedirect } from "next/navigation"
import { HolidaysView } from "@/components/khmer/holidays-view"
import { seoCopy } from "@/lib/i18n/seo"
import { getServerLang } from "@/lib/i18n/server"
import { todayISO } from "@/lib/khmer"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang()
  return pageMetadata({ path: "/holidays", lang, ...seoCopy("holidays", lang) })
}

/** This year's holidays. Older `?year=` links move to /holidays/[year]. */
export default async function HolidaysPage(props: PageProps<"/holidays">) {
  const { year } = await props.searchParams
  if (typeof year === "string" && year) permanentRedirect(`/holidays/${year}`)

  return <HolidaysView year={Number(todayISO().slice(0, 4))} />
}
