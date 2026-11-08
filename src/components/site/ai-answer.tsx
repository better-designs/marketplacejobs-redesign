import { motion } from "motion/react"
import { Link } from "react-router"

import { SparkleIcon, ArrowRightIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StreamingText } from "@/components/ui/ix-streaming-text"
import { JobRow } from "@/components/site/job-row"
import type { AiAnswer } from "@/lib/ai"

/** One AI answer: a visible AI marker, the streamed text, the filters it read, and real roles. */
export function AiAnswerBlock({ a, stream = true }: { a: AiAnswer; stream?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <SparkleIcon className="size-3.5" />
        AI answer from the live feed
      </p>
      {stream ? <StreamingText text={a.text} tokensPerSecond={60} showSkip={false} className="!text-[0.9375rem] !leading-relaxed" /> : <p className="text-[0.9375rem] leading-relaxed">{a.text}</p>}
      {a.filters.length ? (
        <div className="flex flex-wrap gap-1.5" aria-label="What I searched for">
          {a.filters.map((f) => (
            <Badge key={f} variant="outline" className="bg-card">
              {f}
            </Badge>
          ))}
        </div>
      ) : null}
      {a.roles.length ? (
        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="-mx-2 flex flex-col gap-0.5">
          {a.roles.map((j, i) => (
            <JobRow key={j.id} job={j} index={i} />
          ))}
        </motion.ul>
      ) : null}
      {a.link ? (
        <Button variant="secondary" size="sm" asChild className="w-fit">
          <Link to={a.link.to}>
            {a.link.label}
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  )
}
