"use client"

interface RelationshipStepProps {
  selected: string | null
  onSelect: (value: string) => void
}

const relationships = [
  { label: "아버지", icon: FatherIcon },
  { label: "어머니", icon: MotherIcon },
  { label: "할아버지", icon: GrandfatherIcon },
  { label: "할머니", icon: GrandmotherIcon },
  { label: "배우자", icon: SpouseIcon },
  { label: "기타", icon: OtherIcon },
]

function FatherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M16 5V3" />
    </svg>
  )
}

function MotherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M11 7c0-2 2.239-4 5-4s5 2 5 4" />
    </svg>
  )
}

function GrandfatherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M12 13h8" />
      <path d="M16 3v2" />
    </svg>
  )
}

function GrandmotherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M10 8c0-3 2.686-5 6-5s6 2 6 5" />
      <path d="M12 13h8" />
    </svg>
  )
}

function SpouseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="10" r="4" />
      <circle cx="21" cy="10" r="4" />
      <path d="M3 27c0-4.418 3.582-8 8-8 1.5 0 2.91.42 4.1 1.14" />
      <path d="M29 27c0-4.418-3.582-8-8-8-1.5 0-2.91.42-4.1 1.14" />
    </svg>
  )
}

function OtherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="12" r="5" />
      <path d="M8 28c0-4.418 3.582-8 8-8s8 3.582 8 8" />
      <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function StepRelationship({ selected, onSelect }: RelationshipStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground text-balance">
          {"누구의 이야기를 기록할까요?"}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="관계 선택">
        {relationships.map(({ label, icon: Icon }) => {
          const isSelected = selected === label
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(label)}
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 bg-card px-4 py-6 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-transparent hover:border-border hover:bg-secondary/50"
              }`}
            >
              <Icon
                className={`h-8 w-8 transition-colors duration-200 ${
                  isSelected ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isSelected ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
