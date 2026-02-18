import { Clock, FileText, List } from "lucide-react"

export function HeroSummary() {
  return (
    <section className="px-4 pt-12 pb-8 md:pt-20 md:pb-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-muted-foreground text-sm tracking-wide">
          2026년 2월 15일 기록
        </p>
        <h1 className="font-serif mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
          어머니의 이야기
        </h1>
        <p className="mt-3 text-lg text-[#8B7355] md:text-xl">
          김영순, 1952년 안동 출생
        </p>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground md:gap-8">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-accent" />
            <span>32분 14초</span>
          </div>
          <div className="h-4 w-px bg-border" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-accent" />
            <span>4,280자</span>
          </div>
          <div className="h-4 w-px bg-border" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <List className="size-4 text-accent" />
            <span>12개 주제</span>
          </div>
        </div>
      </div>
    </section>
  )
}
