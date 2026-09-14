const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  // JSON responses are for apps, not search results; the /docs page is indexed instead.
  "X-Robots-Tag": "noindex",
}

type OkOptions = {
  /** Deterministic responses can be cached on the CDN for a day. */
  cacheable?: boolean
  meta?: Record<string, unknown>
}

export function ok(data: unknown, { cacheable = true, meta }: OkOptions = {}) {
  return Response.json(
    { data, meta: { version: "v1", ...meta } },
    {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": cacheable
          ? "public, s-maxage=86400, stale-while-revalidate=604800"
          : "no-store",
      },
    }
  )
}

export function fail(status: number, code: string, message: string) {
  return Response.json(
    { error: { code, message } },
    { status, headers: { ...CORS_HEADERS, "Cache-Control": "no-store" } }
  )
}

export function preflight() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export class ParamError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ParamError"
  }
}

/** Runs a handler body and converts thrown errors into JSON error responses. */
export function handle(fn: () => Response): Response {
  try {
    return fn()
  } catch (err) {
    if (err instanceof ParamError || err instanceof RangeError) {
      return fail(400, "invalid_parameter", err.message)
    }
    console.error(err)
    return fail(500, "internal_error", "Unexpected error")
  }
}
