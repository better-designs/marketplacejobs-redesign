import { AnimatePresence, motion } from "motion/react"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router"

import { SlidersSolidIcon, SearchIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { SearchInput } from "@/components/ui/search-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { JobDetail } from "@/components/site/job-detail"
import { JobRow } from "@/components/site/job-row"
import { DEPARTMENTS, type Job, type JobFilters, LEVELS, WORK_STYLES, activeFilterCount, filterJobs } from "@/lib/data"
import { useMediaQuery } from "@/lib/use-media-query"
import { cn } from "@/lib/utils"

const PAGE = 20
let firstLoadDone = false

type Option = { value: string; label: string }
const opt = (all: string, list: readonly string[]): Option[] => [{ value: "all", label: all }, ...list.map((v) => ({ value: v, label: v }))]
const DEPT_OPTS = opt("All roles", DEPARTMENTS)
const LEVEL_OPTS = opt("Any experience", LEVELS)
const WORK_OPTS = opt("Any location type", WORK_STYLES)
const SORT_OPTS: Option[] = [
  { value: "recent", label: "Most recent" },
  { value: "oldest", label: "Oldest" },
]

function FilterSelect({ label, value, options, onChange, className, pill = true }: { label: string; value: string; options: Option[]; onChange: (v: string) => void; className?: string; pill?: boolean }) {
  const active = value !== "all" && value !== "recent"
  return (
    <Select items={options} value={value} onValueChange={(v) => onChange(String(v))}>
      <SelectTrigger aria-label={label} className={cn(pill && "w-auto gap-2 rounded-full px-4", pill && active && "border-primary/40 bg-primary/10 text-foreground", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SkeletonRows() {
  return (
    <ul aria-busy="true" aria-label="Loading roles" className="flex flex-col gap-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <li key={i} className="flex items-start gap-4 px-4 py-4">
          <Skeleton className="size-10 rounded-[0.625rem]" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="mt-1 h-5 w-32 rounded-full" />
          </div>
          <Skeleton className="h-3 w-10" />
        </li>
      ))}
    </ul>
  )
}

function pageList(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total))
  const sorted = [...set].sort((a, b) => a - b)
  const out: (number | "gap")[] = []
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push("gap")
    out.push(p)
  })
  return out
}

/**
 * Search, filter and read roles. Desktop shows the list beside the selected role, so a
 * person compares without losing their place. Phones open each role on its own page.
 */
export function JobsBrowser({ source, preset = {} }: { source: Job[]; preset?: Partial<JobFilters> }) {
  const [params, setParams] = useSearchParams()
  const wide = useMediaQuery("(min-width: 64rem)")
  const [loading, setLoading] = useState(!firstLoadDone)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    if (firstLoadDone) return
    const t = setTimeout(() => {
      firstLoadDone = true
      setLoading(false)
    }, 550)
    return () => clearTimeout(t)
  }, [])

  const filters: JobFilters = {
    q: params.get("q") ?? preset.q ?? "",
    department: params.get("role") ?? preset.department ?? "all",
    level: params.get("level") ?? preset.level ?? "all",
    workStyle: params.get("where") ?? preset.workStyle ?? "all",
    sort: (params.get("sort") as JobFilters["sort"]) ?? "recent",
  }
  const page = Math.max(1, Number(params.get("page") ?? 1))

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "" || v === "all" || (k === "sort" && v === "recent") || (k === "page" && v === "1")) next.delete(k)
      else next.set(k, v)
    }
    if (!("page" in patch)) next.delete("page")
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const results = useMemo(() => filterJobs(source, filters), [source, filters.q, filters.department, filters.level, filters.workStyle, filters.sort]) // eslint-disable-line react-hooks/exhaustive-deps
  const pages = Math.max(1, Math.ceil(results.length / PAGE))
  const current = Math.min(page, pages)
  const visible = results.slice((current - 1) * PAGE, current * PAGE)
  const selectedId = params.get("job") && results.some((j) => j.id === params.get("job")) ? params.get("job")! : visible[0]?.id
  const selected = results.find((j) => j.id === selectedId)
  const activeCount = activeFilterCount(filters)

  const clearAll = () => setParams(new URLSearchParams(), { replace: true })
  const goPage = (p: number) => {
    set({ page: String(p), job: null })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const filterControls = (stack: boolean) => (
    <>
      <FilterSelect label="Role" value={filters.department} options={DEPT_OPTS} onChange={(v) => set({ role: v })} className="h-11" />
      <FilterSelect label="Experience" value={filters.level} options={LEVEL_OPTS} onChange={(v) => set({ level: v })} className="h-11" />
      <FilterSelect label="Location type" value={filters.workStyle} options={WORK_OPTS} onChange={(v) => set({ where: v })} className={stack ? "h-11" : "h-11"} />
    </>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchInput value={filters.q} onChange={(e) => set({ q: e.target.value })} onClear={() => set({ q: null })} placeholder="Search roles, companies, locations" aria-label="Search roles" className="h-11 rounded-full bg-card shadow-[var(--tb-shadow-card)]" />
          </div>
          <div className="hidden items-center gap-2 lg:flex">{filterControls(false)}</div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button variant="secondary" size="lg" className="h-11 rounded-full lg:hidden" />}>
              <SlidersSolidIcon className="size-4" />
              Filters
              {activeCount ? (
                <Badge className="h-5 min-w-5 px-1.5">
                  {activeCount}
                </Badge>
              ) : null}
            </SheetTrigger>
            <SheetContent side="bottom" className="flex flex-col gap-5 rounded-t-[1.25rem] bg-card pb-8">
              <SheetHeader className="text-left">
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow the feed by role, experience and location type.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-3">{filterControls(true)}</div>
              <SheetFooter className="flex-row gap-2">
                <Button variant="ghost" size="lg" onClick={clearAll} disabled={!activeCount}>
                  Clear all
                </Button>
                <Button size="lg" className="flex-1" onClick={() => setSheetOpen(false)}>
                  Show {results.length} roles
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex min-h-9 items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-medium tabular-nums text-foreground">{results.length}</span> {results.length === 1 ? "role" : "roles"}
            {(activeCount || filters.q) && results.length > 0 ? (
              <Button variant="link" size="sm" onClick={clearAll} className="ml-1 h-auto px-1 text-foreground underline">
                Clear filters
              </Button>
            ) : null}
          </p>
          <FilterSelect pill={false} label="Sort" value={filters.sort} options={SORT_OPTS} onChange={(v) => set({ sort: v })} className="h-11 w-auto gap-2 border-transparent bg-transparent shadow-none" />
        </div>
      </div>

      {loading ? (
        <SkeletonRows />
      ) : results.length === 0 ? (
        <EmptyState
          icon={<SearchIcon className="size-5" />}
          title="No roles match these filters"
          description={[filters.q && `"${filters.q}"`, filters.department !== "all" && filters.department, filters.level !== "all" && filters.level, filters.workStyle !== "all" && filters.workStyle].filter(Boolean).join(", ") + " removed every role."}
          action={
            <Button variant="secondary" onClick={clearAll}>
              Clear filters
            </Button>
          }
          className="bg-card py-16"
        />
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <ul className="flex flex-col gap-0.5" aria-label="Roles">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((j, i) => (
                  <JobRow key={j.id} job={j} index={i} selected={wide && j.id === selectedId} onSelect={wide ? (id) => set({ job: id, page: String(current) }) : undefined} />
                ))}
              </AnimatePresence>
            </ul>
            {pages > 1 ? (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" className={current === 1 ? "pointer-events-none opacity-40" : ""} aria-disabled={current === 1} onClick={(e) => (e.preventDefault(), goPage(current - 1))} />
                  </PaginationItem>
                  {pageList(current, pages).map((p, i) =>
                    p === "gap" ? (
                      <PaginationItem key={`g${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink href="#" isActive={p === current} onClick={(e) => (e.preventDefault(), goPage(p))}>
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext href="#" className={current === pages ? "pointer-events-none opacity-40" : ""} aria-disabled={current === pages} onClick={(e) => (e.preventDefault(), goPage(current + 1))} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </div>

          {wide && selected ? (
            <Card className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.08 } }}
                  transition={{ duration: 0.22, ease: [0.165, 0.84, 0.44, 1] }}
                  className="p-5"
                >
                  <JobDetail job={selected} />
                </motion.div>
              </AnimatePresence>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  )
}
