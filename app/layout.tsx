import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { Dangrek, Geist_Mono, Kantumruy_Pro, Plus_Jakarta_Sans } from "next/font/google"
import { LangLinks } from "@/components/lang-links"
import { MainContainer } from "@/components/main-container"
import { Providers } from "@/components/providers"
import { JsonLd } from "@/components/seo/json-ld"
import { SiteHeader } from "@/components/site-header"
import { KEYWORDS, seoCopy } from "@/lib/i18n/seo"
import { getServerDictionary, getServerLang } from "@/lib/i18n/server"
import { BRAND_COLORS, SITE_NAME, SITE_URL } from "@/lib/site"
import "./globals.css"

/** Latin interface type */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
})

/** Khmer display: page titles and hero lines */
const dangrek = Dangrek({
  variable: "--font-dangrek",
  weight: "400",
  subsets: ["khmer"],
})

/** Khmer supporting text and long passages */
const kantumruy = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang()
  const home = seoCopy("home", lang)

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME[lang],
    title: { default: home.title, template: `%s | ${SITE_NAME[lang]}` },
    description: home.description,
    keywords: KEYWORDS[lang],
    category: "reference",
    creator: SITE_NAME.en,
    formatDetection: { telephone: false, address: false, email: false },
    openGraph: {
      type: "website",
      siteName: SITE_NAME[lang],
      locale: lang === "km" ? "km_KH" : "en_US",
    },
    twitter: { card: "summary_large_image" },
    // index/follow are the defaults; leaving them out lets not-found pages carry a lone noindex.
    robots: { googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
    appleWebApp: { capable: true, title: "Khmer Lunar", statusBarStyle: "default" },
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
    }),
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND_COLORS.backgroundLight },
    { media: "(prefers-color-scheme: dark)", color: BRAND_COLORS.backgroundDark },
  ],
  colorScheme: "light dark",
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { lang, t } = await getServerDictionary()

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${jakarta.variable} ${dangrek.variable} ${kantumruy.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME[lang],
            alternateName: lang === "km" ? SITE_NAME.en : SITE_NAME.km,
            url: SITE_URL,
            inLanguage: ["km", "en"],
          }}
        />
        <Providers lang={lang}>
          <SiteHeader />
          <MainContainer>{children}</MainContainer>
          <footer className="border-t">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted-foreground sm:px-6">
              <span>
                {t.siteName} · {t.tagline}
              </span>
              <div className="flex items-center gap-4">
                <LangLinks />
                <span className="font-mono text-xs">GET /api/v1</span>
              </div>
            </div>
          </footer>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
