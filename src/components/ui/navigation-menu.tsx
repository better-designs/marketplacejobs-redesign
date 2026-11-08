import * as React from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "@/components/icons";

import { cn } from "@/lib/utils";
import { tbPopSurface } from "./_shared";

// Talentboard NavigationMenu: viewport floats on the shared layered pop shadow.

function NavigationMenu({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
}
NavigationMenu.displayName = "NavigationMenu";

function NavigationMenuList({
  className,
  ...props
}: NavigationMenuPrimitive.List.Props) {
  return (
    <NavigationMenuPrimitive.List
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  );
}
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:text-foreground data-popup-open:bg-accent data-popup-open:text-foreground"
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[0.0625rem] ml-1 h-3 w-3 transition duration-base group-data-popup-open:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "left-0 top-0 w-full p-2 transition-[opacity,transform,translate] duration-fast data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:data-[activation-direction=left]:-translate-x-52 data-starting-style:data-[activation-direction=right]:translate-x-52 data-ending-style:data-[activation-direction=left]:translate-x-52 data-ending-style:data-[activation-direction=right]:-translate-x-52 md:absolute md:w-auto",
        className
      )}
      {...props}
    />
  );
}
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuLink = NavigationMenuPrimitive.Link;

function NavigationMenuViewport({
  className,
  ...props
}: NavigationMenuPrimitive.Viewport.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        sideOffset={8}
        className="isolate z-50"
      >
        <NavigationMenuPrimitive.Popup
          className={cn(
            tbPopSurface,
            "relative h-[var(--popup-height)] w-full origin-[var(--transform-origin)] overflow-hidden rounded-lg transition-[opacity,transform,scale,width,height] duration-fast data-starting-style:scale-90 data-ending-style:scale-95 md:w-[var(--popup-width)]"
          )}
        >
          <NavigationMenuPrimitive.Viewport
            className={cn("relative h-full w-full overflow-hidden", className)}
            {...props}
          />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}
NavigationMenuViewport.displayName = "NavigationMenuViewport";

// BEHAVIOR DELTA (flagged): Base UI has no equivalent of the upstream
// NavigationMenu.Indicator (the pointer that tracks the active trigger along
// the list). This is an inert passthrough that renders nothing so existing
// call sites keep compiling. The closest Base UI analogues are
// NavigationMenu.Icon (chevron inside the trigger) and NavigationMenu.Arrow
// (popup-anchored pointer), neither of which tracks the trigger list.
function NavigationMenuIndicator(
  props: React.ComponentPropsWithoutRef<"div">
) {
  void props;
  return null;
}
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
