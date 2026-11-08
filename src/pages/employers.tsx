import { useState } from "react"
import { toast } from "sonner"

import { CheckIcon, RocketIcon, StarsIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Container, PageHeader } from "@/components/site/layout"

const PLANS = [
  {
    id: "boost",
    icon: RocketIcon,
    name: "Pinned roles",
    price: "$99",
    per: "per role, for 30 days",
    cta: "Pin your roles",
    field: { label: "Link to the role", placeholder: "https://jobs.ashbyhq.com/yourco/123" },
    items: [
      "Pinned to the top of the job feed for 30 days",
      "Highlighted card in the feed",
      "Shown in Trending roles on the home page",
      "Placed higher in filtered and search results",
      "Featured in the Marketplace Jobs newsletter",
      "Pin as many roles as you want, one by one",
    ],
  },
  {
    id: "feature",
    icon: StarsIcon,
    name: "Featured company",
    price: "$499",
    per: "one time, for 30 days",
    cta: "Feature your company",
    field: { label: "Company website", placeholder: "https://yourco.com" },
    items: [
      "Highlighted card in the home feed",
      "Pinned to the top of the Companies directory",
      "Hiring badge with your open role count",
      "Shown in the Featured companies strip",
      "Featured in the Marketplace Jobs newsletter",
    ],
  },
] as const

function Checkout({ plan }: { plan: (typeof PLANS)[number] }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [email, setEmail] = useState("")
  const valid = /^https?:\/\/\S+\.\S+/.test(url) && /\S+@\S+\.\S+/.test(email)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" className="w-full" />}>{plan.cta}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{plan.cta}</DialogTitle>
          <DialogDescription>
            {plan.price} {plan.per}. We send the invoice to your email and start the placement once it is paid.
          </DialogDescription>
        </DialogHeader>
        <form
          id={`f-${plan.id}`}
          onSubmit={(e) => {
            e.preventDefault()
            if (!valid) return
            setOpen(false)
            toast("Request received", { description: `We will email ${email} within one working day.` })
          }}
          className="flex flex-col gap-4"
        >
          <Field label={plan.field.label} htmlFor={`u-${plan.id}`} required>
            <Input id={`u-${plan.id}`} type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={plan.field.placeholder} />
          </Field>
          <Field label="Work email" htmlFor={`e-${plan.id}`} required>
            <Input id={`e-${plan.id}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourco.com" />
          </Field>
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form={`f-${plan.id}`} disabled={!valid}>
            Request invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Employers() {
  return (
    <Container className="flex max-w-5xl flex-col gap-8 pt-10">
      <PageHeader title="Get in front of marketplace talent" text="Pin single roles or feature your whole company." />
      <div className="grid gap-5 md:grid-cols-2">
        {PLANS.map((p) => (
          <Card key={p.id} className="flex flex-col gap-6 p-7">
            <div className="flex flex-col gap-3">
              <span className="grid size-10 place-items-center rounded-[0.625rem] bg-muted">
                <p.icon className="size-5 text-foreground" />
              </span>
              <h2 className="text-lg font-semibold text-foreground">{p.name}</h2>
              <p className="flex items-baseline gap-2">
                <span className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.per}</span>
              </p>
            </div>
            <ul className="flex flex-1 flex-col gap-2.5">
              {p.items.map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-[oklch(0.546_0.119_162.5)]" />
                  {i}
                </li>
              ))}
            </ul>
            <Checkout plan={p} />
          </Card>
        ))}
      </div>
    </Container>
  )
}
