import type { NextRequest } from "next/server"
import { getLang, requireYear } from "@/lib/api/params"
import { handle, ok, ParamError, preflight } from "@/lib/api/respond"
import { serializeHolidays } from "@/lib/api/views"

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const year = requireYear(params)
    const type = params.get("type")
    if (type !== null && type !== "public" && type !== "observance") {
      throw new ParamError("`type` must be `public` or `observance`")
    }
    return ok(serializeHolidays(year, lang, type ?? undefined), {
      meta: { note: "Reference list. The Royal Government of Cambodia publishes the official holidays each year." },
    })
  })
}

export const OPTIONS = preflight
