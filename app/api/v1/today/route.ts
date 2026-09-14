import type { NextRequest } from "next/server"
import { getLang } from "@/lib/api/params"
import { handle, ok, preflight } from "@/lib/api/respond"
import { dayOfYear, getLunarDate, serializeLunarDate, todayISO } from "@/lib/khmer"

export function GET(request: NextRequest) {
  return handle(() => {
    const lang = getLang(request.nextUrl.searchParams)
    const date = todayISO()
    return ok(
      { ...serializeLunarDate(getLunarDate(date), lang), dayOfYear: dayOfYear(date) },
      { cacheable: false, meta: { timeZone: "Asia/Phnom_Penh" } }
    )
  })
}

export const OPTIONS = preflight
