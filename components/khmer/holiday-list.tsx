"use client"

import { useLang } from "@/components/providers"
import { Badge } from "@/components/ui/badge"
import type { HolidayView } from "@/lib/api/views"
import { GREGORIAN_MONTHS, WEEKDAYS } from "@/lib/khmer/constants"
import { cn } from "@/lib/utils"

const DAY_MS = 86_400_000

const weekdayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay()

export function HolidayList({
  holidays,
  compact = false,
  today,
  groupByMonth = false,
}: {
  holidays: HolidayView[]
  /** Hide the type badge and countdown (narrow sidebars) */
  compact?: boolean
  /** When given, past holidays are dimmed and the next one shows a countdown */
  today?: string
  groupByMonth?: boolean
}) {
  const { t, lang } = useLang()

  if (holidays.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.calendar.noEvents}</p>
  }

  const next = today ? holidays.find((h) => h.dates[h.dates.length - 1] >= today) : undefined

  const groups: { key: string; items: HolidayView[] }[] = []
  for (const holiday of holidays) {
    const key = groupByMonth ? holiday.dates[0].slice(0, 7) : "all"
    const group = groups[groups.length - 1]
    if (group?.key === key) group.items.push(holiday)
    else groups.push({ key, items: [holiday] })
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.key}>
          {groupByMonth && (
            <h2 className="micro-label mb-1 text-muted-foreground">
              {GREGORIAN_MONTHS[lang][Number(group.key.slice(5, 7)) - 1]}
            </h2>
          )}
          <ul className="divide-y">
            {group.items.map((holiday, i) => (
              <HolidayRow
                key={`${holiday.id}-${holiday.dates[0]}-${i}`}
                holiday={holiday}
                compact={compact}
                isPast={today ? holiday.dates[holiday.dates.length - 1] < today : false}
                daysUntil={
                  holiday === next && today
                    ? Math.max(0, Math.round((Date.parse(holiday.dates[0]) - Date.parse(today)) / DAY_MS))
                    : null
                }
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function HolidayRow({
  holiday,
  compact,
  isPast,
  daysUntil,
}: {
  holiday: HolidayView
  compact: boolean
  isPast: boolean
  daysUntil: number | null
}) {
  const { t, lang } = useLang()
  const first = holiday.dates[0]
  const last = holiday.dates[holiday.dates.length - 1]
  const month = Number(first.slice(5, 7))
  const monthLabel = lang === "km" ? GREGORIAN_MONTHS.km[month - 1] : GREGORIAN_MONTHS.en[month - 1].slice(0, 3)
  const isPublic = holiday.type === "public"

  const weekdays =
    first === last
      ? WEEKDAYS[lang][weekdayOf(first)]
      : `${WEEKDAYS[lang][weekdayOf(first)]} – ${WEEKDAYS[lang][weekdayOf(last)]}`

  return (
    <li className={cn("flex items-center gap-3 py-3", isPast && "opacity-55")}>
      <div
        className={cn(
          "flex min-w-16 shrink-0 flex-col items-center justify-center rounded-md px-2 py-1.5 text-center whitespace-nowrap",
          isPublic ? "bg-holiday-soft text-holiday" : "bg-observance-soft text-observance"
        )}
      >
        <span className="text-base leading-tight font-semibold tabular-nums">
          {t.num(Number(first.slice(8)))}
          {first !== last && `–${t.num(Number(last.slice(8)))}`}
        </span>
        <span className="w-full truncate text-2xs leading-tight">{monthLabel}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="leading-snug font-medium">{holiday.name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {/* Type in words on small screens, where the badge is hidden */}
          {!compact && <span className="sm:hidden">{t.common[holiday.type]} · </span>}
          {weekdays}
          {holiday.lunar && holiday.lunarDates[0] && ` · ${holiday.lunarDates[0]}`}
        </p>
        {daysUntil !== null && !compact && (
          <Badge className="mt-1.5 tabular-nums sm:hidden">{t.common.inDays(daysUntil)}</Badge>
        )}
      </div>

      {!compact && (
        <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
          {daysUntil !== null && <Badge className="tabular-nums">{t.common.inDays(daysUntil)}</Badge>}
          <Badge
            variant="ghost"
            className={isPublic ? "bg-holiday-soft text-holiday" : "bg-observance-soft text-observance"}
          >
            {t.common[holiday.type]}
          </Badge>
        </div>
      )}
    </li>
  )
}
