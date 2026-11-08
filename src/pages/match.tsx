import { useMemo, useState } from "react"
import { Link } from "react-router"

import { RefreshIcon, SparklesIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { OnboardingStepper } from "@/components/ui/ix-onboarding-stepper"
import { TagInput } from "@/components/ui/ix-tag-input"
import { Slider } from "@/components/ui/slider"
import { MultiChoice, SingleChoice } from "@/components/site/choice"
import { JobRow } from "@/components/site/job-row"
import { Container, PageHeader } from "@/components/site/layout"
import { DEPARTMENTS, LEVELS, STAGES, WORK_STYLES, getCompany, jobs } from "@/lib/data"

const ROLE_TEXT: Record<string, string> = {
  Engineering: "Build and scale marketplace infrastructure.",
  Product: "Shape the roadmap and ship what users need.",
  Design: "Craft clear, useful experiences.",
  Marketing: "Tell the story and grow the brand.",
  Growth: "Drive acquisition, retention and expansion.",
  Sales: "Close deals and build lasting relationships.",
  Operations: "Keep the marketplace running at scale.",
  Data: "Turn data into product and business decisions.",
  Finance: "Manage capital, forecasting and strategy.",
  People: "Hire, develop and support the team.",
  Other: "Roles outside these categories.",
}

export default function Match() {
  const [roles, setRoles] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [level, setLevel] = useState("")
  const [where, setWhere] = useState<string[]>([])
  const [type, setType] = useState("Full-time")
  const [stages, setStages] = useState<string[]>([])
  const [salary, setSalary] = useState(140)
  const [done, setDone] = useState(false)
  const [run, setRun] = useState(0)

  const matches = useMemo(() => {
    const scored = jobs
      .filter((j) => !roles.length || roles.includes(j.department))
      .map((j) => {
        let score = 0
        const why: string[] = []
        if (level && j.level === level) (score += 3), why.push(`${level} level`)
        if (where.length && where.includes(j.workStyle)) (score += 2), why.push(j.workStyle.toLowerCase())
        const st = getCompany(j.companyId)?.stage
        if (stages.length && st && stages.includes(st)) (score += 2), why.push(st)
        const hit = skills.find((s) => `${j.title} ${j.description}`.toLowerCase().includes(s.toLowerCase()))
        if (hit) (score += 2), why.push(`mentions ${hit}`)
        return { j, score, why }
      })
      .filter((x) => x.score > 0 || (!level && !where.length && !stages.length && !skills.length))
      .sort((a, b) => b.score - a.score)
    return scored.slice(0, 8)
  }, [roles, level, where, stages, skills])

  const reset = () => {
    setRoles([]), setSkills([]), setLevel(""), setWhere([]), setStages([]), setDone(false), setRun((r) => r + 1)
  }

  const steps = [
    { id: "role", label: "Role", title: "What role are you seeking?", description: "Select one or more.", complete: roles.length > 0, content: <MultiChoice choices={DEPARTMENTS.map((d) => ({ value: d, label: d, text: ROLE_TEXT[d] }))} value={roles} onChange={setRoles} /> },
    {
      id: "skills",
      label: "Skills",
      title: "Which skills should the role use?",
      description: "Add up to six. We look for them in each description.",
      content: <TagInput value={skills} onChange={setSkills} max={6} label="Skills" placeholder="SQL, Figma, pricing" hint="Press Enter or a comma to add a skill." />,
    },
    { id: "level", label: "Experience", title: "How much experience do you have?", complete: !!level, content: <SingleChoice label="Experience" choices={LEVELS.map((l) => ({ value: l, label: l }))} value={level} onChange={setLevel} columns={3} /> },
    { id: "where", label: "Location", title: "Where do you want to work?", description: "Select one or more.", complete: where.length > 0, content: <MultiChoice choices={WORK_STYLES.map((w) => ({ value: w, label: w }))} value={where} onChange={setWhere} columns={3} /> },
    { id: "type", label: "Type", title: "What kind of contract?", content: <SingleChoice label="Contract type" choices={[{ value: "Full-time", label: "Full-time" }, { value: "Contract", label: "Contract" }, { value: "Either", label: "Either" }]} value={type} onChange={setType} columns={3} /> },
    { id: "stage", label: "Stage", title: "Which company stage suits you?", description: "Leave empty to see every stage.", content: <MultiChoice choices={STAGES.map((s) => ({ value: s, label: s }))} value={stages} onChange={setStages} columns={3} /> },
    {
      id: "salary",
      label: "Salary",
      title: "What base salary do you want?",
      content: (
        <div className="flex flex-col gap-4 pt-2">
          <p className="text-3xl font-semibold tabular-nums text-foreground">${salary}k</p>
          <Slider value={[salary]} onValueChange={(v) => setSalary(Array.isArray(v) ? v[0] : v)} min={60} max={300} step={5} aria-label="Minimum base salary in thousands of dollars" />
          <p className="text-sm text-muted-foreground">Few listings publish pay, so salary does not filter the matches.</p>
        </div>
      ),
    },
  ]

  return (
    <Container className="flex max-w-3xl flex-col gap-8 pt-10">
      <PageHeader title="AI Job Match" text="Answer seven quick questions. We match you to open marketplace roles." />
      <OnboardingStepper
        key={run}
        steps={steps}
        progressStyle="segments"
        labelMode="current"
        progressLabel="Match questions"
        backLabel="Back"
        nextLabel="Next question"
        finishLabel="See my matches"
        onComplete={() => setDone(true)}
        complete={done}
        completion={
          <div className="flex flex-col gap-5 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <SparklesIcon className="size-5" />
                  {matches.length ? `Your ${matches.length} best matches` : "No close matches today"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Ranked by how many of your answers each role meets.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RefreshIcon className="size-4" />
                Start over
              </Button>
            </div>
            {matches.length ? (
              <ul className="-mx-4 flex flex-col gap-0.5">
                {matches.map(({ j, why }, i) => (
                  <li key={j.id} className="list-none">
                    <ul>
                      <JobRow job={j} index={i} />
                    </ul>
                    {why.length ? <p className="-mt-2 mb-2 pl-[4.5rem] text-xs text-muted-foreground">Matches {why.join(", ")}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="Nothing fits every answer"
                description="Widen the location or stage and try again."
                action={
                  <Button variant="secondary" asChild>
                    <Link to="/jobs">Browse all roles</Link>
                  </Button>
                }
              />
            )}
          </div>
        }
      />
    </Container>
  )
}
