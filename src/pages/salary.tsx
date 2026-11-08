import NumberFlow from "@number-flow/react"
import { useMemo, useState } from "react"
import { Link } from "react-router"

import { RefreshIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { OnboardingStepper } from "@/components/ui/ix-onboarding-stepper"
import { SingleChoice } from "@/components/site/choice"
import { CompanyLogo } from "@/components/site/company-logo"
import { Container, PageHeader } from "@/components/site/layout"
import { LEVELS, jobs } from "@/lib/data"

/** Market base salary medians in thousands of US dollars, mid level, US. A prototype estimate table. */
const ROLES: Record<string, { base: number; words: string[] }> = {
  "Backend Engineer": { base: 165, words: ["backend", "back end", "platform"] },
  "Frontend Engineer": { base: 155, words: ["frontend", "front end", "web engineer"] },
  "Full Stack Engineer": { base: 160, words: ["full stack", "fullstack", "full-stack"] },
  "Mobile Engineer": { base: 160, words: ["mobile", "ios", "android"] },
  "DevOps Engineer": { base: 158, words: ["devops", "infrastructure", "sre", "reliability"] },
  "Engineering Manager": { base: 205, words: ["engineering manager", "head of engineering"] },
  "Product Manager": { base: 170, words: ["product manager", "product lead"] },
  "Product Designer": { base: 145, words: ["designer", "design"] },
}
const LEVEL_X: Record<string, number> = { Entry: 0.72, Mid: 1, Senior: 1.22, Lead: 1.42, Executive: 1.75 }
const PLACES: Record<string, { label: string; x: number }> = {
  sf: { label: "San Francisco or New York", x: 1.15 },
  us: { label: "Elsewhere in the US", x: 1 },
  remote: { label: "Remote, US", x: 0.95 },
  eu: { label: "Europe", x: 0.62 },
}

export default function Salary() {
  const [role, setRole] = useState("")
  const [level, setLevel] = useState("")
  const [place, setPlace] = useState("")
  const [done, setDone] = useState(false)
  const [run, setRun] = useState(0)

  const result = useMemo(() => {
    if (!role || !level || !place) return null
    const median = Math.round((ROLES[role].base * LEVEL_X[level] * PLACES[place].x) / 5) * 5
    const hiring = jobs.filter((j) => ROLES[role].words.some((w) => j.title.toLowerCase().includes(w)))
    return { median, low: Math.round((median * 0.82) / 5) * 5, high: Math.round((median * 1.2) / 5) * 5, hiring }
  }, [role, level, place])

  const companiesHiring = result ? [...new Map(result.hiring.map((j) => [j.companyId, j])).values()].slice(0, 6) : []

  return (
    <Container className="flex max-w-3xl flex-col gap-8 pt-10">
      <PageHeader title="Marketplace salary estimator" text="See what marketplace startups pay for your role, by level and location." />
      <OnboardingStepper
        key={run}
        progressStyle="numbers"
        labelMode="current"
        progressLabel="Salary questions"
        backLabel="Back"
        nextLabel="Next question"
        finishLabel="See the estimate"
        complete={done}
        onComplete={() => setDone(true)}
        steps={[
          { id: "role", label: "Role", title: "What role are you exploring?", complete: !!role, content: <SingleChoice label="Role" choices={Object.keys(ROLES).map((r) => ({ value: r, label: r }))} value={role} onChange={setRole} /> },
          { id: "level", label: "Level", title: "At what level?", complete: !!level, content: <SingleChoice label="Level" choices={LEVELS.map((l) => ({ value: l, label: l }))} value={level} onChange={setLevel} columns={3} /> },
          { id: "place", label: "Location", title: "Where is the role based?", complete: !!place, content: <SingleChoice label="Location" choices={Object.entries(PLACES).map(([v, p]) => ({ value: v, label: p.label }))} value={place} onChange={setPlace} /> },
        ]}
        completion={
          result ? (
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-foreground">
                    {level} {role}
                  </h2>
                  <p className="text-sm text-muted-foreground">{PLACES[place].label}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => (setDone(false), setRole(""), setLevel(""), setPlace(""), setRun((r) => r + 1))}>
                  <RefreshIcon className="size-4" />
                  New estimate
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Median base salary</p>
                <p className="text-5xl font-semibold tabular-nums tracking-tight text-foreground">
                  <NumberFlow value={result.median} prefix="$" suffix="k" />
                </p>
                <div className="relative mt-3 h-2 rounded-full bg-muted">
                  <div className="absolute inset-y-0 left-[18%] right-[16%] rounded-full bg-primary/80" />
                  <div className="absolute -top-1 left-1/2 h-4 w-0.5 rounded-full bg-foreground" />
                </div>
                <div className="flex justify-between text-sm tabular-nums text-muted-foreground">
                  <span>${result.low}k</span>
                  <span>${result.high}k</span>
                </div>
                <Badge variant="gold" className="mt-1 w-fit">
                  Market estimate
                </Badge>
                <p className="text-xs text-muted-foreground">Few listings disclose pay, so this comes from role, level and location, not from the roles below.</p>
              </div>
              <Card className="flex flex-col gap-3 p-4">
                <h3 className="text-sm font-medium text-foreground">
                  {result.hiring.length} open {role.toLowerCase()} roles today
                </h3>
                {companiesHiring.length ? (
                  <ul className="flex flex-wrap gap-2">
                    {companiesHiring.map((j) => (
                      <li key={j.companyId}>
                        <Link to={`/jobs/${j.id}`} className="flex items-center gap-2 rounded-full bg-muted py-1 pl-1 pr-3 text-sm text-foreground transition-colors hover:bg-accent">
                          <CompanyLogo companyId={j.companyId} name={j.company} size="sm" className="!size-6 rounded-full" />
                          {j.company}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No company lists this role right now.</p>
                )}
              </Card>
            </div>
          ) : null
        }
      />
    </Container>
  )
}
