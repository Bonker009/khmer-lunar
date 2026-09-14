import type { NextRequest } from "next/server"
import { getLang, optionalInt, requireYear } from "@/lib/api/params"
import { handle, ok, preflight } from "@/lib/api/respond"
import {
  daysInGregorianMonth,
  formatLunar,
  getLunarDate,
  isGregorianLeapYear,
  MOON_PHASES,
  SHORT_FORMAT,
  toJdn,
} from "@/lib/khmer"

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const year = requireYear(params)
    const month = optionalInt(params, "month", 1, 12)

    const start = toJdn(year, month ?? 1, 1)
    const length = month ? daysInGregorianMonth(year, month) : isGregorianLeapYear(year) ? 366 : 365

    const holyDays = []
    for (let jdn = start; jdn < start + length; jdn++) {
      const lunar = getLunarDate(jdn)
      if (!lunar.holyDay) continue
      holyDays.push({
        date: lunar.date,
        kind: lunar.holyDay,
        moonPhase: lunar.moonPhase && MOON_PHASES[lang][lunar.moonPhase],
        lunar: formatLunar(lunar, lang, SHORT_FORMAT[lang]),
      })
    }

    return ok({ year, month: month ?? null, count: holyDays.length, holyDays })
  })
}

export const OPTIONS = preflight
