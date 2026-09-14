import {
  ANIMAL_EMOJIS,
  ANIMAL_YEARS,
  GREGORIAN_MONTHS,
  HOLY_DAY_NAME,
  LEAP_TYPES,
  LUNAR_MONTHS,
  MOON_PHASES,
  PHASES,
  PHASES_SHORT,
  SAKS,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  type Lang,
} from "./constants"
import { getHolidaysOn } from "./holidays"
import type { LunarDate } from "./lunar"
import { toKhmerNumber } from "./numerals"
import { toJdn, weekdayOf } from "./date"

/** Gregorian date in words, e.g. "ថ្ងៃទី១៤ ខែកញ្ញា ឆ្នាំ២០២៦" or "14 September 2026". */
export function formatGregorian(date: string, lang: Lang = "km", withWeekday = false) {
  const [year, month, day] = date.split("-").map(Number)
  const weekday = WEEKDAYS[lang][weekdayOf(toJdn(year, month, day))]
  const monthName = GREGORIAN_MONTHS[lang][month - 1]
  if (lang === "km") {
    const text = `ទី${toKhmerNumber(day)} ខែ${monthName} ឆ្នាំ${toKhmerNumber(year)}`
    return withWeekday ? `ថ្ងៃ${weekday} ${text}` : `ថ្ងៃ${text}`
  }
  const text = `${day} ${monthName} ${year}`
  return withWeekday ? `${weekday}, ${text}` : text
}

export const DEFAULT_FORMAT: Record<Lang, string> = {
  km: "ថ្ងៃW dN ខែm ឆ្នាំa e ពុទ្ធសករាជ b",
  en: "W, d N [of] m, [Year of the] a, e, [BE] b",
}

export const SHORT_FORMAT: Record<Lang, string> = {
  km: "dN ខែm",
  en: "d N m",
}

/**
 * Tokens:
 *   W weekday · w short weekday · d lunar day · D zero-padded lunar day
 *   N phase (កើត/រោច) · n short phase · m lunar month · a animal year · as emoji
 *   e sak · b BE year · j JS year · ds Gregorian day · M Gregorian month · c Gregorian year
 * Wrap literal text in [brackets].
 */
const TOKENS = ["as", "ds", "W", "w", "d", "D", "N", "n", "m", "M", "a", "e", "b", "j", "c"]
const TOKEN_PATTERN = new RegExp(`\\[([^\\]]+)\\]|(${TOKENS.join("|")})`, "g")

export function formatLunar(date: LunarDate, lang: Lang = "km", pattern = DEFAULT_FORMAT[lang]) {
  const num = (n: number | string) => (lang === "km" ? toKhmerNumber(n) : String(n))
  const values: Record<string, () => string> = {
    W: () => WEEKDAYS[lang][date.weekday],
    w: () => WEEKDAYS_SHORT[lang][date.weekday],
    d: () => num(date.lunarDay),
    D: () => num(String(date.lunarDay).padStart(2, "0")),
    N: () => PHASES[lang][date.phase],
    n: () => PHASES_SHORT[lang][date.phase],
    m: () => LUNAR_MONTHS[lang][date.monthIndex],
    a: () => ANIMAL_YEARS[lang][date.animalYear],
    as: () => ANIMAL_EMOJIS[date.animalYear],
    e: () => SAKS[lang][date.sak],
    b: () => num(date.beYear),
    j: () => num(date.jsYear),
    ds: () => num(date.day),
    M: () => GREGORIAN_MONTHS[lang][date.month - 1],
    c: () => num(date.year),
  }
  return pattern.replace(TOKEN_PATTERN, (_, literal: string | undefined, token: string) =>
    literal ?? values[token]()
  )
}

/** JSON shape shared by the API and the UI. */
export function serializeLunarDate(date: LunarDate, lang: Lang = "km") {
  return {
    date: date.date,
    weekday: { index: date.weekday, name: WEEKDAYS[lang][date.weekday] },
    gregorian: {
      year: date.year,
      month: date.month,
      day: date.day,
      monthName: GREGORIAN_MONTHS[lang][date.month - 1],
    },
    lunar: {
      day: date.lunarDay,
      phase: date.phase,
      phaseName: PHASES[lang][date.phase],
      dayOfMonth: date.dayNumber + 1,
      month: {
        index: date.monthIndex,
        name: LUNAR_MONTHS[lang][date.monthIndex],
        days: date.monthLength,
      },
      leapType: date.leapType,
      leapTypeName: LEAP_TYPES[lang][date.leapType],
    },
    year: {
      buddhistEra: date.beYear,
      jolakSakaraj: date.jsYear,
      animal: {
        index: date.animalYear,
        name: ANIMAL_YEARS[lang][date.animalYear],
        emoji: ANIMAL_EMOJIS[date.animalYear],
      },
      sak: { index: date.sak, name: SAKS[lang][date.sak] },
    },
    holyDay: date.holyDay ? { kind: date.holyDay, name: HOLY_DAY_NAME[lang] } : null,
    moonPhase: date.moonPhase
      ? { kind: date.moonPhase, name: MOON_PHASES[lang][date.moonPhase] }
      : null,
    holidays: getHolidaysOn(date.date).map((h) => ({ id: h.id, name: h.name[lang], type: h.type })),
    formatted: formatLunar(date, lang),
    formattedShort: formatLunar(date, lang, SHORT_FORMAT[lang]),
  }
}

export type SerializedLunarDate = ReturnType<typeof serializeLunarDate>
