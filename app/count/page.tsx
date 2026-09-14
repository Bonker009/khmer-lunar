import type { Metadata } from "next"
import { AddDays } from "@/components/khmer/add-days"
import { CountdownList } from "@/components/khmer/countdown-list"
import { DayCounter } from "@/components/khmer/day-counter"
import { Panel, PanelHeader } from "@/components/khmer/panel"
import { serializeCountdown, serializeDaysBetween } from "@/lib/api/views"
import { seoCopy } from "@/lib/i18n/seo"
import { getServerDictionary, getServerLang } from "@/lib/i18n/server"
import { addDays, formatGregorian, serializeLunarDate, todayISO } from "@/lib/khmer"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang()
  return pageMetadata({ path: "/count", lang, ...seoCopy("count", lang) })
}

const DEFAULT_ADD = 100

export default async function CountPage() {
  const { lang, t } = await getServerDictionary()
  const today = todayISO()
  const endOfYear = `${today.slice(0, 4)}-12-31`

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-6">
      <h1 className="sr-only">{seoCopy("count", lang).title}</h1>
      <div className="space-y-10 lg:space-y-6">
        <DayCounter key={lang} initial={serializeDaysBetween(today, endOfYear, lang)} />
        <AddDays
          key={`add-${lang}`}
          today={today}
          initialDays={DEFAULT_ADD}
          initial={serializeLunarDate(addDays(today, DEFAULT_ADD), lang)}
        />
      </div>
      <Panel className="lg:sticky lg:top-20">
        <PanelHeader title={t.count.countdown} description={formatGregorian(today, lang, true)} />
        <CountdownList events={serializeCountdown(today, lang)} />
      </Panel>
    </div>
  )
}
