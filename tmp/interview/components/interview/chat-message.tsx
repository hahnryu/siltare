"use client"

import { cn } from "@/lib/utils"
import { VoiceBubble } from "./voice-bubble"

export interface TextMessage {
  id: string
  role: "ai" | "user"
  type: "text"
  content: string
}

export interface VoiceMessage {
  id: string
  role: "user"
  type: "voice"
  duration: number
  waveform: number[]
}

export type Message = TextMessage | VoiceMessage

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.role === "ai"

  // Voice message (user only)
  if (message.type === "voice") {
    return (
      <div className="flex w-full justify-end">
        <VoiceBubble duration={message.duration} waveform={message.waveform} />
      </div>
    )
  }

  // Text message
  return (
    <div
      className={cn(
        "flex w-full",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
          isAI
            ? "bg-card-warm text-foreground rounded-tl-md"
            : "bg-amber-light text-foreground rounded-tr-md"
        )}
      >
        {isAI && (
          <span className="mb-1 block font-serif text-xs text-stone">
            실타래
          </span>
        )}
        <p className="font-sans">{message.content}</p>
      </div>
    </div>
  )
}
