"use client"

export function TypingIndicator() {
  return (
    <div className="flex flex-col items-start gap-1 max-w-[85%]">
      <span className="font-serif text-xs font-semibold text-muted-foreground pl-1">
        {"실타래"}
      </span>
      <div className="rounded-2xl rounded-tl-sm bg-card px-4 py-3.5 shadow-sm border border-border/50">
        <div className="flex items-center gap-1.5" role="status" aria-label="AI가 응답을 작성 중입니다">
          <span className="sr-only">{"AI가 응답을 작성 중입니다"}</span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-[typing-bounce_1.4s_ease-in-out_infinite]" />
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-[typing-bounce_1.4s_ease-in-out_0.2s_infinite]" />
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-[typing-bounce_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>
    </div>
  )
}
