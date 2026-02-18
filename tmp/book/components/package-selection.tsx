"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Package {
  id: string
  name: string
  price: number
  tag: string
  tagVariant: "default" | "recommended" | "gift"
  features: string[]
  isRecommended?: boolean
}

const packages: Package[] = [
  {
    id: "digital",
    name: "디지털 아카이브",
    price: 39000,
    tag: "기본 포함",
    tagVariant: "default",
    features: [
      "음성 원본 영구 보관",
      "AI 전사본 + 요약",
      "온라인 공유 링크",
    ],
  },
  {
    id: "storybook",
    name: "스토리북",
    price: 79000,
    tag: "추천",
    tagVariant: "recommended",
    isRecommended: true,
    features: [
      "위 포함 +",
      "AI 편집 소프트커버 1권 (80-100페이지)",
      "표지 커스터마이징",
    ],
  },
  {
    id: "premium",
    name: "프리미엄 패밀리",
    price: 199000,
    tag: "선물용",
    tagVariant: "gift",
    features: [
      "위 포함 +",
      "하드커버 5권",
      "고급 박스 패키징",
      "가족 전원 디지털 공유",
    ],
  },
]

function formatPrice(price: number) {
  return `₩${price.toLocaleString("ko-KR")}`
}

interface PackageSelectionProps {
  selectedPackage: string
  onSelect: (id: string) => void
}

export function PackageSelection({ selectedPackage, onSelect }: PackageSelectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-foreground">{"패키지 선택"}</h2>

      <div className="flex flex-col gap-3">
        {packages.map((pkg) => {
          const isSelected = selectedPackage === pkg.id
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelect(pkg.id)}
              className={cn(
                "relative flex flex-col gap-3 rounded-lg border-2 p-5 text-left transition-all",
                "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-card shadow-md"
                  : "border-border bg-card/50 hover:border-primary/40"
              )}
              aria-pressed={isSelected}
            >
              {/* Tag */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    pkg.tagVariant === "recommended"
                      ? "bg-primary text-primary-foreground"
                      : pkg.tagVariant === "gift"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {pkg.tag}
                </span>
                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Name and price */}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
                <span className="text-lg font-bold text-primary tabular-nums">
                  {formatPrice(pkg.price)}
                </span>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-1.5">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Included note for digital */}
              {pkg.id === "digital" && (
                <p className="text-xs text-muted-foreground/70 italic">
                  {"(인터뷰 기본 포함)"}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { packages, formatPrice }
