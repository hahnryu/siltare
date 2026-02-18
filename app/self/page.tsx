import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const LABELS = {
  emoji: '🧵',
  title: '셀프 모드 준비 중',
  sub: '곧 나의 이야기도 직접 기록할 수 있습니다.',
  notifyBtn: '알림 받기',
  backBtn: '돌아가기',
};

export default function SelfPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <span className="text-[48px] leading-none select-none" role="img" aria-label="실타래 로고">
            {LABELS.emoji}
          </span>
          <h1 className="mt-6 font-serif text-[24px] font-bold text-bark">
            {LABELS.title}
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-stone">
            {LABELS.sub}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <a
              href="mailto:hahn@nodeone.io?subject=셀프모드 알림"
              className="inline-flex h-[52px] items-center justify-center rounded-[6px] bg-bark px-8 text-[16px] font-medium text-warm-white transition-colors hover:bg-bark-light"
            >
              {LABELS.notifyBtn}
            </a>
            <Link
              href="/"
              className="text-[14px] text-stone hover:text-bark transition-colors"
            >
              {LABELS.backBtn}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
