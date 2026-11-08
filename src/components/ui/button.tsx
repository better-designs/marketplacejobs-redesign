import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { tbPrimaryRaised, tbPrimaryRaisedHover, tbRaisedPanel } from "./_shared";

// Talentboard Button: raised orange primary over the warm off-white canvas.
// Hero treatment = orange gradient fill + hairline rim + inset top highlight
// + a soft low-alpha ambient shadow.

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium",
    "rounded-lg transition-all duration-fast ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-45",
    "active:translate-y-px active:brightness-95",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Hero: the raised orange material every filled control mirrors.
        default: cn(tbPrimaryRaised, tbPrimaryRaisedHover),
        // Secondary: raised neutral panel with hairline highlight.
        secondary: cn(tbRaisedPanel, "hover:bg-accent hover:border-border"),
        // Outline: hairline border, flat until hover.
        outline:
          "border border-border bg-transparent text-foreground " +
          "hover:bg-secondary hover:border-border " +
          "hover:shadow-[var(--tb-shadow-sm)]",
        // Ghost: understated, for toolbars and table rows.
        ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
        // Destructive: raised red with the same layered recipe.
        destructive:
          "bg-destructive text-destructive-foreground " +
          "shadow-[inset_0_0.0625rem_0_oklch(1_0_0/0.22),0_0.0625rem_0.125rem_oklch(0.5_0.16_27/0.3),0_0.25rem_0.75rem_-0.1875rem_oklch(0.6_0.2_27/0.4)] " +
          "hover:brightness-[1.04]",
        // Link
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-9 px-4",
        lg: "h-10 px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<ButtonPrimitive.Props, "className">,
    VariantProps<typeof buttonVariants> {
  className?: string;
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Callers written against the Radix API pass the element to become as a
    // child: <Button asChild><Link>…</Link></Button>. Base UI has no asChild,
    // it composes through `render`. Without this the prop reaches the DOM and
    // the anchor nests inside the button instead of replacing it, which stacks
    // the icon above the label and puts a link inside a button.
    if (asChild && React.isValidElement(props.children)) {
      const { children, ...rest } = props
      return (
        <ButtonPrimitive
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          {...rest}
          nativeButton={false}
          // After the spread, so an explicit asChild child wins over a stray
          // render prop rather than being silently replaced by it.
          // SAFETY: this branch runs only when `asChild` is set, and the caller then
          // owns passing a single element for the slot to clone.
          render={children as React.ReactElement}
        />
      );
    }

    return (
      <ButtonPrimitive
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
