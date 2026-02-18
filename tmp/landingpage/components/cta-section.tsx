export function CTASection() {
  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          className="h-[56px] w-full rounded-[6px] bg-foreground text-[18px] font-medium text-primary-foreground transition-colors hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          누군가의 이야기를 듣고 싶어요
        </button>
        <button
          type="button"
          className="h-[48px] w-full rounded-[6px] border border-border bg-card text-[16px] font-medium text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          내 이야기를 남기고 싶어요
        </button>
      </div>
      <p className="mt-6 text-center text-[14px] leading-relaxed text-muted-text">
        그 분이 아직 곁에 계실 때, 더 늦기 전에 남겨두세요.
      </p>
    </section>
  )
}
