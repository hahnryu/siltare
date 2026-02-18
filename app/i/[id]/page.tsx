'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Interview } from '@/lib/types';
import { Header } from '@/components/Header';

const LABELS = {
  loading: '잠시만 기다려주세요...',
  notFound: '링크를 찾을 수 없습니다.',
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
        <main className="flex flex-1 flex-col items-center justify-center py-8">

          {/* Warm card */}
          <div
            className="w-full rounded-[12px] border border-mist bg-warm-white p-8 shadow-sm"
            role="region"
            aria-label="이야기 안내"
          >
            <h1 className="font-serif text-[24px] font-bold leading-relaxed tracking-tight text-bark">
              {intervieweeName}님,<br />
              {requesterName}님이 이야기를 여쭙고 싶어합니다.
            </h1>

            <hr className="my-6 border-mist" />

            <div className="flex flex-col gap-3 text-[16px] leading-[1.8] text-leaf">
              <p>{requesterName}님의 부탁을 받은 AI가 질문을 드립니다.</p>
              <p>말씀하시는 동안 마이크 버튼을 꾹 누르고, 말씀을 마치시면 손가락을 떼시면 됩니다.</p>
              <p>여러 차례에 나눠서 진행하실 수 있습니다. 편하실 때 이어서 하세요.</p>
              <p className="text-[15px] text-stone">
                AI가 고유명사 등을 제대로 알아듣지 못한 경우, 추후 {requesterName}님과 함께 수정하실 수 있습니다.
              </p>
              <p className="text-[15px] text-stone">정답도 없고, 틀린 대답도 없습니다. 편하게 이야기해 주세요.</p>
            </div>
          </div>

          {/* Consent checkbox */}
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
                aria-describedby="consent-description"
              />
              <span className="text-[16px] leading-snug text-bark">{LABELS.consentLabel}</span>
            </label>
            <p
              id="consent-description"
              className="mt-1.5 pl-8 text-[13px] leading-relaxed text-stone"
            >
              기록은 {requesterName}님과 본인만 열람할 수 있습니다.
            </p>
          </div>

          {/* CTA */}
          <button
            disabled={!agreed}
            onClick={() => router.push(`/interview/${id}`)}
            className="mt-6 w-full rounded-[6px] bg-amber text-[18px] font-medium text-warm-white shadow-sm transition-opacity disabled:opacity-40"
            style={{ height: '56px' }}
            aria-label="동의하고 이야기 시작하기"
          >
            {LABELS.startBtn}
          </button>

          {/* Privacy box */}
          <div className="mt-6 w-full rounded-[12px] border border-mist bg-mist-light px-5 py-4">
            <p className="text-[13px] font-medium text-bark mb-1.5">{LABELS.privacyTitle}</p>
            <p className="text-[12px] text-stone leading-relaxed">
              {LABELS.privacy1}<br />
              {LABELS.privacy2}<br />
              {LABELS.privacy3}
            </p>
          </div>
        </main>

        <footer className="py-4 text-center">
          <p className="text-[12px] text-stone">{LABELS.footerNote}</p>
        </footer>
      </div>
    </div>
  );
}
