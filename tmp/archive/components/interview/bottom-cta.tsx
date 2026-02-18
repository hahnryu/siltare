import { BookMarked, Share2 } from "lucide-react"

export function BottomCta() {
  return (
    <section className="px-4 mt-12 pb-16">
      <div className="mx-auto max-w-2xl">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Book CTA */}
          <div className="rounded-xl bg-card border border-border p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <BookMarked className="size-5 text-accent" />
              <h3 className="font-serif text-base font-bold text-foreground">
                자서전 책으로 만들기
              </h3>
            </div>
            <p className="text-sm text-[#8B7355] leading-relaxed flex-1">
              어머니의 이야기를 아름다운 책 한 권으로
            </p>
            <p className="text-sm font-semibold text-foreground mt-3">
              &#8361;79,000부터
            </p>
            <button className="mt-4 w-full rounded-md bg-foreground text-background py-2.5 text-sm font-medium transition-colors hover:bg-foreground/90">
              책 만들기
            </button>
          </div>

          {/* Share CTA */}
          <div className="rounded-xl bg-card border border-border p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="size-5 text-accent" />
              <h3 className="font-serif text-base font-bold text-foreground">
                가족에게 공유하기
              </h3>
            </div>
            <p className="text-sm text-[#8B7355] leading-relaxed flex-1">
              형제, 자매에게 이 기록을 나누세요
            </p>
            <button className="mt-4 w-full rounded-md border border-border bg-card text-foreground py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
              공유 링크 생성
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
