import type { NextRequest } from "next/server"
import { getLang, requireInt } from "@/lib/api/params"
import { handle, ok, ParamError, preflight } from "@/lib/api/respond"
import { khmerToGregorian, MAX_YEAR, MIN_YEAR, serializeLunarDate } from "@/lib/khmer"

export function GET(request: NextRequest) {
  return handle(() => {
    const params = request.nextUrl.searchParams
    const lang = getLang(params)
    const beYear = requireInt(params, "be", MIN_YEAR + 543, MAX_YEAR + 544)
    const monthIndex = requireInt(params, "month", 0, 13)
    const day = requireInt(params, "day", 1, 15)
    const phase = params.get("phase")
    if (phase !== "kert" && phase !== "roech") {
      throw new ParamError("`phase` must be `kert` or `roech`")
    }
    return ok(serializeLunarDate(khmerToGregorian({ beYear, monthIndex, day, phase }), lang))
  })
}

export const OPTIONS = preflight
