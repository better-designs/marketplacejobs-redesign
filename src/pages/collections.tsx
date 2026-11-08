import { Link, useParams } from "react-router"

import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon, FolderFilledIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { CARD_HOVER, CompanyCard } from "@/components/site/company-card"
import { CompanyLogo } from "@/components/site/company-logo"
import { JobRow } from "@/components/site/job-row"
import { Container, PageHeader } from "@/components/site/layout"
import { type Collection, collections, getCompany, jobs } from "@/lib/data"

const rolesIn = (c: Collection) => jobs.filter((j) => c.companyIds.includes(j.companyId))

export function Collections() {
  return (
    <Container className="flex flex-col gap-8 pt-10">
      <PageHeader title="Job collections" text="Curated lists of marketplace companies and their open roles, grouped by fund." />
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((c) => {
          const n = rolesIn(c).length
          return (
            <li key={c.id}>
              <Card className={`group relative flex h-full flex-col gap-5 p-6 ${CARD_HOVER}`}>
                <div className="flex -space-x-2">
                  {c.companyIds.slice(0, 5).map((id) => {
                    const co = getCompany(id)
                    return co ? <CompanyLogo key={id} companyId={id} name={co.name} size="sm" className="ring-2 ring-card" /> : null
                  })}
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <h2 className="text-base font-semibold text-foreground">
                    <Link to={`/collection/${c.slug}`} className="outline-none after:absolute after:inset-0 after:rounded-[0.625rem] focus-visible:after:ring-2 focus-visible:after:ring-ring">
                      {c.name}
                    </Link>
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.description.replace(/ — /g, ", ")}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="tabular-nums text-muted-foreground">
                    <span className="font-medium text-foreground">{c.companyIds.length}</span> companies, <span className="font-medium text-foreground">{n}</span> open roles
                  </span>
                  <ArrowRightIcon className="size-4 text-muted-foreground transition-[transform,color] duration-base group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
    </Container>
  )
}

export function CollectionPage() {
  const { slug = "" } = useParams()
  const c = collections.find((x) => x.slug === slug)
  if (!c) {
    return (
      <Container className="pt-16">
        <EmptyState icon={<FolderFilledIcon className="size-5" />} title="This collection does not exist" action={<Button asChild><Link to="/collections">See all collections</Link></Button>} className="bg-card py-16" />
      </Container>
    )
  }
  const roles = rolesIn(c)
  const cos = c.companyIds.map(getCompany).filter((x) => !!x)
  return (
    <Container className="flex flex-col gap-10 pt-8">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" asChild className="-ml-3 w-fit text-muted-foreground">
          <Link to="/collections">
            <ArrowLeftIcon className="size-4" />
            All collections
          </Link>
        </Button>
        <PageHeader title={c.name} text={c.description.replace(/ — /g, ", ")}>
          {c.website ? (
            <Button variant="secondary" asChild>
              <a href={c.website} target="_blank" rel="noreferrer">
                Fund website
                <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
              </a>
            </Button>
          ) : null}
        </PageHeader>
      </div>
      <section aria-labelledby="roles" className="flex flex-col gap-3">
        <h2 id="roles" className="text-xl font-semibold text-foreground">
          {roles.length} open roles
        </h2>
        {roles.length ? (
          <Card className="p-2">
            <ul className="flex flex-col gap-0.5">
              {roles.slice(0, 30).map((j, i) => (
                <JobRow key={j.id} job={j} index={i} />
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState icon={<FolderFilledIcon className="size-5" />} title="No open roles in this collection today" description="Its companies are listed below." className="bg-card py-12" />
        )}
      </section>
      <section aria-labelledby="cos" className="flex flex-col gap-3">
        <h2 id="cos" className="text-xl font-semibold text-foreground">
          {cos.length} companies
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cos.map((co) => (
            <li key={co.id}>
              <CompanyCard company={co} />
            </li>
          ))}
        </ul>
      </section>
    </Container>
  )
}
