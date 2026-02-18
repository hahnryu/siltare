"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

const BAR_COUNT = 48
const DEMO_DURATION = 32 * 60 + 14 // 32:14

// Deterministic pseudo-random using a simple hash to avoid SSR/client mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

function generateWaveform(count: number): number[] {
  const bars: number[] = []
  for (let i = 0; i < count; i++) {
    const t = i / count
    const base = 0.3 + 0.4 * Math.sin(t * Math.PI)
    const noise = seededRandom(i + 1) * 0.3
    bars.push(Math.min(1, base + noise))
  }
  return bars
}

// Pre-compute once so the same values are used on server and client
const WAVEFORM = generateWaveform(BAR_COUNT)

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const waveform = WAVEFORM
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const progress = currentTime / DEMO_DURATION

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= DEMO_DURATION) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying])

  const handleBarClick = (index: number) => {
    const newTime = (index / BAR_COUNT) * DEMO_DURATION
    setCurrentTime(newTime)
  }

  return (
    <section className="px-4">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-card border border-border p-6">
          <p className="text-sm font-medium text-muted-foreground mb-5">
            원본 음성 전체 듣기
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-card transition-transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "일시정지" : "재생"}
            >
              {isPlaying ? (
                <Pause className="size-5 fill-current" />
              ) : (
                <Play className="size-5 fill-current ml-0.5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              {/* Waveform */}
              <div
                className="flex items-end gap-[2px] h-12 cursor-pointer"
                role="slider"
                aria-label="오디오 재생 위치"
                aria-valuemin={0}
                aria-valuemax={DEMO_DURATION}
                aria-valuenow={Math.floor(currentTime)}
                tabIndex={0}
              >
                {waveform.map((height, i) => {
                  const barProgress = i / BAR_COUNT
                  const isActive = barProgress <= progress
                  return (
                    <button
                      key={i}
                      onClick={() => handleBarClick(i)}
                      className={cn(
                        "flex-1 rounded-full transition-colors duration-150 min-w-[2px]",
                        isActive ? "bg-accent" : "bg-border"
                      )}
                      style={{ height: `${height * 100}%` }}
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  )
                })}
              </div>

              {/* Time display */}
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(DEMO_DURATION)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
