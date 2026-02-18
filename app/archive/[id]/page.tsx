import Link from 'next/link';
import { getInterview } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArchiveView } from '@/components/ArchiveView';

export default async function ArchivePage({ params }: { params: { id: string } }) {
  const interview = await getInterview(params.id);

  // ── Not found ────────────────────────────────────────────────────────────
  if (!interview) {
    return (
      <div className="flex min-h-svh flex-col bg-cream">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="font-serif text-[26px] font-bold text-bark">이 기록을 찾을 수 없습니다.</p>
          <p className="mt-3 text-[16px] text-stone">
            링크가 만료되었거나 잘못된 주소일 수 있습니다.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-[48px] items-center rounded-[6px] bg-bark px-8 text-[15px] font-medium text-warm-white transition-colors hover:bg-bark-light"
          >
            홈으로 돌아가기
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // ── In progress ───────────────────────────────────────────────────────────
  if (interview.status !== 'complete') {
    const statusLabel =
      interview.status === 'active'
        ? '진행 중인'
        : interview.status === 'paused'
        ? '잠시 멈춘'
        : '아직 시작되지 않은';

    return (
      <div className="flex min-h-svh flex-col bg-cream">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="font-serif text-[26px] font-bold text-bark">
            {statusLabel} 이야기입니다.
          </p>
          <p className="mt-3 text-[16px] leading-[1.9] text-stone">
            대화가 완료되면 이 페이지에서<br />기록과 요약을 볼 수 있습니다.
          </p>
          <p className="mt-2 text-[14px] text-stone">
            현재 {interview.messages.length}개의 메시지가 기록되어 있습니다.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-[48px] items-center rounded-[6px] border border-mist bg-warm-white px-8 text-[15px] font-medium text-bark transition-colors hover:bg-mist-light"
          >
            홈으로 돌아가기
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Complete ──────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />
      <ArchiveView interview={interview} />
      <Footer />
    </div>
  );
}
