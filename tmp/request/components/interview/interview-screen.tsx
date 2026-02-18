"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { InterviewHeader } from "./interview-header"
import { ChatBubble } from "./chat-bubble"
import { TypingIndicator } from "./typing-indicator"
import { MicButton, type MicState } from "./mic-button"

interface Message {
  id: number
  role: "ai" | "user"
  content: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "ai",
    content:
      "안녕하세요, 어머님. 민수님이 어머님의 이야기를 듣고 싶어 보내드린 실타래입니다. 편하게 말씀해 주세요.",
  },
  {
    id: 2,
    role: "user",
    content: "아, 그래? 민수가 보냈어?",
  },
  {
    id: 3,
    role: "ai",
    content:
      "네, 민수님이 어머님의 어린 시절 이야기를 특히 궁금해하셨어요. 어머님은 어디에서 태어나셨나요?",
  },
  {
    id: 4,
    role: "user",
    content: "나는 경상북도 안동에서 태어났지. 1952년에.",
  },
  {
    id: 5,
    role: "ai",
    content:
      "안동이시군요. 안동에서의 어린 시절은 어떠셨어요? 가장 먼저 떠오르는 기억이 있으신가요?",
  },
]

const TOTAL_QUESTIONS = 8

export function InterviewScreen() {
  const [messages, setMessages] = useState<Message[]>([])
  const [showTyping, setShowTyping] = useState(false)
  const [micState, setMicState] = useState<MicState>("idle")
  const [elapsedSeconds, setElapsedSeconds] = useState(754) // start at 12:34
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messageIndexRef = useRef(0)

  // Progress based on how many messages are shown
  const answeredQuestions = messages.filter((m) => m.role === "user").length
  const progress = (answeredQuestions / TOTAL_QUESTIONS) * 100

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, showTyping])

  // Drip messages in on mount with typing indicator
  useEffect(() => {
    let cancelled = false

    function showNextMessage() {
      const idx = messageIndexRef.current
      if (idx >= INITIAL_MESSAGES.length || cancelled) return

      const msg = INITIAL_MESSAGES[idx]

      if (msg.role === "ai") {
        // Show typing indicator first
        setShowTyping(true)
        const typingDuration = Math.min(800 + msg.content.length * 15, 2000)
        setTimeout(() => {
          if (cancelled) return
          setShowTyping(false)
          setMessages((prev) => [...prev, msg])
          messageIndexRef.current++
          setTimeout(() => showNextMessage(), 600)
        }, typingDuration)
      } else {
        // User messages appear after a short pause
        setTimeout(() => {
          if (cancelled) return
          setMessages((prev) => [...prev, msg])
          messageIndexRef.current++
          setTimeout(() => showNextMessage(), 800)
        }, 1000)
      }
    }

    // Start after initial delay
    const startTimer = setTimeout(() => showNextMessage(), 500)

    return () => {
      cancelled = true
      clearTimeout(startTimer)
    }
  }, [])

  // Mic button cycles through states for demo
  const handleMicPress = useCallback(() => {
    if (micState === "idle") {
      setMicState("recording")
    } else if (micState === "recording") {
      setMicState("processing")
      setTimeout(() => {
        setMicState("idle")
      }, 2500)
    }
  }, [micState])

  return (
    <div className="flex h-dvh flex-col bg-background">
      <InterviewHeader elapsedSeconds={elapsedSeconds} progress={progress} />

      {/* Chat area */}
      <div
        ref={chatContainerRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}

        {showTyping && <TypingIndicator />}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Bottom mic area */}
      <footer className="flex-shrink-0 border-t border-border/40 bg-background pb-8 pt-5">
        <MicButton state={micState} onPress={handleMicPress} />

        {/* State toggle for demo */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {(["idle", "recording", "processing"] as MicState[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setMicState(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer ${
                micState === s
                  ? "bg-foreground text-background"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {s === "idle" ? "대기" : s === "recording" ? "녹음 중" : "처리 중"}
            </button>
          ))}
        </div>
      </footer>
    </div>
  )
}
