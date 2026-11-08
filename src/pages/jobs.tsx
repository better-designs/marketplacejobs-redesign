import { Link, useParams } from "react-router"

import { ArrowLeftIcon, PageIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { JobDetail } from "@/components/site/job-detail"
import { JobRow } from "@/components/site/job-row"
import { JobsBrowser } from "@/components/site/jobs-browser"
import { Container, PageHeader } from "@/components/site/layout"
import { DEPARTMENTS, WORK_STYLES, getJob, jobs, slugify } from "@/lib/data"

export function Jobs() {
  return (
    <Container className="flex flex-col gap-8 pt-10">
      <PageHeader title="All marketplace jobs" text="Every open role at marketplace startups, summarized with AI." />
      <JobsBrowser source={jobs} />
    </Container>
  )
}

/** /roles/:role, a department landing page. */
export function RoleJobs() {
  const { role = "" } = useParams()
  const department = DEPARTMENTS.find((d) => slugify(d) === role)
  const title = department ? `${department} jobs at marketplace startups` : "Marketplace jobs"
  return (
    <Container className="flex flex-col gap-8 pt-10">
      <PageHeader title={title} text="Active roles, updated from each company's careers page." />
      <JobsBrowser source={jobs} preset={{ department: department ?? "all" }} />
    </Container>
  )
}

/** /locations/:slug, remote, hybrid, onsite, or a city. */
export function LocationJobs() {
  const { slug = "" } = useParams()
  const style = WORK_STYLES.find((w) => slugify(w) === slug)
  const city = slug.replace(/-/g, " ")
  const source = style ? jobs : jobs.filter((j) => j.location.toLowerCase().includes(city))
  const place = style ?? city.replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <Container className="flex flex-col gap-8 pt-10">
      <PageHeader title={`${place} marketplace jobs`} text={style ? `Roles marked ${style.toLowerCase()} by the hiring company.` : `Roles based in ${place}.`} />
      <JobsBrowser source={source} preset={{ workStyle: style ?? "all" }} />
    </Container>
  )
}

export function JobPage() {
  const { id = "" } = useParams()
  const job = getJob(id)
  if (!job) {
    return (
      <Container className="pt-16">
        <EmptyState
          icon={<PageIcon className="size-5" />}
          title="This role is no longer listed"
          description="The company closed it or moved it to a new link."
          action={
            <Button asChild>
              <Link to="/jobs">Browse open roles</Link>
            </Button>
          }
          className="bg-card py-16"
        />
      </Container>
    )
  }
  const similar = jobs.filter((j) => j.id !== job.id && j.department === job.department).slice(0, 5)
  return (
    <Container className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex flex-col gap-6">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-3 text-muted-foreground">
          <Link to="/jobs">
            <ArrowLeftIcon className="size-4" />
            All jobs
          </Link>
        </Button>
        <Card className="p-5">
          <JobDetail job={job} headingLevel="h1" />
        </Card>
      </div>
      <aside className="flex flex-col gap-3 lg:pt-14" aria-labelledby="similar">
        <h2 id="similar" className="px-4 text-sm font-medium text-foreground">
          Similar {job.department.toLowerCase()} roles
        </h2>
        <ul className="flex flex-col gap-0.5">
          {similar.map((j, i) => (
            <JobRow key={j.id} job={j} index={i} />
          ))}
        </ul>
      </aside>
    </Container>
  )
}
