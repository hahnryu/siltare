'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { recommendedQuestions } from '@/lib/questions';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const TOTAL_STEPS = 4;

const AGE_GROUPS = ['50대', '60대', '70대', '80대 이상'];

const LABELS = {
  subtitle: '부모님께 실타래 보내기',
  step1Title: '누구의 이야기를 기록할까요?',
  step2Title: '어르신에 대해 알려주세요',
  step2Sub: '성함과 연령대를 입력해주세요.',
  step3Title: '어떤 이야기를 듣고 싶으세요?',
  step3Sub: 'AI가 자연스럽게 대화를 이어가며 더 깊은 이야기를 끌어냅니다.',
  step4Title: '연락처를 남겨주세요',
  step4Sub: '인터뷰가 완료되면 결과를 이메일로 보내드립니다.',
  intervieweeNamePlaceholder: '예: 어머니, 김영순, 박 선생님',
  customContextLabel: '직접 입력 (선택)',
  customContextPlaceholder: '더 궁금한 것이 있으시면 적어주세요',
  requesterNameLabel: '성함',
  requesterNamePlaceholder: '예: 민수',
  requesterEmailLabel: '이메일',
  requesterEmailPlaceholder: '결과를 받을 이메일',
  prev: '이전',
  next: '다음',
  submit: '실타래 만들기',
  submitting: '만드는 중...',
  resultTitle: '준비되었습니다.',
  resultSub: '아래 링크를 어르신께 보내주세요.',
  resultCopy: '링크 복사',
  resultCopied: '복사됨',
  resultKakao: '카카오톡으로 보내기',
  resultPreviewSub: '어르신이 받게 될 메시지 미리보기',
  resultPreviewTime: '30분이면 충분합니다.',
  home: '처음으로',
  error: '링크 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.',
};

const RELATIONSHIPS = [
  { label: '아버지', icon: FatherIcon },
  { label: '어머니', icon: MotherIcon },
  { label: '할아버지', icon: GrandfatherIcon },
  { label: '할머니', icon: GrandmotherIcon },
  { label: '배우자', icon: SpouseIcon },
  { label: '기타', icon: OtherIcon },
];

function FatherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M16 5V3" />
    </svg>
  );
}

function MotherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M11 7c0-2 2.239-4 5-4s5 2 5 4" />
    </svg>
  );
}

function GrandfatherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M12 13h8" />
      <path d="M16 3v2" />
    </svg>
  );
}

function GrandmotherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M10 8c0-3 2.686-5 6-5s6 2 6 5" />
      <path d="M12 13h8" />
    </svg>
  );
}

function SpouseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="10" r="4" />
      <circle cx="21" cy="10" r="4" />
      <path d="M3 27c0-4.418 3.582-8 8-8 1.5 0 2.91.42 4.1 1.14" />
      <path d="M29 27c0-4.418-3.582-8-8-8-1.5 0-2.91.42-4.1 1.14" />
    </svg>
  );
}

function OtherIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="12" r="5" />
      <path d="M8 28c0-4.418 3.582-8 8-8s8 3.582 8 8" />
      <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2" role="navigation" aria-label="진행 단계">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isCompleted = step < current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                isActive
                  ? 'w-8 bg-bark'
                  : isCompleted
                  ? 'w-2 bg-bark/60'
                  : 'w-2 bg-mist'
              }`}
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin={1}
              aria-valuemax={total}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function RequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);

  const [relationship, setRelationship] = useState('');
  const [intervieweeName, setIntervieweeName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [customContext, setCustomContext] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => nameInputRef.current?.focus(), 400);
      return () => clearTimeout(t);
    }
  }, [step]);

  const questions = recommendedQuestions[relationship] || recommendedQuestions['부모님'];

  const toggleQuestion = (q: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q]
    );
  };

  const canGoNext = useCallback(() => {
    switch (step) {
      case 1: return relationship !== '';
      case 2: return intervieweeName.trim().length > 0;
      case 3: return true;
      default: return false;
    }
  }, [step, relationship, intervieweeName]);

  const goToStep = useCallback((newStep: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(newStep > step ? 'forward' : 'backward');
    setStep(newStep);
    setTimeout(() => setIsAnimating(false), 400);
  }, [step, isAnimating]);

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS && canGoNext()) goToStep(step + 1);
  }, [step, canGoNext, goToStep]);

  const handleBack = useCallback(() => {
    if (step > 1) goToStep(step - 1);
  }, [step, goToStep]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/create-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'invite',
          requester: { name: requesterName, email: requesterEmail, relationship },
          interviewee: { name: intervieweeName, ageGroup: ageGroup || undefined },
          context: selectedQuestions.length > 0 ? selectedQuestions : questions.slice(0, 3),
          context2: customContext || undefined,
        }),
      });
      const data = await res.json();
      if (data.link) {
        setGeneratedLink(data.link);
        if (data.id) setGeneratedId(data.id);
        setStep(5);
      } else {
        setError(LABELS.error);
      }
    } catch {
      setError(LABELS.error);
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
    } catch {
      const el = document.createElement('textarea');
      el.value = generatedLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Result screen
  if (step === 5) {
    return (
      <div className="flex min-h-dvh flex-col bg-cream">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-md flex flex-col gap-8">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="font-serif text-2xl font-semibold tracking-tight text-bark">
                {LABELS.resultTitle}
              </h1>
            </div>

            {/* Link box */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-mist bg-warm-white px-4 py-3.5">
                <span className="flex-1 truncate text-sm font-medium text-bark">{generatedLink}</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[6px] bg-bark px-4 py-3 text-sm font-medium text-warm-white transition-colors hover:bg-bark-light cursor-pointer"
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span>{LABELS.resultCopied}</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      <span>{LABELS.resultCopy}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-[6px] px-4 py-3 text-sm font-medium cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#FEE500', color: '#191919' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span>{LABELS.resultKakao}</span>
                </button>
              </div>
            </div>

            {/* Preview card */}
            <div className="flex flex-col gap-3">
              <p className="text-center text-xs text-stone">{LABELS.resultPreviewSub}</p>
              <div className="rounded-xl border border-mist bg-warm-white p-6 shadow-sm">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber/10">
                    <span className="text-[20px]">🧵</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-base font-medium leading-relaxed text-bark">
                      {intervieweeName
                        ? `${intervieweeName}님, ${requesterName}님이 이야기를 여쭙고 싶어합니다.`
                        : `${requesterName}님이 이야기를 여쭙고 싶어합니다.`}
                    </p>
                    <p className="text-sm text-stone">편하실 때 시작하시면 됩니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push(`/archive/${generatedId}`)}
              className="w-full h-[52px] rounded-[6px] bg-bark text-[16px] font-medium text-warm-white transition-colors hover:bg-bark-light"
            >
              녹취 현황 확인하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full h-[40px] text-[14px] text-stone/70 hover:text-stone transition-colors"
            >
              처음으로 돌아가기
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stepTitles = [LABELS.step1Title, LABELS.step2Title, LABELS.step3Title, LABELS.step4Title];

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <Header />

      {/* Step header */}
      <div className="flex flex-col items-center gap-3 px-6 pb-4 pt-5">
        <p className="text-xs text-stone">{LABELS.subtitle}</p>
        <StepIndicator current={step} total={TOTAL_STEPS} />
      </div>

      {/* Step content */}
      <main className="flex flex-1 flex-col px-6 py-4">
        <div className="mx-auto w-full max-w-md flex-1">
          <div
            key={step}
            className={direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}
          >
            {/* Step title */}
            <div className="mb-8 flex flex-col gap-2 text-center">
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-bark text-balance">
                {stepTitles[step - 1]}
              </h2>
              {step === 2 && <p className="text-sm leading-relaxed text-stone">{LABELS.step2Sub}</p>}
              {step === 3 && <p className="text-sm leading-relaxed text-stone">{LABELS.step3Sub}</p>}
              {step === 4 && <p className="text-sm leading-relaxed text-stone">{LABELS.step4Sub}</p>}
            </div>

            {/* Step 1: Relationship */}
            {step === 1 && (
              <div
                className="grid grid-cols-2 gap-3"
                role="radiogroup"
                aria-label="관계 선택"
              >
                {RELATIONSHIPS.map(({ label, icon: Icon }) => {
                  const isSelected = relationship === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setRelationship(label)}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 bg-warm-white px-4 py-6 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-amber bg-amber/5 shadow-sm'
                          : 'border-transparent hover:border-mist hover:bg-mist-light'
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 transition-colors duration-200 ${
                          isSelected ? 'text-amber' : 'text-stone'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium transition-colors duration-200 ${
                          isSelected ? 'text-bark' : 'text-stone'
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 2: Interviewee info */}
            {step === 2 && (
              <div className="flex flex-col gap-8">
                {/* Name input - border-b only style */}
                <div className="flex flex-col gap-2 px-4">
                  <label htmlFor="interviewee-name" className="sr-only">성함</label>
                  <input
                    ref={nameInputRef}
                    id="interviewee-name"
                    type="text"
                    value={intervieweeName}
                    onChange={(e) => setIntervieweeName(e.target.value)}
                    placeholder={LABELS.intervieweeNamePlaceholder}
                    className="w-full border-0 border-b-2 border-mist bg-transparent px-1 pb-3 pt-2 text-center text-lg font-medium text-bark placeholder:text-stone/50 focus:border-amber focus:outline-none transition-colors duration-200"
                    autoComplete="name"
                  />
                </div>

                {/* Age group - pill style */}
                <div className="flex flex-col gap-3">
                  <p className="text-center text-sm text-stone">연령대 (선택)</p>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    {AGE_GROUPS.map((ag) => (
                      <button
                        key={ag}
                        type="button"
                        onClick={() => setAgeGroup(ageGroup === ag ? '' : ag)}
                        className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                          ageGroup === ag
                            ? 'border-bark bg-bark text-warm-white shadow-sm'
                            : 'border-mist bg-warm-white text-stone hover:border-bark/40 hover:text-bark'
                        }`}
                      >
                        {ag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Questions */}
            {step === 3 && (
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap justify-center gap-2.5" role="group" aria-label="질문 선택">
                  {questions.map((q) => {
                    const isSelected = selectedQuestions.includes(q);
                    return (
                      <button
                        key={q}
                        type="button"
                        role="checkbox"
                        aria-checked={isSelected}
                        onClick={() => toggleQuestion(q)}
                        className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-bark bg-bark text-warm-white shadow-sm'
                            : 'border-mist bg-warm-white text-stone hover:border-bark/40 hover:text-bark'
                        }`}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-bark">{LABELS.customContextLabel}</label>
                  <textarea
                    value={customContext}
                    onChange={(e) => setCustomContext(e.target.value)}
                    placeholder={LABELS.customContextPlaceholder}
                    rows={3}
                    className="w-full rounded-[6px] border border-mist bg-warm-white px-4 py-3 text-[16px] text-bark placeholder:text-stone focus:outline-none focus:border-amber resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Requester info */}
            {step === 4 && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 px-4">
                  <label htmlFor="requester-name" className="sr-only">{LABELS.requesterNameLabel}</label>
                  <p className="text-center text-sm text-stone mb-1">{LABELS.requesterNameLabel}</p>
                  <input
                    id="requester-name"
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder={LABELS.requesterNamePlaceholder}
                    className="w-full border-0 border-b-2 border-mist bg-transparent px-1 pb-3 pt-2 text-center text-lg font-medium text-bark placeholder:text-stone/50 focus:border-amber focus:outline-none transition-colors duration-200"
                    autoComplete="name"
                  />
                </div>

                <div className="flex flex-col gap-2 px-4">
                  <p className="text-center text-sm text-stone mb-1">{LABELS.requesterEmailLabel}</p>
                  <input
                    id="requester-email"
                    type="email"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    placeholder={LABELS.requesterEmailPlaceholder}
                    className="w-full border-0 border-b-2 border-mist bg-transparent px-1 pb-3 pt-2 text-center text-lg font-medium text-bark placeholder:text-stone/50 focus:border-amber focus:outline-none transition-colors duration-200"
                    autoComplete="email"
                  />
                </div>

                {error && <p className="text-center text-[14px] text-red-600">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="px-6 pb-8 pt-4">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 rounded-md px-4 py-3 text-sm font-medium text-stone transition-colors hover:text-bark cursor-pointer"
              aria-label="이전 단계"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span>{LABELS.prev}</span>
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex items-center gap-1.5 rounded-[6px] bg-bark px-6 py-3 text-sm font-medium text-warm-white transition-all hover:bg-bark-light disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              aria-label="다음 단계"
            >
              <span>{LABELS.next}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          )}

          {step === TOTAL_STEPS && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!requesterName.trim() || !requesterEmail.trim() || submitting}
              className="flex items-center gap-1.5 rounded-[6px] bg-amber px-6 py-3 text-sm font-medium text-warm-white transition-all hover:bg-amber-light disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              {submitting ? LABELS.submitting : LABELS.submit}
            </button>
          )}
        </div>

        {/* Step counter */}
        <p className="mt-4 text-center text-xs text-stone/60">
          {`${step} / ${TOTAL_STEPS}`}
        </p>
      </footer>
    </div>
  );
}
