import type { NextRequest } from "next/server"
import { getLang, requireDate, requireInt } from "@/lib/api/params"
import { handle, ok, preflight } from "@/lib/api/respond"
import { addDays, serializeLunarDate } from "@/lib/khmer"

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const date = requireDate(params)
    const days = requireInt(params, "days", -100_000, 100_000)
    return ok({ from: date, days, result: serializeLunarDate(addDays(date, days), lang) })
  })
}

export const OPTIONS = preflight
