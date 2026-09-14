import { NextResponse, type NextRequest } from "next/server"

/**
 * `?lang=km|en` picks the language for this request, so each language has its
 * own crawlable URL (used by hreflang), and remembers the choice in a cookie.
 */
export function proxy(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang")
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
