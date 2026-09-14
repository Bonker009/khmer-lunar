import type { Metadata } from "next"
import { DateConverter } from "@/components/khmer/date-converter"
import { seoCopy } from "@/lib/i18n/seo"
import { getServerDictionary, getServerLang } from "@/lib/i18n/server"
import { getLunarDate, serializeLunarDate, todayISO } from "@/lib/khmer"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang()
  return pageMetadata({ path: "/convert", lang, ...seoCopy("convert", lang) })
}

export default async function ConvertPage() {
  const { lang } = await getServerDictionary()
  const initial = serializeLunarDate(getLunarDate(todayISO()), lang)

  return (
    <>
      <h1 className="sr-only">{seoCopy("convert", lang).title}</h1>
      <DateConverter key={lang} initial={initial} />
    </>
  )
}
