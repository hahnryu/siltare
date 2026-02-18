"use client"

import { cn } from "@/lib/utils"
import type { MicState } from "./mic-button"

interface StateToggleProps {
  current: MicState
  onChange: (state: MicState) => void
}

const states: { value: MicState; label: string }[] = [
  { value: "idle", label: "대기" },
  { value: "recording", label: "녹음" },
  { value: "processing", label: "처리" },
]

export function StateToggle({ current, onChange }: StateToggleProps) {
  return (
    <div
      className="inline-flex items-center rounded-lg border border-border bg-card-warm p-1"
      role="radiogroup"
      aria-label="마이크 상태 전환"
    >
      {states.map(({ value, label }) => (
        <button
          key={value}
          role="radio"
          aria-checked={current === value}
          onClick={() => onChange(value)}
          className={cn(
            "rounded-md px-4 py-1.5 font-sans text-xs transition-all duration-200",
            current === value
              ? "bg-bark text-cream shadow-sm"
              : "text-brown-muted hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
