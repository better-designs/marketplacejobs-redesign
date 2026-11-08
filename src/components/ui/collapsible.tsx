"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

// Talentboard Collapsible: thin wrapper over the Base UI primitive.

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

const CollapsibleContent = CollapsiblePrimitive.Panel;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
