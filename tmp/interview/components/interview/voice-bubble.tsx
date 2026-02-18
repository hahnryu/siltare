"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

interface VoiceBubbleProps {
  /** Duration in seconds */
  duration: number
  /** Random waveform heights (0-1), used to draw the bars */
  waveform: number[]
}

function formatDuration(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, "0")}`
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5.14v14.72a1 1 0 0 0 1.5.86l11.5-7.36a1 1 0 0 0 0-1.72L9.5 4.28a1 1 0 0 0-1.5.86Z" />
    </svg>
  )
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}

export function VoiceBubble({ duration, waveform }: VoiceBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Simulate playback progress
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      if (animRef.current) clearInterval(animRef.current)
    } else {
      setIsPlaying(true)
      const step = 100 / (duration * 20) // update every 50ms
      animRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            if (animRef.current) clearInterval(animRef.current)
            return 0
          }
          return prev + step
        })
      }, 50)
    }
  }, [isPlaying, duration])

  useEffect(() => {
    return () => {
      if (animRef.current) clearInterval(animRef.current)
    }
  }, [])

  // Simulate transcription via ->A button
  const handleTranscribe = useCallback(() => {
    if (transcript || isTranscribing) return
    setIsTranscribing(true)
    // Simulate Whisper API delay
    setTimeout(() => {
      setTranscript("나는 경상북도 안동에서 태어났지. 1952년에.")
      setIsTranscribing(false)
    }, 1800)
  }, [transcript, isTranscribing])

  const totalBars = waveform.length
  const playedBars = Math.floor((progress / 100) * totalBars)

  return (
    <div className="flex flex-col items-end gap-1.5">
      {/* Voice message bubble */}
      <div className="flex items-center gap-3 rounded-2xl rounded-tr-md bg-amber-light px-3 py-2.5">
        {/* Play / Pause button */}
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform active:scale-95"
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="ml-0.5 h-4 w-4" />
          )}
        </button>

        {/* Waveform + duration */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-end gap-[2px]" aria-hidden="true">
            {waveform.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "w-[3px] rounded-full transition-colors duration-100",
                  i < playedBars ? "bg-accent" : "bg-brown-muted/40"
                )}
                style={{ height: `${Math.max(4, h * 20)}px` }}
              />
            ))}
          </div>
          <span className="font-sans text-xs tabular-nums text-brown-muted">
            {isPlaying ? formatDuration(Math.floor((progress / 100) * duration)) : formatDuration(duration)}
          </span>
        </div>

        {/* Transcribe button */}
        <button
          type="button"
          onClick={handleTranscribe}
          disabled={isTranscribing || !!transcript}
          className={cn(
            "ml-1 flex h-8 items-center gap-0.5 rounded-lg px-2 font-sans text-xs font-medium transition-all active:scale-95",
            transcript
              ? "bg-accent/20 text-accent cursor-default"
              : isTranscribing
                ? "bg-foreground/10 text-stone cursor-wait"
                : "bg-foreground/10 text-foreground hover:bg-foreground/15"
          )}
          aria-label="텍스트로 변환"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M3 8h4.5m0 0L5.5 6m2 2L5.5 10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>A</span>
        </button>
      </div>

      {/* Transcript (revealed after ->A) */}
      {(isTranscribing || transcript) && (
        <div
          className={cn(
            "max-w-[85%] rounded-2xl rounded-tr-md px-4 py-3 transition-all duration-300",
            transcript ? "bg-amber-light/60" : "bg-amber-light/40"
          )}
        >
          {isTranscribing ? (
            <div className="flex items-center gap-2 font-sans text-sm text-stone">
              <span>텍스트 변환 중</span>
              <span className="flex gap-0.5">
                <span className="h-1 w-1 rounded-full bg-stone animate-dot-1" />
                <span className="h-1 w-1 rounded-full bg-stone animate-dot-2" />
                <span className="h-1 w-1 rounded-full bg-stone animate-dot-3" />
              </span>
            </div>
          ) : (
            <p className="font-sans text-[15px] leading-relaxed text-foreground">
              {transcript}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
