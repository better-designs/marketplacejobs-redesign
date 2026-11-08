import jobsJson from "@/data/jobs.json"
import companiesJson from "@/data/companies.json"
import collectionsJson from "@/data/collections.json"

export type Job = {
  id: string
  title: string
  companyId: string
  company: string
  summary: string
  description: string
  location: string
  workStyle: "Remote" | "Hybrid" | "Onsite" | string
  type: string
  level: string
  department: string
  skills: string[]
  applyUrl: string | null
  posted: string
  salaryMin: number | null
  salaryMax: number | null
}

export type Company = {
  id: string
  name: string
  slug: string
  logo: string | null
  website: string | null
  description: string
  stage: string | null
  type: string | null
  location: string | null
  teamSize: string | null
  /** cover: the logo is a square mark that fills its tile; contain: it needs room. */
  logoFit: "cover" | "contain"
  /** oklch [l, c, h] of the logo's own background, to extend it across the tile. */
  logoBg: [number, number, number] | null
  /** oklch [l, c, h] of the logo's dominant colour: the company's colour on the board. */
  tint: [number, number, number] | null
}

const HUES = [52, 152, 256, 18, 300, 200, 95]

/** The company's colour, or a stable warm hue from its name when the logo has none. */
export function companyHue(c: Pick<Company, "name" | "tint"> | undefined) {
  if (c?.tint) return { l: Math.min(Math.max(c.tint[0], 0.45), 0.7), c: Math.min(c.tint[1], 0.19), h: c.tint[2] }
  const n = [...(c?.name ?? "?")].reduce((a, ch) => a + ch.charCodeAt(0), 0)
  return { l: 0.6, c: 0.13, h: HUES[n % HUES.length] }
}
export const oklchOf = ({ l, c, h }: { l: number; c: number; h: number }, alpha = 1) => `oklch(${l} ${c} ${h}${alpha < 1 ? ` / ${alpha}` : ""})`

export type Collection = {
  id: string
  slug: string
  name: string
  description: string
  companyIds: string[]
  website: string | null
}

export const jobs = jobsJson as Job[]
export const companies = companiesJson as Company[]
export const collections = collectionsJson as Collection[]

const companyById = new Map(companies.map((c) => [c.id, c]))
const companyBySlug = new Map(companies.map((c) => [c.slug, c]))
const jobById = new Map(jobs.map((j) => [j.id, j]))

export const getCompany = (id: string) => companyById.get(id)
export const getCompanyBySlug = (slug: string) => companyBySlug.get(slug) ?? companyById.get(slug)
export const getJob = (id: string) => jobById.get(id)
export const jobsFor = (companyId: string) => jobs.filter((j) => j.companyId === companyId)

export const roleCount = (companyId: string) => jobsFor(companyId).length

export const DEPARTMENTS = ["Engineering", "Product", "Design", "Data", "Marketing", "Growth", "Sales", "Operations", "Finance", "People", "Other"] as const
export const LEVELS = ["Entry", "Mid", "Senior", "Lead", "Executive"] as const
export const WORK_STYLES = ["Remote", "Hybrid", "Onsite"] as const
export const STAGES = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Public"] as const
export const MARKET_TYPES = ["C2C", "B2C", "B2B", "Managed", "SaaS-enabled", "P2P"] as const

/** Today, fixed to the feed's capture date so relative times stay true. */
const TODAY = new Date("2026-11-08T12:00:00Z")

export function postedLabel(date: string) {
  const days = Math.round((TODAY.getTime() - new Date(date + "T12:00:00Z").getTime()) / 86_400_000)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days}d ago`
}

export function isNew(date: string) {
  return postedLabel(date) === "Today"
}

const US_STATES: Record<string, string> = { AL: "Alabama", AZ: "Arizona", CA: "California", CO: "Colorado", CT: "Connecticut", DC: "Washington DC", FL: "Florida", GA: "Georgia", IL: "Illinois", IN: "Indiana", MA: "Massachusetts", MD: "Maryland", MI: "Michigan", MN: "Minnesota", MO: "Missouri", NC: "North Carolina", NJ: "New Jersey", NV: "Nevada", NY: "New York", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", TN: "Tennessee", TX: "Texas", UT: "Utah", VA: "Virginia", WA: "Washington", WI: "Wisconsin" }

/** "Seattle, WA" becomes "Seattle, Washington" so nobody has to decode a state code. */
export function placeName(location: string) {
  return location.replace(/,\s*([A-Z]{2})\b/g, (m, code: string) => (US_STATES[code] ? `, ${US_STATES[code]}` : m))
}

export function shortLocation(location: string) {
  return placeName(location.replace(/, United States$/, "").replace(/^Remote - /, ""))
}

export type JobFilters = {
  q: string
  department: string
  level: string
  workStyle: string
  sort: "recent" | "oldest"
}

export const emptyFilters: JobFilters = { q: "", department: "all", level: "all", workStyle: "all", sort: "recent" }

export function filterJobs(list: Job[], f: JobFilters) {
  const q = f.q.trim().toLowerCase()
  const out = list.filter((j) => {
    if (f.department !== "all" && j.department !== f.department) return false
    if (f.level !== "all" && j.level !== f.level) return false
    if (f.workStyle !== "all" && j.workStyle !== f.workStyle) return false
    if (!q) return true
    return [j.title, j.company, j.location, j.department, j.summary].some((s) => s.toLowerCase().includes(q))
  })
  return f.sort === "oldest" ? [...out].reverse() : out
}

export function activeFilterCount(f: JobFilters) {
  return [f.department, f.level, f.workStyle].filter((v) => v !== "all").length
}

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

/** Count of companies with at least one open role in the feed. */
export const hiringCompanies = companies.filter((c) => roleCount(c.id) > 0)

export const addedToday = jobs.filter((j) => j.posted === "2026-11-08").length

/** Splits the ATS description into readable blocks: headings, bullets, paragraphs. */
export function descriptionBlocks(text: string) {
  const blocks: { kind: "h" | "p" | "li"; text: string }[] = []
  for (const raw of text.split("\n")) {
    const line = raw.trim()
    if (!line) continue
    if (/^#{1,4}\s/.test(line)) blocks.push({ kind: "h", text: line.replace(/^#+\s*/, "").replace(/\*\*/g, "") })
    else if (/^[-*•]\s/.test(line)) blocks.push({ kind: "li", text: line.replace(/^[-*•]\s*/, "").replace(/\*\*/g, "") })
    else if (/^\*\*.+\*\*:?$/.test(line)) blocks.push({ kind: "h", text: line.replace(/\*\*/g, "").replace(/:$/, "") })
    else blocks.push({ kind: "p", text: line.replace(/\*\*/g, "") })
  }
  return blocks
}

/** Newest first, but one role per company before any company repeats, so a shelf shows many marketplaces. */
export function spreadByCompany(list: Job[]) {
  const queues = new Map<string, Job[]>()
  for (const j of list) queues.set(j.companyId, [...(queues.get(j.companyId) ?? []), j])
  const out: Job[] = []
  while (out.length < list.length) for (const q of queues.values()) if (q.length) out.push(q.shift()!)
  return out
}
