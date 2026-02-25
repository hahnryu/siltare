'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const LABELS = {
  emoji: '🧵',
  title: '당신의 이야기를 시작합니다.',
  nameLabel: '성함을 알려주세요',
  namePlaceholder: '예: 김실타',
  startBtn: '시작하기',
  hint: '마이크 버튼 하나로 이야기하시면 됩니다.\n타이핑은 필요 없습니다.',
  errorRequired: '성함을 입력해 주세요.',
  errorCreate: '인터뷰 생성에 실패했습니다. 다시 시도해 주세요.',
};

export default function SelfPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(LABELS.errorRequired);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/create-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'self',
          interviewee: { name: name.trim() },
          context: ['자유롭게'],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create interview');
      }

      const data = await res.json();
      router.push(`/interview/${data.id}`);
    } catch (err) {
      console.error('Failed to create self interview:', err);
      setError(LABELS.errorCreate);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          <div className="text-center">
            <span
              className="text-[56px] leading-none select-none"
              role="img"
              aria-label="실타래 로고"
            >
              {LABELS.emoji}
            </span>
            <h1 className="mt-6 font-serif text-[24px] font-bold leading-snug text-bark">
              {LABELS.title}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-10">
            <div>
              <label htmlFor="name" className="block text-[15px] font-medium text-bark">
                {LABELS.nameLabel}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={LABELS.namePlaceholder}
                disabled={loading}
                className="mt-2 w-full rounded-[6px] border border-mist bg-warm-white px-4 py-3 text-[16px] text-bark placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-amber disabled:opacity-50"
              />
            </div>

            {error && (
              <p className="mt-3 text-[14px] text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-[56px] w-full items-center justify-center rounded-[6px] bg-bark text-[17px] font-medium text-warm-white shadow-sm transition-colors hover:bg-bark-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber disabled:opacity-50"
            >
              {loading ? '준비 중...' : LABELS.startBtn}
            </button>

            <p className="mt-6 whitespace-pre-line text-center text-[14px] leading-relaxed text-stone">
              {LABELS.hint}
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
