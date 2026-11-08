"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

// Talentboard Switch: off = recessed track, on = the raised orange primary
// material (same gradient + rim + inset highlight as the Button).

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full",
        "border border-transparent bg-muted-foreground/25 shadow-[var(--tb-shadow-inset)]",
        "transition-all duration-fast ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:border-transparent data-checked:bg-[image:var(--tb-primary-gradient)]",
        "data-checked:shadow-[var(--tb-shadow-primary-sm)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-card",
          "shadow-[0_0.0625rem_0.125rem_oklch(0.27_0.03_60/0.18)]",
          "ring-0 transition-transform duration-fast ease-out",
          "data-checked:translate-x-4 data-unchecked:translate-x-0.5"
        )}
      />
    </SwitchPrimitive.Root>
  );
}
Switch.displayName = "Switch";

export { Switch };
