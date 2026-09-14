import { ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { CountdownList } from "@/components/khmer/countdown-list"
import { MonthGrid } from "@/components/khmer/month-grid"
import { TodayHero } from "@/components/khmer/today-hero"
import { YearProgress } from "@/components/khmer/year-progress"
import { JsonLd } from "@/components/seo/json-ld"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { serializeCountdown, serializeMonthCalendar } from "@/lib/api/views"
import { seoCopy } from "@/lib/i18n/seo"
import { getServerDictionary, getServerLang } from "@/lib/i18n/server"
import { dayOfYear, getLunarDate, getMonthCalendar, serializeLunarDate, todayISO } from "@/lib/khmer"
import { pageMetadata } from "@/lib/seo"
import { absoluteUrl, localizedPath, SITE_NAME } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang()
  return pageMetadata({ path: "/", lang, ...seoCopy("home", lang), absoluteTitle: true })
}

export default async function HomePage() {
  const { lang, t } = await getServerDictionary()
  const copy = seoCopy("home", lang)
  const today = todayISO()
  const lunar = getLunarDate(today)
  const calendar = serializeMonthCalendar(getMonthCalendar(lunar.year, lunar.month), lang)

  return (
    <div className="space-y-6">
      <h1 className="sr-only">{copy.title}</h1>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: SITE_NAME[lang],
          url: absoluteUrl(localizedPath("/", lang)),
          description: copy.description,
          inLanguage: lang,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
        <TodayHero data={serializeLunarDate(lunar, lang)} />
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>{t.home.upcoming}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CountdownList events={serializeCountdown(today, lang).slice(0, 6)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>
                {t.home.thisMonth} · {calendar.monthName} {t.num(calendar.year)}
              </h2>
            </CardTitle>
            <CardDescription>{calendar.lunarMonths.map((m) => m.name).join(" – ")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MonthGrid calendar={calendar} today={today} compact />
            <Link href="/calendar" className={buttonVariants({ variant: "outline", size: "sm" })}>
              {t.home.openCalendar}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>{t.home.progress}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <YearProgress data={dayOfYear(today)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
