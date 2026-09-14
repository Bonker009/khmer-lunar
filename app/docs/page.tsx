import type { Metadata } from "next"
import { headers } from "next/headers"
import { ApiPlayground } from "@/components/khmer/api-playground"
import { seoCopy } from "@/lib/i18n/seo"
import { getServerDictionary, getServerLang } from "@/lib/i18n/server"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang()
  return pageMetadata({ path: "/docs", lang, ...seoCopy("docs", lang) })
}

export default async function DocsPage() {
  const [{ lang }, headerList] = await Promise.all([getServerDictionary(), headers()])
  const host = headerList.get("host") ?? "localhost:3000"
  const protocol = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")

  return (
    <>
      <h1 className="sr-only">{seoCopy("docs", lang).title}</h1>
      <ApiPlayground key={lang} origin={`${protocol}://${host}`} />
    </>
  )
}
