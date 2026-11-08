import { Link } from "react-router"

import { MapPinIcon } from "@/components/icons"
import { CompanyLogo } from "@/components/site/company-logo"
import { CARD_HOVER } from "@/components/site/company-card"
import { SaveButton } from "@/components/site/save-button"
import { Card } from "@/components/ui/card"
import { type Job, companyHue, getCompany, isNew, oklchOf, postedLabel, shortLocation } from "@/lib/data"
import { cn } from "@/lib/utils"

/**
 * A role on a browse shelf. The band at the top wears the company's own colour, so a
 * shelf reads like a row of storefronts rather than a list of grey lines.
 */
export function JobCard({ job, className }: { job: Job; className?: string }) {
  const hue = companyHue(getCompany(job.companyId) ?? { name: job.company, tint: null })
  return (
    <Card className={cn("group relative flex h-full flex-col overflow-hidden p-0", CARD_HOVER, className)}>
      <div
        className="relative flex h-24 items-end px-5 pb-0"
        style={{ background: `linear-gradient(150deg, ${oklchOf(hue, 0.42)}, ${oklchOf(hue, 0.14)})` }}
      >
        <CompanyLogo companyId={job.companyId} name={job.company} size="lg" className="translate-y-1/2 ring-4 ring-card" />
        <SaveButton jobId={job.id} title={job.title} className="absolute right-1.5 top-1.5 z-10 bg-card/70 backdrop-blur-sm hover:bg-card" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-5 pb-5 pt-11">
        <h3 className="line-clamp-2 text-[0.9375rem] font-semibold leading-snug text-foreground">
          <Link to={`/jobs/${job.id}`} className="outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring">
            {job.title}
          </Link>
        </h3>
        <p className="truncate text-sm font-medium text-foreground/75">{job.company}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1">
            <MapPinIcon className="size-4 shrink-0" />
            <span className="truncate">{shortLocation(job.location)}</span>
          </span>
          <span className={cn("shrink-0 tabular-nums", isNew(job.posted) && "font-medium text-[oklch(0.5_0.13_152)]")}>{postedLabel(job.posted)}</span>
        </div>
      </div>
    </Card>
  )
}
