import { DEPARTMENTS, type Job, LEVELS, WORK_STYLES, companies, getCompany, jobs } from "@/lib/data"

/**
 * The prototype's AI layer. It reads a question, turns it into filters over the live
 * feed and writes a short answer. Every role it names exists in the feed.
 */
export type AiAnswer = { text: string; roles: Job[]; filters: string[]; link?: { to: string; label: string } }

const DEPT_WORDS: Record<string, string[]> = {
  Engineering: ["engineer", "engineering", "developer", "backend", "frontend", "full stack", "software"],
  Product: ["product", "pm"],
  Design: ["design", "designer", "ux"],
  Data: ["data", "analyst", "analytics", "scientist"],
  Marketing: ["marketing", "brand", "content", "seo"],
  Growth: ["growth", "acquisition"],
  Sales: ["sales", "account executive", "business development", "bdr", "sdr"],
  Operations: ["operations", "ops", "logistics"],
  Finance: ["finance", "accounting", "fp&a"],
  People: ["people", "recruiter", "talent", "hr"],
}

const STAGE_WORDS: [RegExp, string[]][] = [
  [/series a/i, ["Series A"]],
  [/series b/i, ["Series B"]],
  [/(series c|late stage|growth stage)/i, ["Series C+", "Series C", "Public"]],
  [/(seed|early stage)/i, ["Seed", "Pre-seed"]],
  [/public/i, ["Public"]],
]

export function interpret(question: string) {
  const q = question.toLowerCase()
  const depts = DEPARTMENTS.filter((d) => DEPT_WORDS[d]?.some((w) => q.includes(w)))
  const work = WORK_STYLES.find((w) => q.includes(w.toLowerCase()))
  const level = LEVELS.find((l) => q.includes(l.toLowerCase()))
  const stage = STAGE_WORDS.find(([re]) => re.test(q))?.[1]
  const roles = jobs.filter((j) => {
    if (depts.length && !depts.includes(j.department as (typeof DEPARTMENTS)[number])) return false
    if (work && j.workStyle !== work) return false
    if (level && j.level !== level) return false
    if (stage && !stage.includes(getCompany(j.companyId)?.stage ?? "")) return false
    return true
  })
  const filters = [work, level, depts.join(" or "), stage?.[0]].filter(Boolean) as string[]
  return { roles, filters, depts, work, level, stage }
}

const plural = (n: number, w: string) => `${n} ${n === 1 ? w : w.endsWith("y") ? w.slice(0, -1) + "ies" : w + "s"}`

export function answer(question: string): AiAnswer {
  const q = question.toLowerCase()

  if (/cover letter|resume|outreach/.test(q)) {
    return {
      text: "I can draft that with you. The application tool takes the role and your background, then writes a cover letter, resume bullets and an outreach note you can edit.",
      roles: [],
      filters: [],
      link: { to: "/application-tool", label: "Open the application tool" },
    }
  }

  if (/skill|in-demand|in demand|most hiring|which (teams|roles)/.test(q)) {
    const counts = DEPARTMENTS.filter((d) => d !== "Other").map((d) => [d, jobs.filter((j) => j.department === d).length] as const).sort((a, b) => b[1] - a[1])
    const [a, b, c] = counts
    return {
      text: `Across ${plural(jobs.length, "open role")}, marketplaces hire most for ${a[0].toLowerCase()} (${a[1]}), then ${b[0].toLowerCase()} (${b[1]}) and ${c[0].toLowerCase()} (${c[1]}).${topLevels()}`,
      roles: jobs.filter((j) => j.department === a[0]).slice(0, 4),
      filters: [a[0]],
      link: { to: `/jobs?role=${a[0]}`, label: `See ${a[0].toLowerCase()} roles` },
    }
  }

  const { roles, filters, depts } = interpret(question)

  if (/compan/.test(q)) {
    const ids = [...new Set(roles.map((r) => r.companyId))]
    const names = ids.slice(0, 5).map((id) => getCompany(id)?.name).filter(Boolean)
    return {
      text: ids.length
        ? `${plural(ids.length, "company")} ${ids.length === 1 ? "is" : "are"} hiring${depts.length ? ` for ${depts.join(" and ").toLowerCase()}` : ""} right now. The most active: ${names.join(", ")}.`
        : "No company in the feed matches that today.",
      roles: roles.slice(0, 5),
      filters,
      link: { to: "/companies", label: "Browse companies" },
    }
  }

  if (!filters.length) {
    return {
      text: `I could not tie that to a role type, level or location, so here are the newest roles. Try naming a team, such as product or engineering, and a place, such as remote.`,
      roles: jobs.slice(0, 5),
      filters: [],
      link: { to: "/jobs", label: "Browse every role" },
    }
  }

  const params = new URLSearchParams()
  if (depts.length === 1) params.set("role", depts[0])
  const work = WORK_STYLES.find((w) => filters.includes(w))
  if (work) params.set("where", work)
  const asked = describe(filters)

  if (roles.length) {
    return {
      text: `I found ${plural(roles.length, "role")} for ${asked}, at ${plural(new Set(roles.map((r) => r.companyId)).size, "company")}. The newest are below.`,
      roles: roles.slice(0, 5),
      filters,
      link: { to: `/jobs?${params}`, label: "Open these in Jobs" },
    }
  }

  // Nothing fits every condition: drop the narrowest one, say which, and show what remains.
  const { stage, level } = interpret(question)
  const looser = stage ? question.replace(/series [abc]|seed|early stage|late stage|growth stage|public/gi, "") : level ? question.replace(new RegExp(level, "i"), "") : null
  const relaxed = looser ? interpret(looser) : null
  if (relaxed && relaxed.roles.length) {
    const dropped = stage ? `the ${stage[0]} stage` : `the ${level?.toLowerCase()} level`
    return {
      text: `No open role fits ${asked} today. Without ${dropped}, ${plural(relaxed.roles.length, "role")} ${relaxed.roles.length === 1 ? "fits" : "fit"}. The newest are below.`,
      roles: relaxed.roles.slice(0, 5),
      filters: relaxed.filters,
      link: { to: `/jobs?${params}`, label: "Open these in Jobs" },
    }
  }
  return { text: `No open role fits ${asked} today. Try a wider location or another team.`, roles: [], filters, link: { to: "/jobs", label: "Browse every role" } }
}

/** "Remote", "Product", "Series A" reads as "remote product roles at Series A companies". */
function describe(filters: string[]) {
  const work = filters.find((f) => (WORK_STYLES as readonly string[]).includes(f))
  const level = filters.find((f) => (LEVELS as readonly string[]).includes(f))
  const stage = filters.find((f) => /Series|Seed|Public/.test(f))
  const team = filters.find((f) => f !== work && f !== level && f !== stage)
  const lead = [work?.toLowerCase(), level?.toLowerCase(), team?.toLowerCase()].filter(Boolean).join(" ")
  return `${lead || "open"} roles${stage ? ` at ${stage} companies` : ""}`
}

function topLevels() {
  const counts = LEVELS.map((l) => [l, jobs.filter((j) => j.level === l).length] as const).sort((a, b) => b[1] - a[1])
  const [a, b] = counts
  return ` By level, ${a[0].toLowerCase()} roles lead with ${a[1]}, then ${b[0].toLowerCase()} with ${b[1]}.`
}

export const SUGGESTIONS = [
  "Find me remote product roles at Series A marketplaces",
  "What marketplace companies are hiring engineers?",
  "Help me write a cover letter for a growth role",
  "What skills are most in-demand for marketplace roles?",
]

export const companyCount = companies.length
