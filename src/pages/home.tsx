import { motion } from "motion/react"
import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"

import {
  TargetIcon,
  ArrowRightIcon,
  CubeAxisIcon,
  ChartBarIcon,
  CodeIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  UsersIcon,
  ShopIcon,
  PaletteDuoIcon,
  SearchIcon,
  Hierarchy2Icon,
  ChartTrendUpIcon,
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CompanyCard } from "@/components/site/company-card"
import { CompanyLogo } from "@/components/site/company-logo"
import { JobCard } from "@/components/site/job-card"
import { Container } from "@/components/site/layout"
import { AI_TOOLS } from "@/components/site/site-header"
import { DEPARTMENTS, addedToday, hiringCompanies, jobs, roleCount, spreadByCompany } from "@/lib/data"

const ease = [0.165, 0.84, 0.44, 1] as const

const TEAM_ICONS: Record<string, typeof CodeIcon> = {
  all: LayoutDashboardIcon,
  Engineering: CodeIcon,
  Product: CubeAxisIcon,
  Design: PaletteDuoIcon,
  Data: ChartBarIcon,
  Marketing: TargetIcon,
  Growth: ChartTrendUpIcon,
  Sales: ShopIcon,
  Operations: Hierarchy2Icon,
  Finance: CreditCardIcon,
  People: UsersIcon,
}

const teams = [
  { value: "all", label: "All teams", count: jobs.length },
  ...DEPARTMENTS.filter((d) => d !== "Other")
    .map((d) => ({ value: d, label: d, count: jobs.filter((j) => j.department === d).length }))
    .filter((t) => t.count > 0),
]

const byRoles = [...hiringCompanies].sort((a, b) => roleCount(b.id) - roleCount(a.id))
const mosaic = byRoles.filter((c) => c.logo && c.logoFit === "cover").slice(0, 12)

function Shelf({ title, to, children }: { title: string; to: string; children: React.ReactNode }) {
  return (
    <Carousel opts={{ align: "start", dragFree: true }} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground">
          <Link to={to} className="group inline-flex min-h-11 items-center gap-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {title}
            <ArrowRightIcon className="size-4 text-muted-foreground transition-transform duration-base ease-out group-hover:translate-x-0.5" />
          </Link>
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          <CarouselPrevious className="static size-11 translate-y-0" />
          <CarouselNext className="static size-11 translate-y-0" />
        </div>
      </div>
      <CarouselContent className="pb-2">{children}</CarouselContent>
    </Carousel>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [q, setQ] = useState("")
  const [team, setTeam] = useState("all")
  const search = (term: string) => navigate(term ? `/jobs?q=${encodeURIComponent(term)}` : "/jobs")

  const teamJobs = useMemo(() => spreadByCompany(team === "all" ? jobs : jobs.filter((j) => j.department === team)), [team])
  const remote = teamJobs.filter((j) => j.workStyle === "Remote")
  const teamParam = team === "all" ? "" : `role=${team}`

  return (
    <>
      <Container className="grid items-center gap-12 pb-12 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:pt-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <h1 className="max-w-[13ch] text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.035em] text-foreground sm:text-[3.5rem]">
              Find the best marketplace jobs.
            </h1>
            <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-muted-foreground">
              {jobs.length} open roles at {hiringCompanies.length} marketplace startups, each with an AI summary. {addedToday} added today.
            </p>
          </div>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              search(q)
            }}
            className="flex max-w-xl items-center gap-2 rounded-full bg-card p-1.5 pl-5 shadow-[var(--tb-shadow-pop)]"
          >
            <SearchIcon className="size-5 shrink-0 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search roles, skills, companies" aria-label="Search roles" className="h-11 border-0 bg-transparent px-1 text-[0.9375rem] shadow-none focus-visible:ring-0" />
            <Button type="submit" size="lg" className="h-11 shrink-0 rounded-full px-6">
              Search
            </Button>
          </form>
        </motion.div>

        <div className="hidden pb-6 lg:block" aria-label="Companies hiring now">
          <div className="grid grid-cols-4 gap-3">
            {mosaic.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.8, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 + i * 0.04 }}
                className={i % 2 ? "translate-y-6" : ""}
              >
                <Link to={`/companies/${c.slug}`} aria-label={`${c.name}, ${roleCount(c.id)} open roles`} className="group block rounded-[1.375rem] outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <CompanyLogo companyId={c.id} name={c.name} size="lg" className="aspect-square size-full rounded-[1.375rem] transition-[box-shadow] duration-base group-hover:shadow-[var(--tb-shadow-pop)]" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>

      <Container className="flex flex-col gap-12 pb-8">
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6">
          <ToggleGroup value={[team]} onValueChange={(v: string[]) => v[0] && setTeam(v[0])} aria-label="Browse by team" className="w-max gap-1 border-0 bg-transparent p-0 shadow-none">
            {teams.map((t) => {
              const Icon = TEAM_ICONS[t.value] ?? LayoutDashboardIcon
              return (
                <ToggleGroupItem
                  key={t.value}
                  value={t.value}
                  className="h-auto min-w-20 flex-col gap-1.5 rounded-xl bg-transparent px-4 py-2.5 text-muted-foreground shadow-none hover:bg-accent hover:text-foreground data-pressed:bg-primary/10 data-pressed:bg-none data-pressed:text-foreground data-pressed:shadow-none"
                >
                  <Icon className="!size-6" />
                  <span className="text-xs font-medium">
                    {t.label} <span className="tabular-nums text-muted-foreground">{t.count}</span>
                  </span>
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </div>

        <motion.div key={team} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} className="flex flex-col gap-12">
          <Shelf title={team === "all" ? "Newest roles" : `Newest in ${team.toLowerCase()}`} to={`/jobs${teamParam ? `?${teamParam}` : ""}`}>
            {teamJobs.slice(0, 12).map((j) => (
              <CarouselItem key={j.id} className="basis-[16.5rem]">
                <JobCard job={j} />
              </CarouselItem>
            ))}
          </Shelf>
          {remote.length >= 3 ? (
            <Shelf title={team === "all" ? "Remote roles" : `Remote ${team.toLowerCase()} roles`} to={`/jobs?where=Remote${teamParam ? `&${teamParam}` : ""}`}>
              {remote.slice(0, 12).map((j) => (
                <CarouselItem key={j.id} className="basis-[16.5rem]">
                  <JobCard job={j} />
                </CarouselItem>
              ))}
            </Shelf>
          ) : null}
        </motion.div>

        <Shelf title="Companies hiring the most" to="/companies">
          {byRoles.slice(0, 10).map((c) => (
            <CarouselItem key={c.id} className="basis-[18rem]">
              <CompanyCard company={c} />
            </CarouselItem>
          ))}
        </Shelf>

        <section aria-labelledby="tools" className="grid gap-6 rounded-3xl bg-primary/[0.07] p-6 sm:p-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
          <div className="flex flex-col gap-2">
            <h2 id="tools" className="text-xl font-semibold text-foreground">
              Let AI do the busywork
            </h2>
            <p className="text-[0.9375rem] text-muted-foreground">Match, write and compare pay without leaving the board.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {AI_TOOLS.map((t) => (
              <li key={t.to}>
                <Link to={t.to} className="flex h-full items-start gap-3 rounded-2xl bg-card p-4 shadow-[var(--tb-shadow-card)] outline-none transition-[box-shadow] duration-base hover:shadow-[var(--tb-shadow-pop)] focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                    <t.icon className="size-5" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">{t.label}</span>
                    <span className="text-sm text-muted-foreground">{t.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  )
}
