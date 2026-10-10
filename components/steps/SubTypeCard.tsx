
"use client"

export function SubTypeCard({
  label,
  emoji,
  onClick,
}: {
  label: string
  emoji: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[120px] w-full items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:border-ring hover:bg-card/80 md:max-w-sm"
    >
      <span className="text-4xl" aria-hidden>
        {emoji}
      </span>
      <span className="text-lg font-medium">{label}</span>
    </button>
  )
}
