// From Nucleo (glyph, solid) — licensed. Single-tone on purpose: this glyph
// usually sits on a button, and a faded layer reads as disabled.
import type { SVGProps } from "react";

export function ArrowUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="currentColor" {...props}>
      <g><path d="M9,16c-.414,0-.75-.336-.75-.75V3c0-.414,.336-.75,.75-.75s.75,.336,.75,.75V15.25c0,.414-.336,.75-.75,.75Z" fill="currentColor" /> <path d="M13.25,7.75c-.192,0-.384-.073-.53-.22l-3.72-3.72-3.72,3.72c-.293,.293-.768,.293-1.061,0s-.293-.768,0-1.061L8.47,2.22c.293-.293,.768-.293,1.061,0l4.25,4.25c.293,.293,.293,.768,0,1.061-.146,.146-.338,.22-.53,.22Z" fill="currentColor" /></g>
    </svg>
  );
}
