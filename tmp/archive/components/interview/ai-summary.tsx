import { Sparkles } from "lucide-react"

interface SummaryParagraph {
  text: string
  timestamp: string
}

const summaryParagraphs: SummaryParagraph[] = [
  {
    text: "김영순님은 1952년 경북 안동에서 태어났습니다. 6남매 중 셋째로, 어린 시절 낙동강에서 물고기를 잡으며 놀았던 기억을 가장 먼저 떠올렸습니다. 집 앞 감나무 아래에서 할머니가 들려주신 옛이야기가 가장 따뜻한 기억이라고 합니다.",
    timestamp: "03:24",
  },
  {
    text: "17살에 서울로 올라와 봉제공장에서 일하며 야간학교를 다녔습니다. 고향을 떠나는 날, 어머니가 싸주신 보자기 하나가 전 재산이었다고 합니다. 그 시절 공장 동료들과 나누던 김밥 한 줄의 맛을 아직도 기억한다고 했습니다.",
    timestamp: "10:15",
  },
  {
    text: "스물네 살에 남편을 만나 결혼했고, 두 아이를 키우며 작은 분식집을 운영했습니다. 새벽 4시에 일어나 육수를 끓이던 날들이 힘들었지만, 아이들이 가게에서 숙제하던 모습을 떠올리며 미소를 지었습니다.",
    timestamp: "17:42",
  },
  {
    text: "IMF 때 가게를 접어야 했던 순간이 인생에서 가장 힘든 시기였다고 합니다. 하지만 그때 가족이 함께 견뎌낸 경험이 지금의 단단함을 만들었다고 말했습니다. 마지막으로 자녀에게 전하는 말에서는 \"네가 건강하고 행복하면, 엄마는 그것만으로 충분하다\"는 메시지를 남겼습니다.",
    timestamp: "25:30",
  },
]

export function AiSummary() {
  return (
    <section className="px-4 mt-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="size-4 text-accent" />
          <h2 className="font-serif text-xl font-bold text-foreground">
            AI 요약
          </h2>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 md:p-8">
          <div className="space-y-5">
            {summaryParagraphs.map((para, i) => (
              <div key={i} className="group">
                <p className="text-foreground leading-relaxed text-[15px]">
                  {para.text}
                </p>
                <button
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                  aria-label={`${para.timestamp} 시점으로 이동`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                    <path d="M5 4L8 6L5 8V4Z" fill="currentColor" />
                  </svg>
                  {para.timestamp}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
