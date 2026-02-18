'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recommendedQuestions } from '@/lib/questions';
import { Header } from '@/components/Header';
import { RelationshipSelector } from '@/components/RelationshipSelector';
const AGE_GROUPS = ['50대', '60대', '70대', '80대 이상'];

const LABELS = {
  logo: '🧵 실타래',
  title: '이야기 초대장 만들기',
  step1Title: '누구의 이야기를 듣고 싶으세요?',
  step2Title: '어르신에 대해 알려주세요',
  step3Title: '어떤 이야기를 듣고 싶으세요?',
  step4Title: '연락처를 남겨주세요',
  intervieweeNameLabel: '성함',
  intervieweeNamePlaceholder: '예: 어머니, 김영순, 박 선생님',
  ageGroupLabel: '연령대 (선택)',
  customContextLabel: '직접 입력 (선택)',
  customContextPlaceholder: '더 궁금한 것이 있으시면 적어주세요',
  requesterNameLabel: '성함',
  requesterNamePlaceholder: '예: 민수',
  requesterEmailLabel: '이메일',
  requesterEmailPlaceholder: '결과를 받을 이메일',
  next: '다음',
  prev: '이전',
  submit: '실타래 만들기',
  submitting: '만드는 중...',
  resultTitle: '실타래가 준비되었습니다.',
  resultSub: '아래 링크를 어르신께 보내주세요.',
  resultCopy: '링크 복사',
  resultCopied: '복사됨',
  home: '처음으로',
  error: '링크 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.',
};

export default function RequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [relationship, setRelationship] = useState('');
  const [intervieweeName, setIntervieweeName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [customContext, setCustomContext] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const questions = recommendedQuestions[relationship] || recommendedQuestions['부모님'];

  const toggleQuestion = (q: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q]
    );
  };

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
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Result screen
  if (step === 5) {
    return (
      <div className="flex min-h-dvh flex-col bg-cream">
        <Header />
        <div className="mx-auto w-full max-w-[480px] px-6 py-8">
          <div className="rounded-[12px] border border-mist bg-warm-white p-8 shadow-sm text-center">
            <div className="text-[40px] mb-4">🧵</div>
            <h1 className="font-serif text-[24px] font-bold text-bark mb-2">{LABELS.resultTitle}</h1>
            <p className="text-[15px] text-stone mb-6">{LABELS.resultSub}</p>
            <div className="rounded-[6px] border border-mist bg-cream px-4 py-3 font-mono text-[13px] text-bark break-all mb-4">
              {generatedLink}
            </div>
            <button
              onClick={copyLink}
              className="w-full h-[52px] rounded-[6px] bg-bark text-[16px] font-medium text-warm-white transition-colors hover:bg-bark-light mb-3"
            >
              {copied ? LABELS.resultCopied : LABELS.resultCopy}
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full h-[44px] rounded-[6px] border border-mist text-[15px] text-bark transition-colors hover:bg-mist-light"
            >
              {LABELS.home}
            </button>
          </div>
        </div>
        <footer className="py-6 text-center border-t border-mist mt-auto">
          <a href="/" className="text-[12px] text-stone hover:text-bark transition-colors">🧵 실타래</a>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <Header />
      <div className="mx-auto w-full max-w-[480px] px-6 py-8">

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-amber' : 'bg-mist'}`}
            />
          ))}
        </div>

        <h1 className="font-serif text-[22px] font-bold text-bark mb-6">
          {step === 1 && LABELS.step1Title}
          {step === 2 && LABELS.step2Title}
          {step === 3 && LABELS.step3Title}
          {step === 4 && LABELS.step4Title}
        </h1>

        {/* Step 1: Relationship */}
        {step === 1 && (
          <RelationshipSelector selected={relationship} onChange={setRelationship} />
        )}

        {/* Step 2: Interviewee info */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[15px] font-medium text-bark mb-2">{LABELS.intervieweeNameLabel}</label>
              <input
                type="text"
                value={intervieweeName}
                onChange={(e) => setIntervieweeName(e.target.value)}
                placeholder={LABELS.intervieweeNamePlaceholder}
                className="w-full h-[52px] rounded-[6px] border border-mist bg-warm-white px-4 text-[16px] text-bark placeholder:text-stone focus:outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-[15px] font-medium text-bark mb-2">{LABELS.ageGroupLabel}</label>
              <div className="flex gap-2 flex-wrap">
                {AGE_GROUPS.map((ag) => (
                  <button
                    key={ag}
                    onClick={() => setAgeGroup(ageGroup === ag ? '' : ag)}
                    className={`px-4 h-[40px] rounded-[6px] border text-[15px] transition-all ${
                      ageGroup === ag
                        ? 'border-amber bg-amber/10 text-bark'
                        : 'border-mist bg-warm-white text-stone hover:border-amber/50'
                    }`}
                  >
                    {ag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Context */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {questions.map((q) => (
                <button
                  key={q}
                  onClick={() => toggleQuestion(q)}
                  className={`w-full text-left px-4 py-3 rounded-[12px] border text-[16px] transition-all ${
                    selectedQuestions.includes(q)
                      ? 'border-amber bg-amber/10 text-bark'
                      : 'border-mist bg-warm-white text-bark hover:border-amber/50'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-[15px] font-medium text-bark mb-2">{LABELS.customContextLabel}</label>
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
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[15px] font-medium text-bark mb-2">{LABELS.requesterNameLabel}</label>
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder={LABELS.requesterNamePlaceholder}
                className="w-full h-[52px] rounded-[6px] border border-mist bg-warm-white px-4 text-[16px] text-bark placeholder:text-stone focus:outline-none focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-[15px] font-medium text-bark mb-2">{LABELS.requesterEmailLabel}</label>
              <input
                type="email"
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                placeholder={LABELS.requesterEmailPlaceholder}
                className="w-full h-[52px] rounded-[6px] border border-mist bg-warm-white px-4 text-[16px] text-bark placeholder:text-stone focus:outline-none focus:border-amber"
              />
            </div>
            {error && <p className="text-[14px] text-red-600">{error}</p>}
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 h-[52px] rounded-[6px] border border-mist text-[16px] text-bark transition-colors hover:bg-mist-light"
            >
              {LABELS.prev}
            </button>
          )}
          {step < 4 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={(step === 1 && !relationship) || (step === 2 && !intervieweeName.trim())}
              className="flex-1 h-[52px] rounded-[6px] bg-bark text-[16px] font-medium text-warm-white transition-colors hover:bg-bark-light disabled:opacity-40"
            >
              {LABELS.next}
            </button>
          )}
          {step === 4 && (
            <button
              onClick={handleSubmit}
              disabled={!requesterName.trim() || !requesterEmail.trim() || submitting}
              className="flex-1 h-[52px] rounded-[6px] bg-amber text-[16px] font-medium text-warm-white transition-colors hover:bg-amber-light disabled:opacity-40"
            >
              {submitting ? LABELS.submitting : LABELS.submit}
            </button>
          )}
        </div>
      </div>
      <footer className="py-6 text-center border-t border-mist mt-auto">
        <a href="/" className="text-[12px] text-stone hover:text-bark transition-colors">🧵 실타래</a>
      </footer>
    </div>
  );
}
