'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';

const LABELS = {
  title: '소중한 이야기를 나눠주셔서 감사합니다.',
  sub: '오늘의 이야기는 시간이 지나도 사라지지 않습니다.',
  note: '기록은 안전하게 보관되어 요청자에게 전달됩니다.',
  archiveBtn: '이야기 기록 보기',
  homeBtn: '처음으로',
};

export default function CompletePage() {
  const { id } = useParams<{ id: string }>();

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

          <div className="mt-10 flex flex-col gap-3">
            <Link
              href={`/archive/${id}`}
              className="inline-flex h-[52px] w-full items-center justify-center rounded-[6px] bg-bark text-[16px] font-medium text-warm-white transition-colors hover:bg-bark-light"
            >
              {LABELS.archiveBtn}
            </Link>
            <Link
              href="/"
              className="inline-flex h-[44px] w-full items-center justify-center rounded-[6px] border border-mist text-[15px] text-bark transition-colors hover:bg-mist-light"
            >
              {LABELS.homeBtn}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
