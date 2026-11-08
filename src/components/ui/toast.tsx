import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { tbPopSurface } from "./_shared";

// Talentboard Toast: floating card on the layered pop shadow.

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef<
  HTMLDivElement,
  ToastPrimitive.Viewport.Props
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Portal>
    <ToastPrimitive.Viewport
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[26.25rem]",
        className
      )}
      {...props}
    />
  </ToastPrimitive.Portal>
));
ToastViewport.displayName = "ToastViewport";

const toastVariants = cva(
  cn(
    tbPopSurface,
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-xl p-4 pr-6 transition-all data-swiping:translate-x-[var(--toast-swipe-movement-x)] data-swiping:transition-none data-ending-style:opacity-80 data-ending-style:translate-x-full data-starting-style:-translate-y-full sm:data-starting-style:translate-y-full"
  ),
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "border-[color:oklch(0.6_0.2_27/0.5)] bg-[oklch(0.32_0.08_27)] text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  HTMLDivElement,
  ToastPrimitive.Root.Props & VariantProps<typeof toastVariants>
>(({ className, variant, swipeDirection = "right", ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      swipeDirection={swipeDirection}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = "Toast";

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  ToastPrimitive.Action.Props
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border/70 bg-secondary px-3 text-sm font-medium text-secondary-foreground",
      "shadow-[var(--tb-shadow-raise)] transition-colors hover:bg-accent",
      "focus:outline-none focus:ring-2 focus:ring-ring/60 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  ToastPrimitive.Close.Props
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity",
      "hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring/60 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef<
  HTMLHeadingElement,
  ToastPrimitive.Title.Props
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  ToastPrimitive.Description.Props
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
