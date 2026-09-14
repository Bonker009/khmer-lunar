import type { NextRequest } from "next/server"
import { getLang, requireDate } from "@/lib/api/params"
import { handle, ok, preflight } from "@/lib/api/respond"
import { dayOfYear, getLunarDate, serializeLunarDate } from "@/lib/khmer"

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const date = requireDate(params)
    return ok({ ...serializeLunarDate(getLunarDate(date), lang), dayOfYear: dayOfYear(date) })
  })
}

export const OPTIONS = preflight
