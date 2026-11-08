"use client";

import * as React from "react";

// Talentboard AspectRatio: Base UI has no AspectRatio primitive, so this is a
// plain div with CSS aspect-ratio. position: relative + width: 100% mirror the
// old primitive's root box so absolutely positioned children keep working.

export interface AspectRatioProps
  extends React.ComponentPropsWithoutRef<"div"> {
  ratio?: number;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: String(ratio),
        ...style,
      }}
      {...props}
    />
  )
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
