import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { ArrowUpIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThinkingIndicator } from "@/components/ui/thinking-indicator"
import { AiAnswerBlock } from "@/components/site/ai-answer"
import { Container, PageHeader } from "@/components/site/layout"
import { type AiAnswer, SUGGESTIONS, answer } from "@/lib/ai"

type Turn = { id: number; question: string; reply: AiAnswer | null }

export default function Assistant() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState("")
  const endRef = useRef<HTMLDivElement>(null)
  const busy = turns.some((t) => !t.reply)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [turns])

  const ask = (question: string) => {
    const q = question.trim()
    if (!q || busy) return
    const id = Date.now()
    setTurns((t) => [...t, { id, question: q, reply: null }])
    setDraft("")
    setTimeout(() => setTurns((t) => t.map((x) => (x.id === id ? { ...x, reply: answer(q) } : x))), 900)
  }

  return (
    <Container className="flex max-w-3xl flex-col gap-8 pt-10">
      <PageHeader title="AI Copilot" text="Search companies and roles, get AI summaries and write cover letters." />

      <Card className="flex min-h-[28rem] flex-col">
        <div className="flex flex-1 flex-col gap-8 p-5 sm:p-7" aria-live="polite">
          {turns.length === 0 ? (
            <div className="flex flex-1 flex-col justify-end gap-3">
              <p className="text-sm font-medium text-foreground">Try one of these</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s, i) => (
                  <motion.li key={s} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.3 }}>
                    <button onClick={() => ask(s)} className="h-full w-full rounded-[0.625rem] bg-muted px-4 py-3 text-left text-sm text-foreground outline-none transition-colors hover:bg-accent hover:shadow-[0_0_0_0.0625rem_oklch(0_0_0/0.08)] focus-visible:ring-2 focus-visible:ring-ring">
                      {s}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {turns.map((t) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4">
                  <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[0.9375rem] text-primary-foreground">{t.question}</p>
                  {t.reply ? <AiAnswerBlock a={t.reply} /> : <ThinkingIndicator words={["Reading the feed", "Matching roles", "Writing"]} intervalMs={700} />}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(draft)
          }}
          className="sticky bottom-0 flex items-end gap-2 rounded-b-[0.625rem] border-t border-border bg-card p-3"
        >
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                ask(draft)
              }
            }}
            rows={1}
            placeholder="Ask about roles, companies or pay"
            aria-label="Ask the AI Copilot"
            className="max-h-40 min-h-11 resize-none border-0 bg-transparent shadow-none focus-visible:shadow-none"
          />
          <Button type="submit" size="icon" disabled={!draft.trim() || busy} aria-label="Send question">
            <ArrowUpIcon className="size-[1.125rem]" />
          </Button>
        </form>
      </Card>
      <p className="-mt-4 text-xs text-muted-foreground">Answers come from the open roles listed here. Check details on the company's page before you apply.</p>
    </Container>
  )
}
