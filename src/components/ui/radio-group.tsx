"use client";

import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";

import { cn } from "@/lib/utils";

// Talentboard RadioGroup: unchecked = recessed well; checked = raised orange
// material (Button gradient + rim + ambient shadow) with a punched-out center dot.

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />
  );
}
RadioGroup.displayName = "RadioGroup";

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "aspect-square h-4 w-4 rounded-full",
        "border border-border/80 bg-input/80 shadow-[var(--tb-shadow-inset)]",
        "transition-all duration-fast ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:border-transparent data-checked:bg-[image:var(--tb-primary-gradient)]",
        "data-checked:shadow-[var(--tb-shadow-primary-sm)]",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator data-slot="radio-group-indicator" className="size-full flex items-center justify-center">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground shadow-[0_0.0625rem_0.0625rem_oklch(1_0_0/0.3)]" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
