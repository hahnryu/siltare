import Link from 'next/link';
import { Header } from '@/components/Header';

const LABELS = {
  title: '소중한 이야기를 나눠주셔서 감사합니다.',
  sub: '오늘의 이야기는 시간이 지나도 사라지지 않습니다.',
  note: '기록은 안전하게 보관되어 요청자에게 전달됩니다.',
  home: '처음으로',
  footerBrand: '🧵 실타래',
};

export default function CompletePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-[480px] text-center">
          <span className="text-[48px] select-none">🧵</span>
          <h1 className="mt-6 font-serif text-[24px] font-bold text-bark leading-relaxed">
            {LABELS.title}
          </h1>
          <p className="mt-4 text-[16px] text-leaf leading-relaxed">{LABELS.sub}</p>
          <p className="mt-3 text-[14px] text-stone">{LABELS.note}</p>
          <Link
            href="/"
            className="mt-10 inline-flex h-[52px] items-center justify-center px-8 rounded-[6px] bg-bark text-warm-white text-[16px] font-medium hover:bg-bark-light transition-colors"
          >
            {LABELS.home}
          </Link>
        </div>
      </main>
      <footer className="py-6 text-center border-t border-mist">
        <Link href="/" className="text-[12px] text-stone hover:text-bark transition-colors">
          {LABELS.footerBrand}
        </Link>
      </footer>
    </div>
  );
}
