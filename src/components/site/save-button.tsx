import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { toast } from "sonner"

import { BookmarkFilledIcon, BookmarkIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { toggleSaved, useIsSaved } from "@/lib/saved"
import { cn } from "@/lib/utils"

/** Bookmark toggle. The fill pops on a spring and a toast confirms with an undo. */
export function SaveButton({ jobId, title, withLabel = false, className }: { jobId: string; title: string; withLabel?: boolean; className?: string }) {
  const saved = useIsSaved(jobId)
  const reduced = useReducedMotion()

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const now = toggleSaved(jobId)
    toast(now ? "Saved to your list" : "Removed from saved", {
      description: title,
      action: { label: "Undo", onClick: () => toggleSaved(jobId) },
    })
  }

  const icon = (
    <span className="relative grid size-[1.125rem] place-items-center" aria-hidden>
      <AnimatePresence initial={false} mode="popLayout">
        {saved ? (
          <motion.span
            key="on"
            initial={reduced ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}
            className="absolute inset-0"
          >
            <BookmarkFilledIcon className="size-[1.125rem] text-foreground" />
          </motion.span>
        ) : (
          <motion.span key="off" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="absolute inset-0">
            <BookmarkIcon className="size-[1.125rem]" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )

  if (withLabel) {
    return (
      <Button variant="secondary" size="lg" onClick={onClick} aria-pressed={saved} className={cn("h-11 min-w-28", className)}>
        {icon}
        {saved ? "Saved" : "Save"}
      </Button>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            
            onClick={onClick}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
            className={cn("size-11", saved && "text-foreground", className)}
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent>{saved ? "Saved" : "Save role"}</TooltipContent>
    </Tooltip>
  )
}
