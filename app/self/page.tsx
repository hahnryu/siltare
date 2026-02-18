import Link from 'next/link';
import { Header } from '@/components/Header';

const LABELS = {
  title: '내 이야기 기록하기',
  sub: '준비 중입니다.\n곧 만나요.',
  back: '돌아가기',
  footerBrand: '🧵 실타래',
};

export default function SelfPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[520px] text-center">
          <h1 className="font-serif text-[28px] font-bold text-bark">{LABELS.title}</h1>
          <p className="mt-3 text-[16px] text-stone leading-relaxed whitespace-pre-line">{LABELS.sub}</p>
          <Link
            href="/"
            className="mt-8 inline-block text-[15px] text-amber underline underline-offset-2"
          >
            {LABELS.back}
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
