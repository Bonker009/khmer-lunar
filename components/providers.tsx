"use client"

import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { createContext, useCallback, useContext, useMemo, useTransition } from "react"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries"
import type { Lang } from "@/lib/khmer/constants"

interface LangContextValue {
  lang: Lang
  t: Dictionary
  setLang: (lang: Lang) => void
  pending: boolean
}

const LangContext = createContext<LangContextValue | null>(null)

export function useLang() {
  const value = useContext(LangContext)
  if (!value) throw new Error("useLang must be used inside <Providers>")
  return value
}

export function Providers({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const setLang = useCallback(
    (next: Lang) => {
      document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`
      document.documentElement.lang = next

      // A `?lang=` parameter would override the cookie, so drop it when switching.
      const url = new URL(window.location.href)
      const hadParam = url.searchParams.has("lang")
      url.searchParams.delete("lang")
      startTransition(() => {
        if (hadParam) router.replace(`${url.pathname}${url.search}${url.hash}`)
        else router.refresh()
      })
    },
    [router]
  )

  const value = useMemo(
    () => ({ lang, t: dictionaries[lang], setLang, pending }),
    [lang, setLang, pending]
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LangContext.Provider value={value}>
        <TooltipProvider>
          {children}
          <Toaster position="bottom-center" />
        </TooltipProvider>
      </LangContext.Provider>
    </ThemeProvider>
  )
}
