import { NEW_YEAR_DAY_NAMES } from "@/lib/i18n/dictionaries"
import {
  ANIMAL_EMOJIS,
  ANIMAL_YEARS,
  countdown,
  daysBetween,
  formatLunar,
  getHolidays,
  getKhmerNewYear,
  getLunarDate,
  GREGORIAN_MONTHS,
  LUNAR_MONTHS,
  SAKS,
  serializeLunarDate,
  SHORT_FORMAT,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  type HolidayType,
  type Lang,
  type MonthCalendar,
} from "@/lib/khmer"

/** Plain JSON views shared by the API routes and the server-rendered pages. */

export function serializeMonthCalendar(calendar: MonthCalendar, lang: Lang) {
  return {
    year: calendar.year,
    month: calendar.month,
    monthName: GREGORIAN_MONTHS[lang][calendar.month - 1],
    weekStartsOn: calendar.weekStartsOn,
    // Khmer uses full weekday names; English keeps the short forms.
    weekdays: Array.from(
      { length: 7 },
      (_, i) => (lang === "km" ? WEEKDAYS : WEEKDAYS_SHORT)[lang][(i + calendar.weekStartsOn) % 7]
    ),
    lunarMonths: calendar.lunarMonths.map((m) => ({
      index: m.monthIndex,
      name: LUNAR_MONTHS[lang][m.monthIndex],
      beYear: m.beYear,
    })),
    weeks: calendar.weeks.map((week) =>
      week.map((d) => ({
        date: d.date,
        day: d.day,
        weekday: d.weekday,
        inMonth: d.inMonth,
        lunar: d.lunar && {
          day: d.lunar.lunarDay,
          phase: d.lunar.phase,
          dayNumber: d.lunar.dayNumber,
          monthIndex: d.lunar.monthIndex,
          monthLength: d.lunar.monthLength,
          monthName: LUNAR_MONTHS[lang][d.lunar.monthIndex],
          beYear: d.lunar.beYear,
          holyDay: d.lunar.holyDay,
          moonPhase: d.lunar.moonPhase,
          formatted: formatLunar(d.lunar, lang, SHORT_FORMAT[lang]),
          formattedFull: formatLunar(d.lunar, lang),
        },
        holidays: d.holidays.map((h) => ({ id: h.id, name: h.name[lang], type: h.type })),
      }))
    ),
    holidays: calendar.holidays.map((h) => ({ id: h.id, name: h.name[lang], type: h.type, date: h.date })),
    holyDays: calendar.holyDays,
  }
}

export type MonthCalendarView = ReturnType<typeof serializeMonthCalendar>
export type CalendarDayView = MonthCalendarView["weeks"][number][number]

export function serializeDaysBetween(
  from: string,
  to: string,
  lang: Lang,
  options?: Parameters<typeof daysBetween>[2]
) {
  const result = daysBetween(from, to, options)
  return {
    ...result,
    holidays: result.holidays.map((h) => ({ id: h.id, name: h.name[lang], type: h.type, date: h.date })),
    fromLunar: serializeLunarDate(getLunarDate(from), lang),
    toLunar: serializeLunarDate(getLunarDate(to), lang),
  }
}

export type DaysBetweenView = ReturnType<typeof serializeDaysBetween>

export function serializeCountdown(from: string, lang: Lang) {
  return countdown(from).flatMap((e) => {
    try {
      const lunar = getLunarDate(e.date)
      return [
        {
          id: e.id,
          name: e.name[lang],
          date: e.date,
          daysUntil: e.daysUntil,
          lunar: formatLunar(lunar, lang, SHORT_FORMAT[lang]),
        },
      ]
    } catch {
      return [] // event falls after the supported range
    }
  })
}

export type CountdownEventView = ReturnType<typeof serializeCountdown>[number]

export function serializeHolidays(year: number, lang: Lang, type?: HolidayType) {
  return {
    year,
    holidays: getHolidays(year)
      .filter((h) => !type || h.type === type)
      .map((h) => ({
        id: h.id,
        name: h.name[lang],
        type: h.type,
        lunar: h.lunar,
        dates: h.dates,
        lunarDates: h.dates.map((d) => formatLunar(getLunarDate(d), lang, SHORT_FORMAT[lang])),
      })),
  }
}

export type HolidayView = ReturnType<typeof serializeHolidays>["holidays"][number]

export function serializeNewYear(year: number, lang: Lang) {
  const newYear = getKhmerNewYear(year)
  const firstDay = getLunarDate(newYear.date)
  const lerngSak = getLunarDate(newYear.lerngSakDate)
  return {
    year,
    date: newYear.date,
    time: newYear.time,
    timeZone: "Asia/Phnom_Penh",
    days: newYear.days,
    vanabatDays: newYear.vanabatDays,
    lerngSakDate: newYear.lerngSakDate,
    animalYear: {
      index: firstDay.animalYear,
      name: ANIMAL_YEARS[lang][firstDay.animalYear],
      emoji: ANIMAL_EMOJIS[firstDay.animalYear],
    },
    sak: { index: lerngSak.sak, name: SAKS[lang][lerngSak.sak] },
    schedule: newYear.schedule.map((d) => ({
      ...d,
      name: NEW_YEAR_DAY_NAMES[lang][d.kind],
      weekday: WEEKDAYS[lang][getLunarDate(d.date).weekday],
      lunar: formatLunar(getLunarDate(d.date), lang, SHORT_FORMAT[lang]),
    })),
  }
}

export type NewYearView = ReturnType<typeof serializeNewYear>
