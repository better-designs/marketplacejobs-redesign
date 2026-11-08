import { AnimatePresence, motion } from "motion/react"
import { useEffect } from "react"
import { Link, Outlet, useLocation } from "react-router"

import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AI_TOOLS, SiteHeader, Wordmark } from "@/components/site/site-header"
import { cn } from "@/lib/utils"

const FOOTER = [
  { title: "Find work", links: [["Jobs", "/jobs"], ["Companies", "/companies"], ["Collections", "/collections"], ["Saved roles", "/saved"]] },
  { title: "AI tools", links: AI_TOOLS.map((t) => [t.label, t.to]) },
  { title: "Hiring", links: [["For employers", "/employers"], ["List your company", "/submit-company"], ["Newsletter", "/newsletter"]] },
]

function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex max-w-xs flex-col gap-3">
          <Wordmark />
          <p className="text-sm text-muted-foreground">The AI-native job board for marketplace startups.</p>
        </div>
        {FOOTER.map((g) => (
          <nav key={g.title} aria-label={g.title} className="flex flex-col gap-2.5">
            <h2 className="text-sm font-medium text-foreground">{g.title}</h2>
            {g.links.map(([label, to]) => (
              <Link key={to} to={to} className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <Separator />
      <p className="mx-auto max-w-[90rem] px-4 py-5 text-xs text-muted-foreground sm:px-6">Redesign prototype. Roles come from the live Marketplace Jobs feed, 8 November 2026.</p>
    </footer>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return (
    <TooltipProvider delay={300}>
      <div className="flex min-h-svh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2 focus:shadow-md">
          Skip to content
        </a>
        <SiteHeader />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            id="main"
            key={pathname.split("/").slice(0, 2).join("/")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.28, ease: [0.165, 0.84, 0.44, 1] }}
            className="flex-1"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <SiteFooter />
        <Toaster position="bottom-center" />
      </div>
    </TooltipProvider>
  )
}

/** App-scale page title with one supporting line and an optional action group. */
export function PageHeader({ title, text, children, className }: { title: string; text?: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex max-w-2xl flex-col gap-1.5">
        <h1 className="text-[1.75rem] font-semibold leading-tight text-foreground">{title}</h1>
        {text ? <p className="text-[0.9375rem] text-muted-foreground">{text}</p> : null}
      </div>
      {children ? <div className="flex shrink-0 items-center gap-2">{children}</div> : null}
    </div>
  )
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[90rem] px-4 sm:px-6", className)}>{children}</div>
}
