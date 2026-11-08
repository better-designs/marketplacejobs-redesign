import { useEffect, useMemo, useState, type ComponentType, type ReactNode, type SVGProps } from "react"
import { useNavigate } from "react-router"

import { ArrowRightIcon, BookmarkIcon, FolderFilledIcon, GlobeIcon, OfficeIcon, PageIcon, ShopIcon, SparkleIcon, XIcon } from "@/components/icons"
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { CompanyLogo } from "@/components/site/company-logo"
import { type Company, type Job, companies, hiringCompanies, isNew, jobs, postedLabel, roleCount, shortLocation, spreadByCompany } from "@/lib/data"
import { cn } from "@/lib/utils"

type Icon = ComponentType<SVGProps<SVGSVGElement>>
export type PaletteTool = { to: string; label: string; text: string; icon: Icon }

const remote = jobs.filter((j) => j.workStyle === "Remote").length
const PAGES: PaletteTool[] = [
  { to: "/jobs", label: "All roles", text: `${jobs.length} open roles`, icon: PageIcon },
  { to: "/jobs?where=Remote", label: "Remote roles", text: `${remote} open roles`, icon: GlobeIcon },
  { to: "/companies", label: "Companies", text: `${hiringCompanies.length} hiring now`, icon: OfficeIcon },
  { to: "/collections", label: "Collections", text: "Companies grouped by fund", icon: FolderFilledIcon },
  { to: "/saved", label: "Saved roles", text: "Roles you bookmarked", icon: BookmarkIcon },
  { to: "/employers", label: "For employers", text: "Pin roles or feature your company", icon: ShopIcon },
]
const newest = spreadByCompany(jobs).slice(0, 4)

const tokens = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean)
const hasAll = (text: string, ts: string[]) => ts.every((t) => text.includes(t))

function searchJobs(ts: string[]) {
  const score = (j: Job) => {
    const title = j.title.toLowerCase()
    return ts.reduce((n, t) => n + (title.startsWith(t) ? 3 : title.includes(t) ? 2 : 1), 0)
  }
  return jobs
    .filter((j) => hasAll(`${j.title} ${j.company} ${j.location} ${j.department} ${j.workStyle}`.toLowerCase(), ts))
    .sort((a, b) => score(b) - score(a))
}

/** Marks the part of the text the person typed, so they can see why a row matched. */
function Match({ text, ts }: { text: string; ts: string[] }) {
  if (!ts.length) return <>{text}</>
  const parts = text.split(new RegExp(`(${ts.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig"))
  return (
    <span className="text-muted-foreground">
      {parts.map((p, i) => (i % 2 ? <span key={i} className="font-semibold text-foreground">{p}</span> : p))}
    </span>
  )
}

function Row({ value, onSelect, lead, title, sub, trail }: { value: string; onSelect: () => void; lead: ReactNode; title: ReactNode; sub: ReactNode; trail?: ReactNode }) {
  return (
    <CommandItem value={value} onSelect={onSelect} className="group min-h-14 gap-3 rounded-xl px-2.5 py-2 data-[selected=true]:bg-foreground/[0.06] data-[selected=true]:text-foreground">
      {lead}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground">{title}</span>
        <span className="truncate text-[0.8125rem] text-muted-foreground">{sub}</span>
      </span>
      {trail ? <span className="shrink-0 text-xs text-muted-foreground group-data-[selected=true]:hidden">{trail}</span> : null}
      <Kbd className="hidden shrink-0 sm:group-data-[selected=true]:inline-flex" aria-hidden>↵</Kbd>
    </CommandItem>
  )
}

function IconTile({ icon: I }: { icon: Icon }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-[0.75rem] bg-foreground/[0.05] text-foreground/75 group-data-[selected=true]:bg-card">
      <I className="!size-5 !text-current" />
    </span>
  )
}

const logo = "!size-10 !rounded-[0.75rem] !text-sm"

/** ⌘K: finds roles, companies and pages, and hands anything else to Ask AI. */
export function SearchPalette({ open, onOpenChange, tools }: { open: boolean; onOpenChange: (o: boolean) => void; tools: PaletteTool[] }) {
  const navigate = useNavigate()
  const [q, setQ] = useState("")
  useEffect(() => {
    if (open) setQ("")
  }, [open])
  const go = (to: string) => {
    onOpenChange(false)
    navigate(to)
  }

  const query = q.trim()
  const ts = useMemo(() => tokens(query), [query])
  const allRoles = useMemo(() => (ts.length ? searchJobs(ts) : []), [ts])
  const roles = allRoles.slice(0, 6)
  const firms = useMemo(() => (ts.length ? companies.filter((c) => hasAll(c.name.toLowerCase(), ts)).slice(0, 4) : []), [ts])
  const pages = useMemo(() => (ts.length ? [...PAGES, ...tools].filter((p) => hasAll(p.label.toLowerCase(), ts)).slice(0, 3) : []), [ts, tools])
  const none = ts.length > 0 && !roles.length && !firms.length && !pages.length
  const count = ts.length ? allRoles.length + firms.length + pages.length : 0

  const jobRow = (j: Job) => (
    <Row
      key={j.id}
      value={`job-${j.id}`}
      onSelect={() => go(`/jobs/${j.id}`)}
      lead={<CompanyLogo companyId={j.companyId} name={j.company} className={logo} />}
      title={<Match text={j.title} ts={ts} />}
      sub={`${j.company}, ${shortLocation(j.location)}`}
      trail={isNew(j.posted) ? <span className="font-medium text-success">Today</span> : postedLabel(j.posted)}
    />
  )
  const firmRow = (c: Company) => {
    const n = roleCount(c.id)
    return (
      <Row
        key={c.id}
        value={`company-${c.id}`}
        onSelect={() => go(`/companies/${c.slug}`)}
        lead={<CompanyLogo companyId={c.id} name={c.name} className={logo} />}
        title={<Match text={c.name} ts={ts} />}
        sub={[n ? `${n} open ${n === 1 ? "role" : "roles"}` : "No open roles", c.stage].filter(Boolean).join(", ")}
      />
    )
  }
  const pageRow = (p: PaletteTool) => <Row key={p.to} value={`page-${p.to}`} onSelect={() => go(p.to)} lead={<IconTile icon={p.icon} />} title={<Match text={p.label} ts={ts} />} sub={p.text} />

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
      <DialogTitle className="sr-only">Search Marketplace Jobs</DialogTitle>
      <CommandInput
        value={q}
        onValueChange={setQ}
        placeholder="Search roles, companies"
        trailing={
          <DialogClose aria-label="Close search" className="grid size-11 shrink-0 place-items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring sm:-mr-1.5">
            <Kbd className="hidden sm:inline-flex">Esc</Kbd>
            <XIcon className="size-5 text-muted-foreground sm:hidden" />
          </DialogClose>
        }
      />
      <CommandList className="max-h-[min(27rem,58vh)] scroll-py-2 p-2">
        {!ts.length ? (
          <>
            <CommandGroup heading="Browse">{PAGES.slice(0, 3).map(pageRow)}</CommandGroup>
            <CommandGroup heading="Newest roles">{newest.map(jobRow)}</CommandGroup>
            <CommandGroup heading="AI tools">{tools.map(pageRow)}</CommandGroup>
            <CommandGroup heading="More">{PAGES.slice(3).map(pageRow)}</CommandGroup>
          </>
        ) : (
          <>
            {none ? <p className="px-2.5 pb-1 pt-3 text-sm text-muted-foreground">Nothing matches “{query}”. AI can still look for it.</p> : null}
            {roles.length ? <CommandGroup heading="Roles">{roles.map(jobRow)}</CommandGroup> : null}
            {firms.length ? <CommandGroup heading="Companies">{firms.map(firmRow)}</CommandGroup> : null}
            {pages.length ? <CommandGroup heading="Pages">{pages.map(pageRow)}</CommandGroup> : null}
            <CommandGroup heading="Keep looking">
              {allRoles.length > roles.length ? (
                <Row value="all-roles" onSelect={() => go(`/jobs?q=${encodeURIComponent(query)}`)} lead={<IconTile icon={ArrowRightIcon} />} title={`See all ${allRoles.length} roles`} sub={`Matching “${query}”`} />
              ) : null}
              <Row value="ask-ai" onSelect={() => go(`/ai?q=${encodeURIComponent(query)}`)} lead={<IconTile icon={SparkleIcon} />} title="Ask AI" sub={`“${query}”`} />
            </CommandGroup>
          </>
        )}
      </CommandList>
      <div className={cn("hidden h-11 shrink-0 items-center gap-4 border-t border-border/70 px-4 text-xs text-muted-foreground sm:flex")}>
        <span className="flex items-center gap-1.5"><Kbd aria-hidden>↑</Kbd><Kbd aria-hidden>↓</Kbd>Navigate</span>
        <span className="flex items-center gap-1.5"><Kbd aria-hidden>↵</Kbd>Open</span>
        <span aria-live="polite" className="ml-auto tabular-nums">{ts.length ? `${count} ${count === 1 ? "result" : "results"}` : `${jobs.length} open roles`}</span>
      </div>
    </CommandDialog>
  )
}
