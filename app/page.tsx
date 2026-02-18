import Link from 'next/link';
import { Header } from '@/components/Header';

const LABELS = {
  logo: '🧵',
  brandName: '실타래',
  tagline: '이야기가 술술.',
  sub: '귀한 분의 삶을 AI와 함께 풀어냅니다.',
  descriptionLines: [
    '부모님에게, 스승에게, 친구에게, 혹은 나 자신에게.',
    '링크 하나를 보내면, AI가 생애를 묻고 기록하고 정리합니다.',
    '어린 시절, 견뎌온 것, 물려주고 싶은 것.',
    '당신이 차마 묻지 못한 질문을 대신 묻습니다.',
  ],
  ctaPrimary: '누군가의 이야기를 듣고 싶어요',
  ctaSecondary: '내 이야기를 남기고 싶어요',
  bottom: '그 분이 아직 곁에 계실 때, 더 늦기 전에 남겨두세요.',
  footerBrand: '실타래 Siltare',
  footerSub: 'Human-Origin Memory Protocol의 첫 번째 애플리케이션.',
  footerCredit: 'A NodeONE Product',
  footerCollab: 'In Collaboration with 뿌리깊은나무 연구소 rooted.center',
  admin: '관리자',
};

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-[520px] flex-col items-center gap-12">

          {/* Hero */}
          <section className="flex flex-col items-center text-center">
            <span className="text-[48px] leading-none select-none" role="img" aria-label="실타래 로고">
              {LABELS.logo}
            </span>
            <h1 className="mt-6 font-serif text-[36px] font-bold leading-tight text-bark text-balance">
              {LABELS.brandName}
            </h1>
            <p className="mt-3 text-[20px] leading-relaxed text-leaf">{LABELS.tagline}</p>
            <p className="mt-2 text-[18px] leading-relaxed text-leaf">{LABELS.sub}</p>
          </section>

          {/* Description */}
          <section className="mx-auto max-w-[400px] text-center">
            <p className="text-[16px] leading-relaxed text-stone">
              {LABELS.descriptionLines[0]}<br />
              {LABELS.descriptionLines[1]}<br />
              {LABELS.descriptionLines[2]}<br />
              {LABELS.descriptionLines[3]}
            </p>
          </section>

          {/* CTA */}
          <section className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col gap-3">
              <Link
                href="/request"
                className="flex h-[56px] w-full items-center justify-center rounded-[6px] bg-bark text-[18px] font-medium text-warm-white transition-colors hover:bg-bark-light"
              >
                {LABELS.ctaPrimary}
              </Link>
              <Link
                href="/self"
                className="flex h-[48px] w-full items-center justify-center rounded-[6px] border border-mist bg-warm-white text-[16px] font-medium text-bark transition-colors hover:bg-mist-light"
              >
                {LABELS.ctaSecondary}
              </Link>
            </div>
            <p className="mt-6 text-center text-[14px] leading-relaxed text-stone">{LABELS.bottom}</p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-20 md:mt-24">
          <footer className="flex flex-col items-center gap-1 text-center">
            <Link href="/" className="text-[13px] font-medium text-leaf hover:text-bark transition-colors">
              {LABELS.logo} {LABELS.footerBrand}
            </Link>
            <p className="text-[12px] text-stone">{LABELS.footerSub}</p>
            <p className="text-[12px] text-stone">{LABELS.footerCredit}</p>
            <p className="text-[12px] text-stone">{LABELS.footerCollab}</p>
            <Link href="/dashboard" className="mt-3 text-[11px] text-stone/60 hover:text-stone transition-colors">
              {LABELS.admin}
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
}
