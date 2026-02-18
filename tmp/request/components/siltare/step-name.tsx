"use client"

import { useRef, useEffect } from "react"

interface NameStepProps {
  name: string
  onNameChange: (value: string) => void
}

export function StepName({ name, onNameChange }: NameStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground text-balance">
          {"당신의 이름을 알려주세요."}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {"인터뷰 중 '\u25CB\u25CB님의 자녀분이 보내드린 실타래입니다'라고 소개합니다."}
        </p>
      </div>

      <div className="flex flex-col gap-2 px-4">
        <label htmlFor="sender-name" className="sr-only">
          이름
        </label>
        <input
          ref={inputRef}
          id="sender-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="이름을 입력해주세요"
          className="w-full border-0 border-b-2 border-border bg-transparent px-1 pb-3 pt-2 text-center text-lg font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-200"
          autoComplete="name"
        />
      </div>
    </div>
  )
}
