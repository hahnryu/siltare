"use client"

import { useState } from "react"
import { Check, Copy, MessageCircle } from "lucide-react"

interface CompleteStepProps {
  name: string
  link: string
}

export function StepComplete({ name, link }: CompleteStepProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground text-balance">
          {"준비되었습니다."}
        </h2>
      </div>

      {/* Link box */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5">
          <span className="flex-1 truncate text-sm font-medium text-foreground">
            {link}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>{"복사됨"}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{"링크 복사"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-kakao px-4 py-3 text-sm font-medium text-kakao-foreground transition-all duration-200 hover:bg-kakao/90 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{"카카오톡으로 보내기"}</span>
          </button>
        </div>
      </div>

      {/* Preview card */}
      <div className="flex flex-col gap-3">
        <p className="text-center text-xs text-muted-foreground">
          {"부모님이 받게 될 메시지 미리보기"}
        </p>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ThreadIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium leading-relaxed text-foreground">
                {name ? `${name}님이 당신의 이야기를 듣고 싶어합니다.` : "OO님이 당신의 이야기를 듣고 싶어합니다."}
              </p>
              <p className="text-sm text-muted-foreground">
                {"30분이면 충분합니다."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThreadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10" />
      <path d="M22 2L13 11" />
      <path d="M16 2h6v6" />
    </svg>
  )
}
