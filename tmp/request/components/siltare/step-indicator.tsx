"use client"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2" role="navigation" aria-label="진행 단계">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isActive = step === currentStep
        const isCompleted = step < currentStep

        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                isActive
                  ? "w-8 bg-primary"
                  : isCompleted
                    ? "w-2 bg-primary/60"
                    : "w-2 bg-border"
              }`}
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`${step}단계${isActive ? " (현재)" : isCompleted ? " (완료)" : ""}`}
            />
          </div>
        )
      })}
    </div>
  )
}
