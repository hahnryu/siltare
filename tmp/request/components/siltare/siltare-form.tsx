"use client"

import { useState, useCallback } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { StepIndicator } from "./step-indicator"
import { StepRelationship } from "./step-relationship"
import { StepName } from "./step-name"
import { StepQuestions } from "./step-questions"
import { StepComplete } from "./step-complete"

const TOTAL_STEPS = 4

const STEP_LABELS = ["관계 선택", "당신의 이름", "질문 선택", "링크 생성 완료"]

function generateLink() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let id = ""
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return `siltare.app/i/${id}`
}

export function SiltareForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [isAnimating, setIsAnimating] = useState(false)

  // Form state
  const [relationship, setRelationship] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([
    "어린 시절",
    "자녀에게 하고 싶은 말",
  ])
  const [generatedLink] = useState(() => generateLink())

  const canGoNext = useCallback(() => {
    switch (currentStep) {
      case 1:
        return relationship !== null
      case 2:
        return name.trim().length > 0
      case 3:
        return selectedQuestions.length > 0
      default:
        return false
    }
  }, [currentStep, relationship, name, selectedQuestions])

  const goToStep = useCallback(
    (newStep: number) => {
      if (isAnimating) return
      setIsAnimating(true)
      setDirection(newStep > currentStep ? "forward" : "backward")
      setCurrentStep(newStep)
      setTimeout(() => setIsAnimating(false), 400)
    },
    [currentStep, isAnimating]
  )

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS && canGoNext()) {
      goToStep(currentStep + 1)
    }
  }, [currentStep, canGoNext, goToStep])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }, [currentStep, goToStep])

  const toggleQuestion = useCallback((question: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    )
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex flex-col items-center gap-6 px-6 pb-4 pt-8">
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-serif text-lg font-semibold tracking-tight text-foreground">
            {"실타래"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {"부모님께 실타래 보내기"}
          </p>
        </div>
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </header>

      {/* Step content */}
      <main className="flex flex-1 flex-col px-6 py-6">
        <div className="mx-auto w-full max-w-md flex-1">
          <div
            key={currentStep}
            className={`animate-in fade-in duration-400 ${
              direction === "forward" ? "slide-in-from-right-4" : "slide-in-from-left-4"
            }`}
          >
            {currentStep === 1 && (
              <StepRelationship
                selected={relationship}
                onSelect={setRelationship}
              />
            )}
            {currentStep === 2 && (
              <StepName name={name} onNameChange={setName} />
            )}
            {currentStep === 3 && (
              <StepQuestions
                selectedQuestions={selectedQuestions}
                onToggle={toggleQuestion}
              />
            )}
            {currentStep === 4 && (
              <StepComplete name={name} link={generatedLink} />
            )}
          </div>
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="px-6 pb-8 pt-4">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4">
          {currentStep > 1 && currentStep < 4 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 rounded-md px-4 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground cursor-pointer"
              aria-label="이전 단계"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{"이전"}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex items-center gap-1.5 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              aria-label="다음 단계"
            >
              <span>{"다음"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Step label */}
        <p className="mt-4 text-center text-xs text-muted-foreground/60">
          {`${currentStep} / ${TOTAL_STEPS} — ${STEP_LABELS[currentStep - 1]}`}
        </p>
      </footer>
    </div>
  )
}
