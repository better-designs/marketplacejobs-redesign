import { AnimatePresence } from "motion/react"
import { Link } from "react-router"

import { BookmarkIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { JobRow } from "@/components/site/job-row"
import { Container, PageHeader } from "@/components/site/layout"
import { getJob } from "@/lib/data"
import { useSaved } from "@/lib/saved"

export default function Saved() {
  const saved = useSaved()
  const list = saved.map(getJob).filter((j) => !!j)
  return (
    <Container className="flex max-w-4xl flex-col gap-8 pt-10">
      <PageHeader title="Saved roles" text={list.length ? "Kept on this device. Remove a role with its bookmark." : undefined} />
      {list.length ? (
        <Card className="p-2">
          <ul className="flex flex-col gap-0.5">
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((j, i) => (
                <JobRow key={j.id} job={j} index={i} />
              ))}
            </AnimatePresence>
          </ul>
        </Card>
      ) : (
        <EmptyState
          icon={<BookmarkIcon className="size-5" />}
          title="No saved roles yet"
          description="Press the bookmark on any role to keep it here."
          action={
            <Button asChild>
              <Link to="/jobs">Browse roles</Link>
            </Button>
          }
          className="bg-card py-16"
        />
      )}
    </Container>
  )
}
