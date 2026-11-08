"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

// Talentboard Slider: recessed track; the Range fill and thumb both wear the
// raised orange primary material so the slider matches the Button.

const Slider = React.forwardRef<HTMLDivElement, SliderPrimitive.Root.Props>(
  ({ className, defaultValue, value, min = 0, max = 100, ...props }, ref) => {
    const _values = Array.isArray(value)
      ? value
      : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max]

    return (
      <SliderPrimitive.Root
        data-slot="slider"
        ref={ref}
        thumbAlignment="edge"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn("relative w-full", className)}
        {...props}
      >
        <SliderPrimitive.Control className="flex w-full touch-none select-none items-center">
          <SliderPrimitive.Track data-slot="slider-track" className="relative h-1.5 w-full grow rounded-full border border-border/60 bg-input/80 shadow-[var(--tb-shadow-inset)]">
            <SliderPrimitive.Indicator data-slot="slider-range" className="absolute h-full rounded-full bg-[image:var(--tb-primary-gradient)] shadow-[inset_0_0.0625rem_0_oklch(1_0_0/0.35)]" />
          </SliderPrimitive.Track>
          {Array.from({ length: _values.length }, (_, index) => (
            <SliderPrimitive.Thumb data-slot="slider-thumb" key={index} className="block h-4 w-4 rounded-full bg-[image:var(--tb-primary-gradient)] shadow-[var(--tb-shadow-primary-sm)] transition-shadow duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-disabled:pointer-events-none data-disabled:opacity-50" />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    )
  }
)
Slider.displayName = "Slider";

export { Slider };
