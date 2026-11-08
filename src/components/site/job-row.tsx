import { motion } from "motion/react"
import { Link } from "react-router"

import { MapPinIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { CompanyLogo } from "@/components/site/company-logo"
import { SaveButton } from "@/components/site/save-button"
import { type Job, isNew, postedLabel, shortLocation } from "@/lib/data"
import { cn } from "@/lib/utils"

type Props = {
  job: Job
  selected?: boolean
  /** In the split view a row selects instead of navigating. */
  onSelect?: (id: string) => void
  index?: number
  /** Off on a company page, where every row is the same company. */
  showCompany?: boolean
}

/**
 * One role. The title owns the row; company and place sit under it. The tags rest as a
 * muted overlapping pile and spread to full contrast on a fine pointer's hover.
 */
export function JobRow({ job, selected, onSelect, index = 0, showCompany = true }: Props) {
  const content = (
    <>
      {selected ? (
        <motion.span layoutId="row-selected" className="absolute inset-0 rounded-[0.625rem] bg-primary/[0.085] shadow-[inset_0_0_0_0.0625rem_oklch(0.1408_0.0044_285.82/0.06)]" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
      ) : null}
      {showCompany ? <CompanyLogo companyId={job.companyId} name={job.company} className="relative" /> : null}
      <span className="relative flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-start gap-2">
          <span className="line-clamp-2 min-w-0 text-[0.9375rem] font-medium leading-snug text-foreground">{job.title}</span>
        </span>
        <span className="flex min-w-0 items-center gap-3 text-sm text-muted-foreground">
          {showCompany ? <span className="shrink-0 font-medium text-foreground/80">{job.company}</span> : null}
          <span className="flex min-w-0 items-center gap-1">
            <MapPinIcon className="size-4 shrink-0" />
            <span className="truncate">{shortLocation(job.location)}</span>
          </span>
        </span>
        <span className="mt-1 hidden items-center sm:flex" aria-label={`${job.workStyle}, ${job.level}, ${job.department}`}>
          <Badge variant="outline" className="relative z-[3] bg-card text-muted-foreground transition-colors duration-base ease-out group-hover:text-foreground">
            {job.workStyle}
          </Badge>
          {[job.level, job.department].map((t, i) => (
            <Badge
              key={t}
              aria-hidden
              variant="outline"
              style={{ zIndex: 2 - i }}
              className="relative -ml-2 max-w-3 justify-start overflow-hidden bg-card text-transparent transition-[max-width,margin,color] duration-slow ease-out group-hover:ml-1.5 group-hover:max-w-48 group-hover:text-foreground"
            >
              {t}
            </Badge>
          ))}
        </span>
      </span>
      <span className="relative flex shrink-0 flex-col items-end justify-between gap-2 self-stretch">
        <span className={cn("text-xs tabular-nums", isNew(job.posted) ? "font-medium text-[oklch(0.483_0.101_165.6)]" : "text-muted-foreground")}>{postedLabel(job.posted)}</span>
        <SaveButton jobId={job.id} title={job.title} />
      </span>
    </>
  )

  const cls = cn(
    "group relative flex w-full items-start gap-4 rounded-[0.625rem] px-4 py-4 text-left outline-none transition-colors duration-fast",
    "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
  )

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.165, 0.84, 0.44, 1], delay: Math.min(index, 10) * 0.025 }}
      className="list-none"
    >
      {onSelect ? (
        <div role="button" tabIndex={0} aria-pressed={selected} onClick={() => onSelect(job.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(job.id))} className={cls}>
          {content}
        </div>
      ) : (
        <Link to={`/jobs/${job.id}`} className={cls}>
          {content}
        </Link>
      )}
    </motion.li>
  )
}
