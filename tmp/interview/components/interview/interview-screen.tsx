"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { TopBar } from "./top-bar"
import { ChatArea } from "./chat-area"
import { MicButton, type MicState } from "./mic-button"
import { StateToggle } from "./state-toggle"
import type { Message } from "./chat-message"

// Generate a random-ish waveform array
function generateWaveform(length: number, seed: number): number[] {
  const result: number[] = []
  let val = 0.5
  for (let i = 0; i < length; i++) {
    val += (Math.sin(seed + i * 0.7) * 0.3 + Math.cos(seed * 2 + i * 1.1) * 0.2)
    val = Math.max(0.15, Math.min(1, val))
    result.push(val)
  }
  return result
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    type: "text",
    content:
      "안녕하세요, 어머님. 민수님이 어머님의 이야기를 듣고 싶어 보내드린 실타래입니다. 편하게 말씀해 주세요.",
  },
  {
    id: "2",
    role: "user",
    type: "voice",
    duration: 3,
    waveform: generateWaveform(28, 1),
  },
  {
    id: "3",
    role: "ai",
    type: "text",
    content:
      "네, 민수님이 어머님의 어린 시절 이야기를 특히 궁금해하셨어요. 어머님은 어디에서 태어나셨나요?",
  },
  {
    id: "4",
    role: "user",
    type: "voice",
    duration: 7,
    waveform: generateWaveform(36, 5),
  },
  {
    id: "5",
    role: "ai",
    type: "text",
    content:
      "안동이시군요. 안동에서의 어린 시절은 어떠셨어요? 가장 먼저 떠오르는 기억이 있으신가요?",
  },
]

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function InterviewScreen() {
  const [micState, setMicState] = useState<MicState>("idle")
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (micState === "recording") {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [micState])

  const handleToggle = useCallback(() => {
    setMicState((prev) => {
      if (prev === "idle") return "recording"
      if (prev === "recording") return "processing"
      return "idle"
    })
  }, [])

  return (
    <div className="flex h-dvh flex-col bg-background">
      <TopBar progress={35} />

      <ChatArea messages={SAMPLE_MESSAGES} />

      <footer className="flex-shrink-0 border-t border-border/50 bg-background pb-6">
        <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-5">
          <MicButton state={micState} onToggle={handleToggle} elapsed={formatTime(elapsed)} />
          <div className="mt-2">
            <StateToggle current={micState} onChange={setMicState} />
          </div>
        </div>
      </footer>
    </div>
  )
}
