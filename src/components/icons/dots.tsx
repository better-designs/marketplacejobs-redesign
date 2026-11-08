// From Nucleo (glyph, solid) — licensed.
// Single-tone on purpose: action icons render solid, so a button never looks disabled.
import type { SVGProps } from "react";

export function DotsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="currentColor" {...props}>
      <g><circle cx="9" cy="9" r="1.25" fill="currentColor"/><circle cx="3.25" cy="9" r="1.25" fill="currentColor"/><circle cx="14.75" cy="9" r="1.25" fill="currentColor"/></g>
    </svg>
  );
}
