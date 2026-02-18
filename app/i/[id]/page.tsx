'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Interview } from '@/lib/types';
import { Header } from '@/components/Header';

const LABELS = {
  logo: '🧵 실타래',
  loading: '잠시만 기다려주세요...',
  notFound: '링크를 찾을 수 없습니다.',
  bodyLine1: '편하게 이야기해 주시면 됩니다.',
  bodyLine2: '질문을 드리면 생각나시는 대로 말씀해 주세요.',
  bodyLine3: '정답도 없고, 틀린 대답도 없습니다.',
  infoLine1: '30분 정도면 충분합니다.',
  infoLine2: '중간에 쉬셔도 되고, 다음에 이어서 하셔도 됩니다.',
  consentLabel: '대화 내용이 기록되는 것에 동의합니다.',
  startBtn: '동의하고 시작하기',
  footerNote: '이야기는 안전하게 보관되며, 요청자에게만 전달됩니다.',
  privacyTitle: '개인정보 안내',
  privacy1: '녹음된 음성과 대화 기록은 실타래 서버에 안전하게 보관됩니다.',
  privacy2: '기록은 요청자와 본인만 열람할 수 있습니다.',
  privacy3: '제3자에게 공유되지 않습니다.',
};

export default function IntervieweeLandingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/create-interview?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setInterview(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const requesterName = interview?.requester?.name || '요청자';
  const intervieweeName = interview?.interviewee?.name || '어르신';

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream">
        <p className="text-[16px] text-stone">{LABELS.loading}</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream">
        <p className="text-[16px] text-stone">{LABELS.notFound}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <Header />
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-6 py-8">

        <main className="flex flex-1 flex-col items-center justify-center py-10">
          <div className="w-full rounded-[12px] border border-mist bg-warm-white p-8 shadow-sm">
            <h1 className="font-serif text-[24px] font-bold leading-relaxed text-bark">
              {requesterName}님이<br />
              {intervieweeName}의 이야기를 듣고 싶어합니다.
            </h1>
            <hr className="my-6 border-mist" />
            <p className="text-[16px] leading-[1.8] text-leaf">
              {LABELS.bodyLine1}<br />
              {LABELS.bodyLine2}<br />
              {LABELS.bodyLine3}
            </p>
            <div className="h-4" />
            <p className="text-[15px] leading-[1.8] text-stone">
              {LABELS.infoLine1}<br />
              {LABELS.infoLine2}
            </p>
          </div>

          <div className="mt-6 w-full">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border-2 border-mist bg-warm-white checked:border-amber checked:bg-amber"
                style={{
                  backgroundImage: agreed
                    ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                    : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <span className="text-[16px] leading-snug text-bark">{LABELS.consentLabel}</span>
            </label>
            <p className="mt-1.5 pl-8 text-[13px] leading-relaxed text-stone">
              기록은 {requesterName}님과 본인만 열람할 수 있습니다.
            </p>
          </div>

          <button
            disabled={!agreed}
            onClick={() => router.push(`/interview/${id}`)}
            className="mt-6 w-full rounded-[6px] bg-amber text-[18px] font-medium text-warm-white transition-opacity disabled:opacity-40"
            style={{ height: '56px' }}
          >
            {LABELS.startBtn}
          </button>

          <div className="mt-6 w-full rounded-[12px] border border-mist bg-mist-light p-4">
            <p className="text-[13px] font-medium text-bark mb-1">{LABELS.privacyTitle}</p>
            <p className="text-[12px] text-stone leading-relaxed">
              {LABELS.privacy1}<br />
              {LABELS.privacy2}<br />
              {LABELS.privacy3}
            </p>
          </div>
        </main>

        <footer className="pb-4 pt-2 text-center">
          <p className="text-[12px] text-stone">{LABELS.footerNote}</p>
        </footer>
      </div>
      <footer className="py-4 text-center border-t border-mist">
        <a href="/" className="text-[12px] text-stone hover:text-bark transition-colors">🧵 실타래</a>
      </footer>
    </div>
  );
}
