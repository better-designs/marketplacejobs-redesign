import { motion } from "motion/react"
import { useState } from "react"
import { useSearchParams } from "react-router"

import { MagnifierCheckIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AiAnswerBlock } from "@/components/site/ai-answer"
import { Container } from "@/components/site/layout"
import { answer } from "@/lib/ai"

const PROMPTS = ["Remote product roles at Series A marketplaces", "Senior growth roles", "Operations roles at growth stage marketplaces"]

/** /ai: ask for roles in plain words. */
export default function AskAi() {
  const [params, setParams] = useSearchParams()
  const asked = params.get("q") ?? ""
  const [draft, setDraft] = useState(asked)
  const run = (q: string) => {
    setDraft(q)
    setParams(q ? { q } : {}, { replace: true })
  }
  const a = asked ? answer(asked) : null

  return (
    <Container className="flex max-w-3xl flex-col gap-8 pt-14">
      <div className="flex flex-col gap-3">
        <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">Find marketplace jobs with AI</h1>
        <p className="text-[0.9375rem] text-muted-foreground">Describe the role you want in plain words. The answer cites only roles open today.</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(draft.trim())
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <MagnifierCheckIcon className="pointer-events-none absolute left-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-muted-foreground" />
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Remote product roles at Series A marketplaces" aria-label="Describe the role you want" className="h-12 rounded-full bg-card pl-10 text-[0.9375rem] shadow-[var(--tb-shadow-card)]" />
        </div>
        <Button type="submit" size="lg" className="h-12 rounded-full px-6" disabled={!draft.trim()}>
          Ask AI
        </Button>
      </form>
      {!a ? (
        <div className="flex flex-wrap gap-2">
          {PROMPTS.map((p) => (
            <Button key={p} variant="outline" size="sm" className="rounded-full" onClick={() => run(p)}>
              {p}
            </Button>
          ))}
        </div>
      ) : (
        <motion.div key={asked} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="p-6">
            <AiAnswerBlock a={a} />
          </Card>
        </motion.div>
      )}
    </Container>
  )
}
