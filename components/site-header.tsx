"use client"

import {
  ArrowLeftRightIcon,
  CalculatorIcon,
  CalendarDaysIcon,
  CodeXmlIcon,
  MenuIcon,
  MoonIcon,
  MoonStarIcon,
  PartyPopperIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useState } from "react"
import { useLang } from "@/components/providers"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", key: "today", icon: SunMoonIcon },
  { href: "/calendar", key: "calendar", icon: CalendarDaysIcon },
  { href: "/convert", key: "convert", icon: ArrowLeftRightIcon },
  { href: "/count", key: "count", icon: CalculatorIcon },
  { href: "/holidays", key: "holidays", icon: PartyPopperIcon },
  { href: "/docs", key: "docs", icon: CodeXmlIcon },
] as const

export function SiteHeader() {
  const { t, lang, setLang } = useLang()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  const logo = (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
      <MoonStarIcon className="size-4" />
    </span>
  )

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold">
          {logo}
          <span className="truncate">{t.siteName}</span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label={t.common.menu} className="hidden flex-1 items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                isActive(item.href) && "bg-accent text-accent-foreground"
              )}
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ToggleGroup
            aria-label={t.common.language}
            variant="outline"
            size="sm"
            spacing={0}
            value={[lang]}
            onValueChange={(value) => {
              const next = value[0]
              if (next === "km" || next === "en") setLang(next)
            }}
          >
            <ToggleGroupItem value="km">ខ្មែរ</ToggleGroupItem>
            <ToggleGroupItem value="en">EN</ToggleGroupItem>
          </ToggleGroup>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t.common.toggleTheme}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <SunIcon className="dark:hidden" />
            <MoonIcon className="hidden dark:block" />
          </Button>

          {/* Mobile navigation */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label={t.common.menu}
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "md:hidden")}
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-semibold">
                  {logo}
                  {t.siteName}
                </SheetTitle>
              </SheetHeader>
              <nav aria-label={t.common.menu} className="flex flex-col gap-1 px-3">
                {NAV.map(({ href, key, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-11 w-full justify-start gap-3 px-3 text-base",
                      isActive(href) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                    {t.nav[key]}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
