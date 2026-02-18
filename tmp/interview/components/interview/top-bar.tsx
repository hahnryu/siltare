"use client"

interface TopBarProps {
  progress: number
}

export function TopBar({ progress }: TopBarProps) {
  return (
    <header className="flex-shrink-0">
      <div className="flex items-center justify-center px-5 py-4">
        <span className="font-serif text-lg tracking-tight text-foreground">
          실타래
        </span>
      </div>
      <div
        className="h-[2px] bg-secondary"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="인터뷰 진행률"
      >
        <div
          className="h-full bg-accent transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  )
}
