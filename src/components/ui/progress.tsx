"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

// Talentboard Progress: recessed track, orange gradient fill with top highlight.

const Progress = React.forwardRef<
  HTMLDivElement,
  Omit<ProgressPrimitive.Root.Props, "value"> & {
    value?: ProgressPrimitive.Root.Props["value"];
  }
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={value ?? null}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full",
      "border border-border/60 bg-input/80 shadow-[var(--tb-shadow-inset)]",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Track className="h-full w-full">
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full",
          "bg-[image:var(--tb-primary-gradient)]",
          "shadow-[inset_0_0.0625rem_0_oklch(1_0_0/0.35)]",
          "transition-all duration-slow ease-out"
        )}
      />
    </ProgressPrimitive.Track>
  </ProgressPrimitive.Root>
));
Progress.displayName = "Progress";

export { Progress };
