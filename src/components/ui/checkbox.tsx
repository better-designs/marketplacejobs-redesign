"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "@/components/icons";

import { cn } from "@/lib/utils";

// Talentboard Checkbox: unchecked = recessed well, checked = the exact raised
// orange material the primary Button uses, scaled down.

function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: CheckboxPrimitive.Root.Props) {
  // Controlled parents own the value: the tick must follow the checked prop,
  // not an internal mirror that flips even when the parent rejects the change.
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked ?? false
  );
  const isChecked = isControlled ? !!checked : internalChecked;

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm",
        "border border-border/80 bg-input/80 shadow-[var(--tb-shadow-inset)]",
        "transition-all duration-fast ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:border-transparent data-checked:bg-[image:var(--tb-primary-gradient)]",
        "data-checked:text-primary-foreground data-checked:shadow-[var(--tb-shadow-primary-sm)]",
        className
      )}
      checked={isChecked}
      onCheckedChange={(value, eventDetails) => {
        if (!isControlled) setInternalChecked(value);
        onCheckedChange?.(value, eventDetails);
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="size-full flex items-center justify-center text-current">
        <CheckIcon className="h-3 w-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
Checkbox.displayName = "Checkbox";

export { Checkbox };
