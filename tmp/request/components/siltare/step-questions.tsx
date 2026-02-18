"use client"

interface QuestionsStepProps {
  selectedQuestions: string[]
  onToggle: (question: string) => void
}

const questions = [
  "어린 시절",
  "첫사랑",
  "가장 힘들었던 시기",
  "결혼 이야기",
  "자녀에게 하고 싶은 말",
  "인생의 전환점",
  "후회하는 것",
  "감사한 사람",
]

export function StepQuestions({ selectedQuestions, onToggle }: QuestionsStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground text-balance">
          {"어떤 이야기를 듣고 싶으세요?"}
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5" role="group" aria-label="질문 선택">
        {questions.map((question) => {
          const isSelected = selectedQuestions.includes(question)
          return (
            <button
              key={question}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(question)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {question}
            </button>
          )
        })}
      </div>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        {"AI가 자연스럽게 대화를 이어가며 더 깊은 이야기를 끌어냅니다."}
      </p>
    </div>
  )
}
