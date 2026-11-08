import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link } from "react-router"

import { CheckIcon, MailIcon, SearchIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Container, PageHeader } from "@/components/site/layout"
import { jobs } from "@/lib/data"

function Success({ title, text }: { title: string; text: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 28 }} className="flex flex-col items-start gap-3" role="status">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.08 }} className="grid size-10 place-items-center rounded-full bg-[oklch(0.696_0.17_162.5/0.18)]">
        <CheckIcon className="size-5 text-[oklch(0.483_0.101_165.6)]" />
      </motion.span>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{text}</p>
    </motion.div>
  )
}

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  return (
    <Container className="flex max-w-xl flex-col gap-7 pt-16">
      <PageHeader title="Marketplace jobs, every Monday" text="A short digest of the best new roles at marketplace startups. Unsubscribe in one click." />
      <Card className="p-6">
        <AnimatePresence mode="wait">
          {sent ? (
            <Success key="ok" title="You are subscribed" text={`The next issue reaches ${email} on Monday.`} />
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0 }}
              onSubmit={(e) => {
                e.preventDefault()
                if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter an email address such as you@example.com.")
                setSent(true)
              }}
              className="flex flex-col gap-4"
              noValidate
            >
              <Field label="Email" htmlFor="nl" error={error || undefined}>
                <Input id="nl" type="email" value={email} onChange={(e) => (setEmail(e.target.value), setError(""))} placeholder="you@example.com" autoComplete="email" />
              </Field>
              <Button type="submit" size="lg" className="w-fit">
                <MailIcon className="size-4" />
                Subscribe
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </Card>
    </Container>
  )
}

export function SubmitCompany() {
  const [v, setV] = useState({ name: "", site: "", board: "", email: "" })
  const [sent, setSent] = useState(false)
  const [tried, setTried] = useState(false)
  const errs = {
    name: v.name ? "" : "Enter the company name.",
    site: /^https?:\/\/\S+\.\S+/.test(v.site) ? "" : "Enter a full link that starts with https://",
    board: !v.board || /^https?:\/\/\S+\.\S+/.test(v.board) ? "" : "Enter a full link, or leave it empty.",
    email: /\S+@\S+\.\S+/.test(v.email) ? "" : "Enter your work email.",
  }
  const ok = Object.values(errs).every((e) => !e)
  const field = (k: keyof typeof v) => ({ id: k, value: v[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value }) })
  return (
    <Container className="flex max-w-xl flex-col gap-7 pt-12">
      <PageHeader title="List your marketplace" text="Add your company and its jobs board. We review it and import your open roles." />
      <Card className="p-6">
        <AnimatePresence mode="wait">
          {sent ? (
            <Success key="ok" title="Thanks, we have your company" text={`We review ${v.name} within two working days and email ${v.email} when its roles go live.`} />
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0 }}
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                setTried(true)
                if (ok) setSent(true)
              }}
              className="flex flex-col gap-4"
            >
              <Field label="Company name" htmlFor="name" required error={tried ? errs.name || undefined : undefined}>
                <Input {...field("name")} placeholder="Wander" />
              </Field>
              <Field label="Website" htmlFor="site" required error={tried ? errs.site || undefined : undefined}>
                <Input {...field("site")} type="url" placeholder="https://wander.com" />
              </Field>
              <Field label="Jobs board link" htmlFor="board" optional description="Your careers page or applicant tracking board, such as Greenhouse, Lever or Ashby." error={tried ? errs.board || undefined : undefined}>
                <Input {...field("board")} type="url" placeholder="https://jobs.ashbyhq.com/wander" />
              </Field>
              <Field label="Work email" htmlFor="email" required error={tried ? errs.email || undefined : undefined}>
                <Input {...field("email")} type="email" placeholder="you@wander.com" />
              </Field>
              <Button type="submit" size="lg" className="w-fit">
                Submit company
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </Card>
    </Container>
  )
}

export function NotFound() {
  return (
    <Container className="pt-16">
      <EmptyState
        icon={<SearchIcon className="size-5" />}
        title="This page does not exist"
        description={`The link may be old. ${jobs.length} roles are open today.`}
        action={
          <Button asChild>
            <Link to="/jobs">Browse roles</Link>
          </Button>
        }
        className="bg-card py-16"
      />
    </Container>
  )
}
