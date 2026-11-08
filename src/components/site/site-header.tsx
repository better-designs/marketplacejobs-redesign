import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router"

import {
  SparkleIcon,
  BookmarkIcon,
  MessageContentIcon,
  CalculatorIcon,
  AlignLeftIcon,
  WandSparkleIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchPalette } from "@/components/site/search-palette"
import { useSaved } from "@/lib/saved"
import { cn } from "@/lib/utils"

const MAIN = [
  { to: "/jobs", label: "Jobs" },
  { to: "/companies", label: "Companies" },
  { to: "/collections", label: "Collections" },
]

export const AI_TOOLS = [
  { to: "/ai-assistant", label: "AI Copilot", text: "Ask about roles and companies.", icon: MessageContentIcon },
  { to: "/match", label: "Job Match", text: "Answer seven questions, get matched roles.", icon: UserIcon },
  { to: "/application-tool", label: "Application tool", text: "Draft a cover letter and outreach note.", icon: WandSparkleIcon },
  { to: "/salary", label: "Salary estimator", text: "See what marketplaces pay for a role.", icon: CalculatorIcon },
]

export function Wordmark() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md font-semibold tracking-tight text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="grid size-7 place-items-center rounded-[0.5rem] bg-primary text-[0.8125rem] font-bold text-primary-foreground shadow-[inset_0_0.0625rem_0.125rem_oklch(1_0_0/0.18)]">M</span>
      <span>Marketplace Jobs</span>
    </Link>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavigationMenuItem>
      <NavLink to={to} className="relative inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:text-foreground">
        {({ isActive }) => (
          <>
            {isActive ? <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg bg-accent" transition={{ type: "spring", stiffness: 500, damping: 38 }} /> : null}
            <span className="relative">{label}</span>
          </>
        )}
      </NavLink>
    </NavigationMenuItem>
  )
}

export function SiteHeader() {
  const saved = useSaved()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <header className={cn("sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md transition-colors duration-base", scrolled ? "border-border" : "border-transparent")}>
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-6 px-4 sm:px-6">
        <Wordmark />

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-0.5">
            {MAIN.map((m) => (
              <NavItem key={m.to} {...m} />
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11 rounded-lg bg-transparent px-3 text-muted-foreground hover:bg-transparent hover:text-foreground data-popup-open:bg-accent data-popup-open:text-foreground">
                AI tools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[26rem] grid-cols-2 gap-1 p-2">
                  {AI_TOOLS.map((t) => (
                    <li key={t.to}>
                      <NavigationMenuLink render={<Link to={t.to} />} className="flex h-full flex-col gap-1 rounded-lg p-3 outline-none transition-colors hover:bg-accent focus-visible:bg-accent">
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <t.icon className="size-4 text-muted-foreground" />
                          {t.label}
                        </span>
                        <span className="text-xs leading-snug text-muted-foreground">{t.text}</span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavItem to="/employers" label="For employers" />
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPaletteOpen(true)} className="hidden h-11 w-56 justify-start rounded-full border-transparent bg-foreground/[0.06] pl-4 pr-2 text-muted-foreground hover:border-transparent hover:bg-foreground/[0.09] hover:shadow-none lg:inline-flex">
            <SearchIcon className="size-4" />
            Search
            <Kbd className="ml-auto rounded-full px-2">⌘K</Kbd>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setPaletteOpen(true)} aria-label="Search roles and companies" className="size-11 lg:hidden">
            <SearchIcon className="size-5" />
          </Button>
          <Button variant="ghost" size="sm" asChild className="relative h-11 min-w-11">
            <Link to="/saved" aria-label={`Saved roles, ${saved.length}`}>
              <BookmarkIcon className="size-[1.125rem]" />
              <span className="hidden sm:inline">Saved</span>
              {saved.length ? (
                <motion.span key={saved.length} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 20 }}>
                  <Badge className="h-5 min-w-5 px-1.5 tabular-nums">
                    {saved.length}
                  </Badge>
                </motion.span>
              ) : null}
            </Link>
          </Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" className="size-11 md:hidden" />}>
              <AlignLeftIcon className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[86%] flex-col gap-6 bg-card">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1" aria-label="Main">
                {[...MAIN, { to: "/employers", label: "For employers" }].map((m) => (
                  <NavLink key={m.to} to={m.to} className="rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium text-foreground aria-[current=page]:bg-accent">
                    {m.label}
                  </NavLink>
                ))}
              </nav>
              <div className="flex flex-col gap-1">
                <p className="flex items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground">
                  <SparkleIcon className="size-3.5" /> AI tools
                </p>
                {AI_TOOLS.map((t) => (
                  <NavLink key={t.to} to={t.to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium text-foreground aria-[current=page]:bg-accent">
                    <t.icon className="size-4 text-muted-foreground" />
                    {t.label}
                  </NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <SearchPalette open={paletteOpen} onOpenChange={setPaletteOpen} tools={AI_TOOLS} />
    </header>
  )
}
