"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

// Talentboard Tabs: recessed strip; the active tab raises on a soft layered
// shadow like the billing portal's segment switcher.

const Tabs = TabsPrimitive.Root;

// Base UI className can be a state function; the wrappers feed it to cn(), so
// narrow it to a plain string.
type WithClassName<P> = Omit<P, "className"> & { className?: string };

const TabsList = React.forwardRef<
  HTMLDivElement,
  WithClassName<TabsPrimitive.List.Props>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center gap-1 rounded-lg p-1",
      "border border-border/60 bg-input/60 shadow-[var(--tb-shadow-inset)]",
      "text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  WithClassName<TabsPrimitive.Tab.Props>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium",
      "transition-all duration-fast ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-active:bg-secondary data-active:text-foreground",
      "data-active:shadow-[var(--tb-shadow-raise)]",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  WithClassName<TabsPrimitive.Panel.Props>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Panel
    ref={ref}
    className={cn(
      "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
