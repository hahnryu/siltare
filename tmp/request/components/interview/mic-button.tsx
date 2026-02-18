"use client"

import { Mic } from "lucide-react"

export type MicState = "idle" | "recording" | "processing"

interface MicButtonProps {
  state: MicState
  onPress: () => void
}

const STATUS_TEXT: Record<MicState, string> = {
  idle: "마이크를 눌러 말씀해 주세요",
  recording: "듣고 있습니다...",
  processing: "생각하고 있습니다...",
}

function ProcessingDots() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground animate-[typing-bounce_1.4s_ease-in-out_infinite]" />
      <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground animate-[typing-bounce_1.4s_ease-in-out_0.2s_infinite]" />
      <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground animate-[typing-bounce_1.4s_ease-in-out_0.4s_infinite]" />
    </span>
  )
}

export function MicButton({ state, onPress }: MicButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Status text */}
      <div className="flex items-center gap-2 h-5">
        {state === "processing" ? (
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            {"생각하고 있습니다"}
            <ProcessingDots />
          </span>
        ) : (
          <p className={`text-sm transition-colors duration-300 ${
            state === "recording" ? "text-primary font-medium" : "text-muted-foreground"
          }`}>
            {STATUS_TEXT[state]}
          </p>
        )}
      </div>

      {/* Mic button */}
      <button
        type="button"
        onClick={onPress}
        disabled={state === "processing"}
        className={`
          relative flex h-16 w-16 items-center justify-center rounded-full
          transition-all duration-300 cursor-pointer
          disabled:cursor-not-allowed disabled:opacity-60
          ${state === "recording"
            ? "bg-foreground shadow-[0_0_0_6px_rgba(196,149,106,0.2),0_0_0_12px_rgba(196,149,106,0.1)] scale-110"
            : "bg-foreground shadow-lg hover:scale-105 active:scale-95"
          }
        `}
        aria-label={state === "recording" ? "녹음 중지" : "녹음 시작"}
      >
        {/* Pulse ring for recording */}
        {state === "recording" && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
        )}

        <Mic className={`h-6 w-6 text-background relative z-10 transition-transform duration-300 ${
          state === "recording" ? "scale-110" : ""
        }`} />
      </button>

      {/* Help text */}
      <p className="text-xs text-muted-foreground/50">
        {"말씀이 끝나면 자동으로 다음 질문으로 넘어갑니다"}
      </p>
    </div>
  )
}
