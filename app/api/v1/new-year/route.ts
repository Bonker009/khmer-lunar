import type { NextRequest } from "next/server"
import { getLang, requireYear } from "@/lib/api/params"
import { handle, ok, preflight } from "@/lib/api/respond"
import { serializeNewYear } from "@/lib/api/views"

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const year = requireYear(params)
    return ok(serializeNewYear(year, lang))
  })
}

export const OPTIONS = preflight
