import { ChevronLeft } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <button
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="size-4" />
          <span>돌아가기</span>
        </button>
        <span className="font-serif text-sm font-semibold text-foreground tracking-tight">
          실타래
        </span>
        <div className="w-16" aria-hidden="true" />
      </div>
    </header>
  )
}
