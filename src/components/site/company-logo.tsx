import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { companyHue, getCompany, oklchOf } from "@/lib/data"
import { cn } from "@/lib/utils"

const SIZES = {
  sm: "size-8 rounded-lg text-xs",
  md: "size-11 rounded-xl text-sm",
  lg: "size-16 rounded-2xl text-xl",
} as const

/**
 * A company mark. A square logo fills its tile edge to edge, so the tile takes the
 * company's own colour. A wide logo sits on its own background colour. A company
 * without a logo gets its initials on a solid light tint of its colour, so nothing behind the tile shows through.
 */
export function CompanyLogo({ companyId, name, size = "md", className }: { companyId: string; name: string; size?: keyof typeof SIZES; className?: string }) {
  const co = getCompany(companyId)
  const hue = companyHue(co ?? { name, tint: null })
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
  const cover = co?.logoFit === "cover"
  const bg = co?.logoBg ? `oklch(${co.logoBg[0]} ${co.logoBg[1]} ${co.logoBg[2]})` : "oklch(1 0 0)"
  return (
    <Avatar
      className={cn(SIZES[size], "relative shrink-0 shadow-[0_0.0625rem_0.125rem_oklch(0.27_0.03_60/0.08)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_0.0625rem_oklch(0.27_0.03_60/0.09)]", className)}
      style={{ background: co?.logo ? bg : oklchOf({ l: 0.93, c: Math.min(hue.c, 0.06), h: hue.h }) }}
    >
      {co?.logo ? <AvatarImage src={co.logo} alt="" className={cover ? "size-full object-cover" : "size-full object-contain p-[14%]"} /> : null}
      <AvatarFallback className={cn("rounded-[inherit] bg-transparent font-semibold", SIZES[size].split(" ").at(-1))} style={{ color: oklchOf({ ...hue, l: 0.42 }) }}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
