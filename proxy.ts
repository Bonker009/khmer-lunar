import { NextResponse, type NextRequest } from "next/server"

const YEAR = /^\d{4}$/
const MONTH = /^\d{1,2}$/

/**
 * Runs before rendering, so redirects are real 308s even though pages stream.
 *
 * - Legacy query URLs move to path URLs: /holidays?year=2027 → /holidays/2027,
 *   /calendar?year=2026&month=9 → /calendar/2026/9, and /calendar/2026/09 → /calendar/2026/9.
 * - `?lang=km|en` picks the language for this request, so each language has its own
 *   crawlable URL (used by hreflang), and remembers the choice in a cookie.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  const redirectTo = (path: string, dropParams: string[]) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    for (const name of dropParams) url.searchParams.delete(name)
    return NextResponse.redirect(url, 308)
  }

  const year = searchParams.get("year") ?? ""
  const month = searchParams.get("month") ?? ""
  if (pathname === "/holidays" && YEAR.test(year)) {
    return redirectTo(`/holidays/${year}`, ["year"])
  }
  if (pathname === "/calendar" && YEAR.test(year) && MONTH.test(month)) {
    return redirectTo(`/calendar/${year}/${Number(month)}`, ["year", "month"])
  }
  const padded = pathname.match(/^\/calendar\/(\d{4})\/0(\d)$/)
  if (padded) return redirectTo(`/calendar/${padded[1]}/${padded[2]}`, [])

  const lang = searchParams.get("lang")
  if (lang !== "km" && lang !== "en") return NextResponse.next()

  const headers = new Headers(request.headers)
  headers.set("x-lang", lang)
  const response = NextResponse.next({ request: { headers } })
  response.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" })
  return response
}

export const config = {
  // Pages only: skip API routes, Next internals and generated metadata files
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
}
