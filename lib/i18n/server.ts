import { cookies, headers } from "next/headers"
import type { Lang } from "@/lib/khmer/constants"
import { dictionaries } from "./dictionaries"

export const LANG_COOKIE = "lang"

/** `?lang=` (forwarded by proxy.ts as `x-lang`) wins over the saved cookie. */
export async function getServerLang(): Promise<Lang> {
  const [headerList, cookieStore] = await Promise.all([headers(), cookies()])
  const value = headerList.get("x-lang") ?? cookieStore.get(LANG_COOKIE)?.value
  return value === "en" ? "en" : "km"
}

export async function getServerDictionary() {
  const lang = await getServerLang()
  return { lang, t: dictionaries[lang] }
}
