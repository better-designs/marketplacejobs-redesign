import { AnimatePresence, motion } from "motion/react"
import { useMemo } from "react"
import { Link, useParams, useSearchParams } from "react-router"

import { ArrowLeftIcon, OfficeIcon, ExternalLinkIcon, GlobeIcon, SearchIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { SearchInput } from "@/components/ui/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CompanyCard } from "@/components/site/company-card"
import { CompanyLogo } from "@/components/site/company-logo"
import { JobRow } from "@/components/site/job-row"
import { Container, PageHeader } from "@/components/site/layout"
import { MARKET_TYPES, STAGES, companyHue, oklchOf, placeName, companies, getCompanyBySlug, jobsFor, roleCount } from "@/lib/data"

const SORTS = [
  { value: "roles", label: "Most open roles" },
  { value: "name", label: "Name, A to Z" },
]

export function Companies() {
  const [params, setParams] = useSearchParams()
  const q = params.get("q") ?? ""
  const stage = params.get("stage") ?? "all"
  const type = params.get("type") ?? "all"
  const sort = params.get("sort") ?? "roles"
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params)
    if (!v || v === "all") n.delete(k)
    else n.set(k, v)
    setParams(n, { replace: true, preventScrollReset: true })
  }

  const list = useMemo(() => {
    const out = companies.filter(
      (c) =>
        (stage === "all" || c.stage === stage || (stage === "Series C+" && c.stage === "Series C")) &&
        (type === "all" || c.type === type) &&
        (!q || `${c.name} ${c.description}`.toLowerCase().includes(q.toLowerCase())),
    )
    return out.sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : roleCount(b.id) - roleCount(a.id)))
  }, [q, stage, type, sort])

  return (
    <Container className="flex flex-col gap-8 pt-10">
      <PageHeader title="Marketplace companies" text="Startups hiring now. Filter by stage or marketplace type." />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <SearchInput value={q} onChange={(e) => set("q", e.target.value)} onClear={() => set("q", "")} placeholder="Search companies" aria-label="Search companies" className="h-11 rounded-full bg-card shadow-[var(--tb-shadow-card)]" />
          </div>
          <Select items={[{ value: "all", label: "Any marketplace type" }, ...MARKET_TYPES.map((t) => ({ value: t, label: t }))]} value={type} onValueChange={(v) => set("type", String(v))}>
            <SelectTrigger aria-label="Marketplace type" className="h-11 sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any marketplace type</SelectItem>
              {MARKET_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select items={SORTS} value={sort} onValueChange={(v) => set("sort", String(v))}>
            <SelectTrigger aria-label="Sort companies" className="h-11 sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="-mx-4 overflow-x-auto px-4">
          <ToggleGroup value={[stage]} onValueChange={(v: string[]) => set("stage", v[0] ?? "all")} aria-label="Funding stage" className="w-max">
            <ToggleGroupItem value="all" className="h-11 px-4">Any stage</ToggleGroupItem>
            {STAGES.map((s) => (
              <ToggleGroupItem key={s} value={s} className="h-11 px-4">
                {s}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <p className="-mb-3 text-sm text-muted-foreground" aria-live="polite">
        <span className="font-medium tabular-nums text-foreground">{list.length}</span> {list.length === 1 ? "company" : "companies"}
      </p>

      {list.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="size-5" />}
          title="No companies match"
          description="Try another stage or clear the search."
          action={
            <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
              Clear filters
            </Button>
          }
          className="bg-card py-16"
        />
      ) : (
        <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((c, i) => (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.165, 0.84, 0.44, 1], delay: Math.min(i, 12) * 0.02 }}
              >
                <CompanyCard company={c} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </Container>
  )
}

export function CompanyPage() {
  const { id = "" } = useParams()
  const company = getCompanyBySlug(id)
  if (!company) {
    return (
      <Container className="pt-16">
        <EmptyState
          icon={<OfficeIcon className="size-5" />}
          title="We could not find this company"
          action={
            <Button asChild>
              <Link to="/companies">Browse companies</Link>
            </Button>
          }
          className="bg-card py-16"
        />
      </Container>
    )
  }
  const roles = jobsFor(company.id)
  const hue = companyHue(company)
  return (
    <Container className="flex flex-col gap-8 pt-8">
      <Button variant="ghost" size="sm" asChild className="-ml-3 w-fit text-muted-foreground">
        <Link to="/companies">
          <ArrowLeftIcon className="size-4" />
          All companies
        </Link>
      </Button>

      <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--tb-shadow-card)]">
        <div aria-hidden className="h-28 sm:h-36" style={{ background: `linear-gradient(140deg, ${oklchOf(hue, 0.55)}, ${oklchOf(hue, 0.15)} 70%)` }} />
        <div className="px-5">
          <CompanyLogo companyId={company.id} name={company.name} size="lg" className="-mt-10 size-20 rounded-[1.375rem] ring-4 ring-card" />
        </div>
        <div className="flex flex-col gap-5 px-5 pb-5 pt-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex max-w-2xl flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[1.75rem] font-semibold leading-tight text-foreground">{company.name}</h1>
                {roles.length ? <Badge variant="success">Hiring now</Badge> : null}
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{company.description}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {company.stage ? <Badge variant="outline">{company.stage}</Badge> : null}
                {company.type ? <Badge variant="outline">{company.type} marketplace</Badge> : null}
                {company.location ? <Badge variant="outline">{placeName(company.location)}</Badge> : null}
              </div>
            </div>
          </div>
          {company.website ? (
            <Button variant="secondary" asChild className="h-11 w-fit shrink-0">
              <a href={company.website} target="_blank" rel="noreferrer">
                <GlobeIcon className="size-4" />
                Website
                <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      <section aria-labelledby="open" className="flex flex-col gap-3">
        <h2 id="open" className="text-xl font-semibold text-foreground">
          {roles.length ? `${roles.length} open ${roles.length === 1 ? "role" : "roles"}` : "Open roles"}
        </h2>
        {roles.length ? (
          <Card className="p-2">
            <ul className="flex flex-col gap-0.5">
              {roles.map((j, i) => (
                <JobRow key={j.id} job={j} index={i} showCompany={false} />
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState
            icon={<OfficeIcon className="size-5" />}
            title={`${company.name} has no open roles right now`}
            description="Roles appear here as soon as their careers page lists one."
            action={
              <Button variant="secondary" asChild>
                <Link to="/companies">See companies hiring</Link>
              </Button>
            }
            className="bg-card py-12"
          />
        )}
      </section>
    </Container>
  )
}
