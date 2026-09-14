import type { NextRequest } from "next/server"
import { getLang, optionalDate } from "@/lib/api/params"
import { handle, ok, preflight } from "@/lib/api/respond"
import { serializeCountdown } from "@/lib/api/views"
import { todayISO } from "@/lib/khmer"

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const requested = optionalDate(params)
    const from = requested ?? todayISO()
    return ok({ from, events: serializeCountdown(from, lang) }, { cacheable: requested !== undefined })
  })
}

export const OPTIONS = preflight
