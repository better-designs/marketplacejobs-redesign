import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

type Choice = { value: string; label: string; text?: string }

const tile =
  "flex cursor-pointer items-start gap-3 rounded-[0.625rem] bg-card p-3.5 shadow-[0_0_0_0.0625rem_oklch(0_0_0/0.08)] transition-[background-color,box-shadow] duration-fast hover:bg-accent has-[[data-checked]]:bg-primary/[0.055] has-[[data-checked]]:shadow-[0_0_0_0.09375rem_oklch(0.1408_0.0044_285.82/0.7)]"

/** Several answers allowed. A chosen tile takes a soft fill and a firm ring. */
export function MultiChoice({ choices, value, onChange, columns = 2 }: { choices: Choice[]; value: string[]; onChange: (v: string[]) => void; columns?: 1 | 2 | 3 }) {
  return (
    <div className={cn("grid gap-2", columns === 2 && "sm:grid-cols-2", columns === 3 && "sm:grid-cols-3")}>
      {choices.map((c) => (
        <label key={c.value} className={tile}>
          <Checkbox checked={value.includes(c.value)} onCheckedChange={(on) => onChange(on ? [...value, c.value] : value.filter((v) => v !== c.value))} className="mt-0.5" />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{c.label}</span>
            {c.text ? <span className="text-sm text-muted-foreground">{c.text}</span> : null}
          </span>
        </label>
      ))}
    </div>
  )
}

/** One answer. */
export function SingleChoice({ choices, value, onChange, columns = 2, label }: { choices: Choice[]; value: string; onChange: (v: string) => void; columns?: 1 | 2 | 3; label: string }) {
  return (
    <RadioGroup aria-label={label} value={value} onValueChange={(v) => onChange(String(v))} className={cn("grid gap-2", columns === 2 && "sm:grid-cols-2", columns === 3 && "sm:grid-cols-3")}>
      {choices.map((c) => (
        <label key={c.value} className={tile}>
          <RadioGroupItem value={c.value} className="mt-0.5" />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{c.label}</span>
            {c.text ? <span className="text-sm text-muted-foreground">{c.text}</span> : null}
          </span>
        </label>
      ))}
    </RadioGroup>
  )
}
