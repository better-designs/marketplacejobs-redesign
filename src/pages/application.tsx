import { useState } from "react"
import { useSearchParams } from "react-router"
import { toast } from "sonner"

import { SparkleIcon, CopyIcon, WandSparkleIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { StreamingText } from "@/components/ui/ix-streaming-text"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ThinkingIndicator } from "@/components/ui/thinking-indicator"
import { Container, PageHeader } from "@/components/site/layout"
import { getJob } from "@/lib/data"

type Draft = { resume: string; letter: string; outreach: string }

function firstSentences(text: string, n: number) {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, n).join(" ")
}

function draft(title: string, company: string, jd: string, me: string): Draft {
  const focus = firstSentences(jd.replace(/[#*]/g, ""), 1) || `the ${title} role`
  const proof = me.split(/\n|(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean)
  const bullets = (proof.length ? proof : ["Describe one result you are proud of, with the number behind it."]).slice(0, 4)
  return {
    resume: bullets.map((b) => `- ${b.replace(/^[-*]\s*/, "")}`).join("\n"),
    letter: `Dear ${company} hiring team,\n\nI am applying for the ${title} role. ${focus}\n\n${bullets[0]}${bullets[1] ? ` ${bullets[1]}` : ""}\n\nThat work maps to what you need: a marketplace grows when both sides keep finding value, and I have done that before. I would like to show you how in a 30 minute call.\n\nThank you for reading.`,
    outreach: `Hi, I am applying for the ${title} role at ${company}. ${bullets[0]} Would you have 15 minutes this week to tell me what the team needs most?`,
  }
}

export default function Application() {
  const [params] = useSearchParams()
  const job = getJob(params.get("job") ?? "")
  const [title, setTitle] = useState(job?.title ?? "")
  const [company, setCompany] = useState(job?.company ?? "")
  const [jd, setJd] = useState(job?.description.slice(0, 1200) ?? "")
  const [me, setMe] = useState("")
  const [state, setState] = useState<"idle" | "busy" | "done">("idle")
  const [out, setOut] = useState<Draft | null>(null)
  const [error, setError] = useState("")

  const generate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !company || !me.trim()) {
      setError("Add the role title, the company and your background.")
      return
    }
    setError("")
    setState("busy")
    setTimeout(() => {
      setOut(draft(title, company, jd, me))
      setState("done")
    }, 1100)
  }

  const copy = async (text: string, what: string) => {
    await navigator.clipboard?.writeText(text).catch(() => {})
    toast(`${what} copied`)
  }

  return (
    <Container className="flex flex-col gap-8 pt-10">
      <PageHeader title="AI application tool" text="Paste a role and your background to draft a cover letter, resume bullets and an outreach note." />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <form onSubmit={generate} className="flex flex-col gap-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Role title" htmlFor="title" required>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Product Manager" />
              </Field>
              <Field label="Company" htmlFor="company" required>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Wander" />
              </Field>
            </div>
            <Field label="Job description" htmlFor="jd" optional>
              <Textarea id="jd" value={jd} onChange={(e) => setJd(e.target.value)} rows={6} placeholder="Paste the description from the listing" />
            </Field>
            <Field label="Your background" htmlFor="me" required description="Include measurable outcomes: the metrics you moved and the numbers behind them." error={error || undefined}>
              <Textarea id="me" value={me} onChange={(e) => setMe(e.target.value)} rows={6} placeholder="Grew supply in three new cities from 0 to 1,200 hosts in nine months." />
            </Field>
            <Button type="submit" size="lg" disabled={state === "busy"} className="w-fit">
              <WandSparkleIcon className="size-4" />
              {state === "done" ? "Write again" : "Write my application"}
            </Button>
          </form>
        </Card>

        <Card className="min-h-[28rem] p-6 lg:sticky lg:top-20">
          {state === "idle" ? (
            <EmptyState icon={<WandSparkleIcon className="size-5" />} title="Your drafts appear here" description="Fill in the form to start." className="h-full min-h-[24rem] border-none bg-transparent" />
          ) : state === "busy" ? (
            <ThinkingIndicator words={["Reading the role", "Matching your results", "Writing"]} intervalMs={500} />
          ) : out ? (
            <Tabs defaultValue="letter" className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <TabsList>
                  <TabsTrigger value="letter">Cover letter</TabsTrigger>
                  <TabsTrigger value="resume">Resume</TabsTrigger>
                  <TabsTrigger value="outreach">Outreach</TabsTrigger>
                </TabsList>
                <p className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                  <SparkleIcon className="size-3.5" />
                  AI draft, edit before you send
                </p>
              </div>
              {(
                [
                  ["letter", "Cover letter", out.letter],
                  ["resume", "Resume bullets", out.resume],
                  ["outreach", "Outreach note", out.outreach],
                ] as const
              ).map(([k, label, text]) => (
                <TabsContent key={k} value={k} className="flex flex-col gap-4">
                  <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-[0.9375rem] leading-relaxed">
                    <StreamingText text={text} tokensPerSecond={90} showSkip={false} className="!text-[0.9375rem]" />
                  </div>
                  <Button variant="secondary" onClick={() => copy(text, label)} className="w-fit">
                    <CopyIcon className="size-4" />
                    Copy {label.toLowerCase()}
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          ) : null}
        </Card>
      </div>
    </Container>
  )
}
