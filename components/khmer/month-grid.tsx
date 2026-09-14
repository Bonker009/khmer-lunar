"use client"

import { useLang } from "@/components/providers"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { CalendarDayView, MonthCalendarView } from "@/lib/api/views"
import { HOLY_DAY_NAME, MOON_PHASES, PHASES, PHASES_SHORT } from "@/lib/khmer/constants"
import { formatGregorian } from "@/lib/khmer/format"
import { cn } from "@/lib/utils"
import { MoonPhase } from "./moon-phase"

export function MonthGrid({
  calendar,
  today,
  compact = false,
}: {
  calendar: MonthCalendarView
  today: string
  compact?: boolean
}) {
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-1.5">
        {calendar.weekdays.map((name, i) => (
          <div key={i} title={name} className="truncate px-1.5 text-xs font-medium text-muted-foreground">
            {name}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendar.weeks.flat().map((day) => (
          <DayCell key={day.date} day={day} today={today} compact={compact} />
        ))}
      </div>
    </div>
  )
}

function DayCell({ day, today, compact }: { day: CalendarDayView; today: string; compact: boolean }) {
  const { t, lang } = useLang()
  const { lunar } = day
  const isToday = day.date === today
  const isPublicHoliday = day.holidays.some((h) => h.type === "public")
  const hasObservance = day.holidays.some((h) => h.type === "observance")
  // Khmer spells the phase out (កើត / រោច); English keeps the K / R initials.
  const phaseNames = lang === "km" ? PHASES.km : PHASES_SHORT.en

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "relative flex flex-col items-start rounded-lg bg-cell p-1.5 text-left outline-none transition-colors hover:bg-cell-hover focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-cell-selected",
          compact ? "min-h-12 sm:min-h-14" : "min-h-16 sm:min-h-24 sm:p-2",
          isPublicHoliday && "bg-holiday-soft",
          !day.inMonth && "opacity-40",
          isToday && "ring-2 ring-cell-today"
        )}
      >
        <span
          className={cn(
            "text-sm font-semibold tabular-nums sm:text-base",
            (isPublicHoliday || day.weekday === 0) && "text-holiday"
          )}
        >
          {t.num(day.day)}
        </span>
        {lunar && (
          <span
            className={cn(
              "text-2xs leading-tight text-muted-foreground sm:text-xs",
              lunar.holyDay && "font-semibold text-holy"
            )}
          >
            {t.num(lunar.day)}
            {phaseNames[lunar.phase]}
            {!compact && lunar.day === 1 && lunar.phase === "kert" && (
              <span className="hidden sm:inline"> · {lunar.monthName}</span>
            )}
          </span>
        )}
        {!compact && day.holidays[0] && (
          <span
            className={cn(
              "mt-auto hidden w-full truncate text-2xs sm:block",
              day.holidays[0].type === "public" ? "text-holiday" : "text-observance"
            )}
          >
            {day.holidays[0].name}
          </span>
        )}
        <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
          {hasObservance && <span className="size-1.5 rounded-full bg-observance" />}
          {lunar?.holyDay &&
            (lunar.moonPhase === "full" || lunar.moonPhase === "new" ? (
              <MoonPhase
                dayNumber={lunar.dayNumber}
                monthLength={lunar.monthLength}
                className="size-3 text-holy"
                litClassName="fill-holy-mark"
              />
            ) : (
              <span className="size-1.5 rounded-full bg-holy-mark" />
            ))}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>{formatGregorian(day.date, lang, true)}</PopoverTitle>
          {lunar && <PopoverDescription>{lunar.formattedFull}</PopoverDescription>}
        </PopoverHeader>
        <div className="flex flex-wrap gap-1.5">
          {lunar?.holyDay && (
            <Badge variant="ghost" className="bg-holy-soft text-holy">
              {HOLY_DAY_NAME[lang]}
            </Badge>
          )}
          {lunar?.moonPhase && <Badge variant="secondary">{MOON_PHASES[lang][lunar.moonPhase]}</Badge>}
          {day.holidays.map((h) => (
            <Badge
              key={h.id}
              variant="ghost"
              className={h.type === "public" ? "bg-holiday-soft text-holiday" : "bg-observance-soft text-observance"}
            >
              {h.name}
            </Badge>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
