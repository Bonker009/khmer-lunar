import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { HolidaysView } from "@/components/khmer/holidays-view"
import { holidaysYearCopy } from "@/lib/i18n/seo"
import { getServerLang } from "@/lib/i18n/server"
import { MAX_YEAR, MIN_YEAR } from "@/lib/khmer"
import { pageMetadata } from "@/lib/seo"

function parseYear(raw: string) {
  const year = Number(raw)
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR ? year : null
}

export async function generateMetadata(props: PageProps<"/holidays/[year]">): Promise<Metadata> {
  const year = parseYear((await props.params).year)
  if (!year) return {}
  const lang = await getServerLang()
  return pageMetadata({ path: `/holidays/${year}`, lang, ...holidaysYearCopy(year, lang) })
}

export default async function HolidaysYearPage(props: PageProps<"/holidays/[year]">) {
  const { year: raw } = await props.params
  const year = parseYear(raw)
  if (!year) notFound()
  if (raw !== String(year)) permanentRedirect(`/holidays/${year}`)

  return <HolidaysView year={year} />
}
