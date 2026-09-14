import { HolidayList } from "@/components/khmer/holiday-list"
import { NewYearCard } from "@/components/khmer/new-year-card"
import { Panel, PanelHeader } from "@/components/khmer/panel"
import { YearNav } from "@/components/khmer/year-select"
import { JsonLd } from "@/components/seo/json-ld"
import { serializeHolidays, serializeNewYear } from "@/lib/api/views"
import { holidaysYearCopy } from "@/lib/i18n/seo"
import { getServerDictionary } from "@/lib/i18n/server"
import { todayISO } from "@/lib/khmer"

/** Holidays page body, shared by /holidays and /holidays/[year]. */
export async function HolidaysView({ year }: { year: number }) {
  const { lang, t } = await getServerDictionary()
  const today = todayISO()
  const { holidays } = serializeHolidays(year, lang)
  const title = `${t.nav.holidays} ${t.num(year)}`
  const copy = holidaysYearCopy(year, lang)

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
      <h1 className="sr-only">{copy.title}</h1>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: copy.title,
          description: copy.description,
          itemListElement: holidays.map((h, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Event",
              name: h.name,
              startDate: h.dates[0],
              endDate: h.dates[h.dates.length - 1],
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              description: [t.common[h.type], h.lunarDates[0]].filter(Boolean).join(" · "),
              location: {
                "@type": "Place",
                name: lang === "km" ? "កម្ពុជា" : "Cambodia",
                address: { "@type": "PostalAddress", addressCountry: "KH" },
              },
            },
          })),
        }}
      />

      {/* Mobile: the year picker leads, since it drives both the New Year card and the list */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <h2 className="text-xl font-semibold">{title}</h2>
        <YearNav year={year} path="/holidays" />
      </div>

      <div className="lg:sticky lg:top-20">
        <NewYearCard data={serializeNewYear(year, lang)} />
      </div>

      <Panel>
        <PanelHeader className="hidden lg:flex" title={title} action={<YearNav year={year} path="/holidays" />} />
        <HolidayList holidays={holidays} today={today} groupByMonth />
        <p className="mt-6 border-t pt-4 text-xs text-muted-foreground">{t.holidays.disclaimer}</p>
      </Panel>
    </div>
  )
}
