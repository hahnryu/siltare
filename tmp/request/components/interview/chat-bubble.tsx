"use client"

interface ChatBubbleProps {
  role: "ai" | "user"
  content: string
  aiName?: string
}

export function ChatBubble({ role, content, aiName = "실타래" }: ChatBubbleProps) {
  if (role === "ai") {
    return (
      <div className="flex flex-col items-start gap-1 max-w-[85%]">
        <span className="font-serif text-xs font-semibold text-muted-foreground pl-1">
          {aiName}
        </span>
        <div className="rounded-2xl rounded-tl-sm bg-card px-4 py-3 shadow-sm border border-border/50">
          <p className="text-sm leading-relaxed text-card-foreground">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end max-w-[85%] self-end">
      <div className="rounded-2xl rounded-tr-sm bg-primary/10 px-4 py-3">
        <p className="text-sm leading-relaxed text-foreground">{content}</p>
      </div>
    </div>
  )
}
