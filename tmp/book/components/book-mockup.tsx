"use client"

import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export function BookMockup() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* 3D Book */}
      <div className="perspective-[1200px]" style={{ perspective: "1200px" }}>
        <div
          className="relative w-56 h-80 md:w-64 md:h-[22rem]"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateY(-18deg) rotateX(2deg)",
          }}
        >
          {/* Book spine */}
          <div
            className="absolute left-0 top-0 h-full w-6 origin-left"
            style={{
              transform: "rotateY(90deg) translateZ(-12px)",
              background: "linear-gradient(to right, oklch(0.55 0.12 55), oklch(0.62 0.13 58))",
            }}
          />

          {/* Book cover (front) */}
          <div
            className="absolute inset-0 rounded-r-sm overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              boxShadow:
                "6px 6px 20px rgba(0,0,0,0.18), 2px 2px 6px rgba(0,0,0,0.1), inset -2px 0 4px rgba(0,0,0,0.05)",
            }}
          >
            {/* Cover background */}
            <div className="absolute inset-0 bg-[oklch(0.96_0.02_80)]" />

            {/* Subtle texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120,90,50,0.1) 2px, rgba(120,90,50,0.1) 4px)",
              }}
            />

            {/* Top amber accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary opacity-60" />

            {/* Content */}
            <div className="relative flex flex-col items-center justify-between h-full px-6 py-8">
              {/* Top decorative element */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-px bg-primary/40" />
                <div className="w-12 h-px bg-primary/30" />
              </div>

              {/* Title section */}
              <div className="flex flex-col items-center gap-3 text-center">
                <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-foreground/90">
                  {"어머니의 이야기"}
                </h2>
                <div className="w-10 h-px bg-primary/50" />
                <p className="text-xs text-muted-foreground tracking-widest font-light">
                  {"김영순, 1952-2026"}
                </p>
              </div>

              {/* Bottom branding */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-px bg-primary/30" />
                <p className="text-[10px] text-muted-foreground/70 tracking-[0.2em] uppercase">
                  {"실타래 × 가족의 기록"}
                </p>
              </div>
            </div>
          </div>

          {/* Book pages (right edge) */}
          <div
            className="absolute right-0 top-1 bottom-1 w-3 origin-right"
            style={{
              transform: "rotateY(90deg)",
              background:
                "repeating-linear-gradient(to bottom, #f5f0e8 0px, #f5f0e8 1px, #ebe5da 1px, #ebe5da 2px)",
              boxShadow: "2px 0 4px rgba(0,0,0,0.08)",
            }}
          />

          {/* Bottom page edge */}
          <div
            className="absolute bottom-0 left-2 right-0 h-2 origin-bottom"
            style={{
              transform: "rotateX(90deg)",
              background:
                "repeating-linear-gradient(to right, #f5f0e8 0px, #f5f0e8 1px, #ebe5da 1px, #ebe5da 2px)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          />
        </div>
      </div>

      {/* Preview button */}
      <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-secondary">
        <Eye className="h-4 w-4" />
        {"미리보기"}
      </Button>
    </div>
  )
}
