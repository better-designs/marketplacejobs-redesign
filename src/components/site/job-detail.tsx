import { Link } from "react-router"
import { toast } from "sonner"

import {
  SparkleIcon,
  PageIcon,
  OfficeIcon,
  CopyIcon,
  ExternalLinkIcon,
  MapPinIcon,
  DotsIcon,
  SearchIcon,
  StopwatchIcon,
} from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShowMore } from "@/components/ui/ix-show-more"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyLogo } from "@/components/site/company-logo"
import { SaveButton } from "@/components/site/save-button"
import { type Job, companyHue, descriptionBlocks, oklchOf, placeName, getCompany, postedLabel, roleCount, slugify } from "@/lib/data"

export function JobDetail({ job, headingLevel = "h2" }: { job: Job; headingLevel?: "h1" | "h2" }) {
  const company = getCompany(job.companyId)
  const Heading = headingLevel
  const blocks = descriptionBlocks(job.description)
  const companyHref = company ? `/companies/${company.slug}` : "/companies"

  const copyLink = async () => {
    await navigator.clipboard?.writeText(`${location.origin}/jobs/${job.id}`).catch(() => {})
    toast("Link copied", { description: job.title })
  }

  const hue = companyHue(company ?? { name: job.company, tint: null })
  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-5">
        <div aria-hidden className="-mx-5 -mt-5 h-20 rounded-t-[inherit]" style={{ background: `linear-gradient(150deg, ${oklchOf(hue, 0.42)}, ${oklchOf(hue, 0.12)})` }} />
        <div className="-mt-14 flex flex-col gap-3">
          <CompanyLogo companyId={job.companyId} name={job.company} size="lg" className="ring-4 ring-card" />
          <div className="flex min-w-0 flex-col gap-1">
            <Heading className="text-2xl font-semibold leading-tight text-foreground">{job.title}</Heading>
            <Link to={companyHref} className="-my-2.5 inline-flex min-h-11 w-fit items-center text-[0.9375rem] font-medium text-muted-foreground transition-colors hover:text-foreground">
              {job.company}
            </Link>
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <MapPinIcon className="size-4" />
            {placeName(job.location)}
          </li>
          <li className="flex items-center gap-1.5">
            <PageIcon className="size-4" />
            {job.workStyle}, {job.type.toLowerCase()}
          </li>
          <li className="flex items-center gap-1.5">
            <OfficeIcon className="size-4" />
            {job.level} in {job.department}
          </li>
          <li className="flex items-center gap-1.5">
            <StopwatchIcon className="size-4" />
            Posted {postedLabel(job.posted).toLowerCase()}
          </li>
        </ul>

        <div className="flex items-center gap-2">
          {job.applyUrl ? (
            <Button size="lg" asChild className="h-11 min-w-32">
              <a href={job.applyUrl} target="_blank" rel="noreferrer">
                Apply
                <ExternalLinkIcon className="size-4" />
              </a>
            </Button>
          ) : null}
          <SaveButton jobId={job.id} title={job.title} withLabel />
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="More actions" className="size-11" />}>
              <DotsIcon className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              <DropdownMenuItem onClick={copyLink}>
                <CopyIcon className="size-4" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to={companyHref} />}>
                <OfficeIcon className="size-4" />
                About {job.company}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link to={`/roles/${slugify(job.department)}`} />}>
                <SearchIcon className="size-4" />
                More {job.department.toLowerCase()} roles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {job.summary ? (
      <section aria-labelledby={`sum-${job.id}`} className="rounded-xl bg-[var(--ai-label)] p-4">
        <h3 id={`sum-${job.id}`} className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <SparkleIcon className="size-3.5" />
          AI summary
        </h3>
        <p className="text-[0.9375rem] leading-relaxed text-foreground">{job.summary}</p>
      </section>
      ) : null}

      <Tabs defaultValue="role">
        <TabsList>
          <TabsTrigger value="role">The role</TabsTrigger>
          <TabsTrigger value="company">The company</TabsTrigger>
        </TabsList>
        <TabsContent value="role" className="pt-4">
          {blocks.length ? (
            <ShowMore lines={14} maxHeight={6000} label="Role description" moreLabel="Read the full description" lessLabel="Show less" className="!text-[0.9375rem]">
              <div className="flex flex-col gap-3 text-foreground/90">
                {blocks.map((b, i) =>
                  b.kind === "h" ? (
                    <h4 key={i} className="pt-2 text-[0.9375rem] font-semibold text-foreground">
                      {b.text}
                    </h4>
                  ) : b.kind === "li" ? (
                    <p key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:size-1 before:rounded-full before:bg-muted-foreground/60">
                      {b.text}
                    </p>
                  ) : (
                    <p key={i}>{b.text}</p>
                  ),
                )}
              </div>
            </ShowMore>
          ) : (
            <p className="text-sm text-muted-foreground">The company has not published a description. Apply to read it on their careers page.</p>
          )}
        </TabsContent>
        <TabsContent value="company" className="flex flex-col gap-4 pt-4">
          <p className="text-[0.9375rem] leading-relaxed text-foreground/90">{company?.description || `${job.company} is hiring on Marketplace Jobs.`}</p>
          <div className="flex flex-wrap gap-2">
            {company?.stage ? <Badge variant="outline">{company.stage}</Badge> : null}
            {company?.type ? <Badge variant="outline">{company.type} marketplace</Badge> : null}
            <Badge variant="outline">{roleCount(job.companyId)} open roles</Badge>
          </div>
          <Separator />
          <Button variant="outline" asChild className="w-fit">
            <Link to={companyHref}>See all roles at {job.company}</Link>
          </Button>
        </TabsContent>
      </Tabs>
    </article>
  )
}
