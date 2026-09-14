import type { NextRequest } from "next/server"
import { getLang, optionalInt, requireInt, requireYear } from "@/lib/api/params"
import { handle, ok, preflight } from "@/lib/api/respond"
import { serializeMonthCalendar } from "@/lib/api/views"
import { getMonthCalendar } from "@/lib/khmer"

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const year = requireYear(params)
    const month = requireInt(params, "month", 1, 12)
    const weekStartsOn = (optionalInt(params, "weekStart", 0, 1) ?? 0) as 0 | 1
    return ok(serializeMonthCalendar(getMonthCalendar(year, month, weekStartsOn), lang))
  })
}

export const OPTIONS = preflight
