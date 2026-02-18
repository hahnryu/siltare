export function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center">
      <span className="text-[48px] leading-none select-none" role="img" aria-label="실타래 로고">
        {"🧵"}
      </span>
      <h1 className="mt-6 font-serif text-[36px] font-bold leading-tight text-foreground text-balance">
        실타래
      </h1>
      <p className="mt-3 text-[20px] leading-relaxed text-secondary-text">
        이야기가 술술.
      </p>
      <p className="mt-2 text-[18px] leading-relaxed text-secondary-text">
        귀한 분의 삶을 AI와 함께 풀어냅니다.
      </p>
    </section>
  )
}
