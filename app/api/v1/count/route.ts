import type { NextRequest } from "next/server"
import { getLang, optionalBool, optionalList, requireDate } from "@/lib/api/params"
import { handle, ok, preflight } from "@/lib/api/respond"
import { serializeDaysBetween } from "@/lib/api/views"

const WEEKDAY_VALUES = ["0", "1", "2", "3", "4", "5", "6"] as const

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const from = requireDate(params, "from")
    const to = requireDate(params, "to")
    const exclude = optionalList(params, "exclude", ["weekends", "holidays"] as const)
    const weekend = optionalList(params, "weekend", WEEKDAY_VALUES)

    return ok(
      serializeDaysBetween(from, to, lang, {
        includeEnd: optionalBool(params, "includeEnd"),
        excludeWeekends: exclude.includes("weekends"),
        excludeHolidays: exclude.includes("holidays"),
        weekend: weekend.length > 0 ? [...new Set(weekend.map(Number))] : undefined,
      })
    )
  })
}

export const OPTIONS = preflight
