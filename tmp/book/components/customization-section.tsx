"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CoverStyle {
  id: string
  name: string
  colors: [string, string]
  accent: string
}

const coverStyles: CoverStyle[] = [
  {
    id: "minimal",
    name: "미니멀",
    colors: ["oklch(0.96 0.02 80)", "oklch(0.93 0.03 75)"],
    accent: "oklch(0.65 0.15 55)",
  },
  {
    id: "classic",
    name: "클래식",
    colors: ["oklch(0.40 0.06 50)", "oklch(0.32 0.05 45)"],
    accent: "oklch(0.82 0.12 70)",
  },
  {
    id: "modern",
    name: "모던",
    colors: ["oklch(0.25 0.02 50)", "oklch(0.20 0.02 45)"],
    accent: "oklch(0.72 0.14 60)",
  },
]

interface CustomizationSectionProps {
  selectedCoverStyle: string
  onCoverStyleChange: (id: string) => void
  dedication: string
  onDedicationChange: (value: string) => void
  extraCopies: number
  onExtraCopiesChange: (value: number) => void
}

export function CustomizationSection({
  selectedCoverStyle,
  onCoverStyleChange,
  dedication,
  onDedicationChange,
  extraCopies,
  onExtraCopiesChange,
}: CustomizationSectionProps) {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Cover style selection */}
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-bold text-foreground">{"표지 스타일 선택"}</Label>
        <div className="grid grid-cols-3 gap-3">
          {coverStyles.map((style) => {
            const isSelected = selectedCoverStyle === style.id
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onCoverStyleChange(style.id)}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary shadow-sm"
                    : "border-border hover:border-primary/40"
                )}
                aria-pressed={isSelected}
              >
                {/* Mini book thumbnail */}
                <div
                  className="relative h-16 w-12 rounded-sm overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1]})`,
                    boxShadow: "2px 2px 6px rgba(0,0,0,0.12)",
                  }}
                >
                  {/* Mini accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: style.accent }}
                  />
                  {/* Mini title lines */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-1.5">
                    <div
                      className="h-[2px] w-6 rounded-full"
                      style={{ background: style.accent, opacity: 0.6 }}
                    />
                    <div
                      className="h-[1.5px] w-4 rounded-full"
                      style={{ background: style.accent, opacity: 0.4 }}
                    />
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {style.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dedication input */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="dedication" className="text-sm font-bold text-foreground">
          {"헌정사"}
        </Label>
        <div className="flex items-center gap-0 text-sm text-muted-foreground">
          <span className="shrink-0 text-foreground/70">{"이 책을"}</span>
          <Input
            id="dedication"
            type="text"
            value={dedication}
            onChange={(e) => onDedicationChange(e.target.value)}
            className="mx-2 flex-1 border-border bg-background text-foreground"
            placeholder="소중한 가족"
          />
          <span className="shrink-0 text-foreground/70">{"에게 바칩니다"}</span>
        </div>
      </div>

      {/* Extra copies */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-bold text-foreground">{"추가 인쇄"}</Label>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{"₩25,000 / 권"}</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border text-foreground"
              onClick={() => onExtraCopiesChange(Math.max(0, extraCopies - 1))}
              disabled={extraCopies === 0}
              aria-label="추가 인쇄 수량 줄이기"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-6 text-center font-bold tabular-nums text-foreground">
              {extraCopies}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border text-foreground"
              onClick={() => onExtraCopiesChange(extraCopies + 1)}
              aria-label="추가 인쇄 수량 늘리기"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
