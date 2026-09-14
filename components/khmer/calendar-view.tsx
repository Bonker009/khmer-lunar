import { CalendarToolbar } from "@/components/khmer/calendar-toolbar"
import { HolidayList } from "@/components/khmer/holiday-list"
import { MonthGrid } from "@/components/khmer/month-grid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { serializeMonthCalendar } from "@/lib/api/views"
import { getServerDictionary } from "@/lib/i18n/server"
import { getMonthCalendar, todayISO } from "@/lib/khmer"

/** Month calendar page body, shared by /calendar and /calendar/[year]/[month]. */
export async function CalendarView({ year, month, weekStart }: { year: number; month: number; weekStart: 0 | 1 }) {
  const { lang, t } = await getServerDictionary()
  const today = todayISO()
  const calendar = serializeMonthCalendar(getMonthCalendar(year, month, weekStart), lang)
  const beYears = [...new Set(calendar.lunarMonths.map((m) => m.beYear))]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <Card>
        <CardHeader className="space-y-3">
          <div>
            <CardTitle>
              <h1 className="text-xl font-semibold">
                <span className="sr-only">{t.nav.calendar} </span>
                {calendar.monthName} {t.num(year)}
              </h1>
            </CardTitle>
            <CardDescription>
              {calendar.lunarMonths.map((m) => m.name).join(" – ")} · {t.lunar.buddhistEra}{" "}
              {beYears.map((y) => t.num(y)).join(" – ")}
            </CardDescription>
          </div>
          <CalendarToolbar year={year} month={month} weekStart={weekStart} today={today} />
        </CardHeader>
        <CardContent>
          <MonthGrid calendar={calendar} today={today} />
        </CardContent>
      </Card>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>{t.nav.holidays}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HolidayList
              compact
              holidays={calendar.holidays.map((h) => ({ ...h, dates: [h.date], lunar: false, lunarDates: [] }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>{t.calendar.legend}</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Legend className="bg-holy-mark" label={t.calendar.legendHoly} />
            <Legend className="bg-holiday" label={t.calendar.legendHoliday} />
            <Legend className="bg-observance" label={t.calendar.legendObservance} />
            <p className="text-muted-foreground">
              {calendar.holyDays.length > 0 &&
                `${t.calendar.legendHoly}: ${calendar.holyDays.map((d) => t.num(Number(d.slice(8)))).join(", ")}`}
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-2.5 rounded-full ${className}`} />
      {label}
    </div>
  )
}
