"use client"

interface InterviewHeaderProps {
  elapsedSeconds: number
  progress: number
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export function InterviewHeader({ elapsedSeconds, progress }: InterviewHeaderProps) {
  return (
    <header className="flex-shrink-0">
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="font-serif text-base font-semibold tracking-tight text-foreground">
          {"실타래"}
        </h1>
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {formatTime(elapsedSeconds)}
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-border/60">
        <div
          className="h-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`인터뷰 진행률 ${Math.round(progress)}%`}
        />
      </div>
    </header>
  )
}
