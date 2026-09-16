import { Fragment } from "react"
import { cn } from "@/lib/utils" // shadcn's cn helper (clsx + tailwind-merge)

export const STEP_LABELS = [
  "What do you want?",
  "How do you want it?",
  "Pick your vibe",
  "Here's what we found",
] as const

export function ProgressBar({ currentStep }: { currentStep: 1 | 2 | 3 | 4 }) {
  return (
    <div className="w-full max-w-md" aria-label={`Step ${currentStep} of 4`}>
      <div className="flex items-center">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1
          const done = step < currentStep
          const active = step === currentStep
          return (
            <Fragment key={label}>
              {i > 0 && (
                <div className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} />
              )}
              <div
                className={cn(
                  "size-3 rounded-full",
                  done && "bg-primary",
                  active && "bg-primary animate-pulse ring-4 ring-ring/30",
                  !done && !active && "bg-border"
                )}
                aria-current={active ? "step" : undefined}
              />
            </Fragment>
          )
        })}
      </div>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {STEP_LABELS[currentStep - 1]}
      </p>
    </div>
  )
}
