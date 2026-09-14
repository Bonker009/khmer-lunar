import { ENDPOINTS } from "@/lib/api/endpoints"
import { ok, preflight } from "@/lib/api/respond"
import { MAX_YEAR, MIN_YEAR } from "@/lib/khmer"

export function GET() {
  return ok({
    name: "Khmer Lunar Calendar API",
    supportedYears: { from: MIN_YEAR, to: MAX_YEAR },
    endpoints: ENDPOINTS.map((e) => ({
      path: e.path,
      summary: e.summary.en,
      params: e.params.map((p) => ({ name: p.name, required: p.required, example: p.example })),
    })),
  })
}

export const OPTIONS = preflight
