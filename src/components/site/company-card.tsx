import { Link } from "react-router"

import { ArrowRightIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CompanyLogo } from "@/components/site/company-logo"
import { type Company, companyHue, oklchOf, roleCount } from "@/lib/data"
import { cn } from "@/lib/utils"

export const CARD_HOVER = "transition-[box-shadow] duration-base ease-out hover:shadow-[var(--tb-shadow-pop)]"

/** A company the person can open. The whole card is the link; hover deepens its shadow, never moves it. */
export function CompanyCard({ company, className }: { company: Company; className?: string }) {
  const n = roleCount(company.id)
  const hue = companyHue(company)
  return (
    <Card className={cn("group relative flex h-full flex-col gap-4 overflow-hidden p-5 pt-0", CARD_HOVER, className)}>
      <div aria-hidden className="-mx-5 h-16" style={{ background: `linear-gradient(150deg, ${oklchOf(hue, 0.4)}, ${oklchOf(hue, 0.12)})` }} />
      <div className="-mt-12 flex items-end justify-between gap-3">
        <CompanyLogo companyId={company.id} name={company.name} size="lg" className="ring-4 ring-card" />
        {company.stage ? <Badge variant="outline" className="bg-card">{company.stage}</Badge> : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="text-base font-semibold text-foreground">
          <Link to={`/companies/${company.slug}`} className="outline-none after:absolute after:inset-0 after:rounded-[0.625rem] focus-visible:after:ring-2 focus-visible:after:ring-ring">
            {company.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{company.description}</p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium tabular-nums text-foreground">
          {n ? `${n} open ${n === 1 ? "role" : "roles"}` : "No open roles"}
        </span>
        <ArrowRightIcon className="size-4 text-muted-foreground transition-[transform,color] duration-base ease-out group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Card>
  )
}
