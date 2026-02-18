"use client"

import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"

export type MicState = "idle" | "recording" | "processing"

interface MicButtonProps {
  state: MicState
  onToggle: () => void
  elapsed: string
}

function ProcessingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      <span className="animate-dot-1 inline-block h-[5px] w-[5px] rounded-full bg-accent" />
      <span className="animate-dot-2 inline-block h-[5px] w-[5px] rounded-full bg-accent" />
      <span className="animate-dot-3 inline-block h-[5px] w-[5px] rounded-full bg-accent" />
    </span>
  )
}

export function MicButton({ state, onToggle, elapsed }: MicButtonProps) {
  const isRecording = state === "recording"
  const isProcessing = state === "processing"

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Timer - directly above the button */}
      <div className="flex items-center gap-2">
        {isRecording && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"
            aria-label="녹음 중"
          />
        )}
        <time
          className={cn(
            "font-sans text-sm tabular-nums transition-colors duration-300",
            isRecording ? "text-accent" : "text-stone"
          )}
          aria-label={`경과 시간 ${elapsed}`}
        >
          {elapsed}
        </time>
      </div>

      {/* Status text */}
      <div className="h-5 text-center">
        {isRecording && (
          <p className="font-sans text-sm text-accent">
            듣고 있습니다...
          </p>
        )}
        {isProcessing && (
          <p className="flex items-center gap-2 font-sans text-sm text-stone">
            <span>생각하고 있습니다</span>
            <ProcessingDots />
          </p>
        )}
      </div>

      {/* Mic button */}
      <button
        onClick={onToggle}
        disabled={isProcessing}
        aria-label={
          isRecording
            ? "녹음 중지"
            : isProcessing
              ? "처리 중"
              : "녹음 시작"
        }
        className={cn(
          "relative flex h-[72px] w-[72px] items-center justify-center rounded-full transition-all duration-300",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
          isRecording && "animate-pulse-glow bg-accent",
          isProcessing && "cursor-not-allowed bg-stone opacity-60",
          !isRecording && !isProcessing && "bg-bark hover:bg-bark/90 active:scale-95"
        )}
      >
        <Mic
          className={cn(
            "h-7 w-7 transition-colors",
            isRecording ? "text-card-warm" : "text-cream"
          )}
          strokeWidth={1.8}
        />
      </button>

      {/* Helper text */}
      <p className="max-w-[260px] text-center font-sans text-xs leading-relaxed text-stone">
        말씀이 끝나면 자동으로 다음 질문으로 넘어갑니다
      </p>
    </div>
  )
}
