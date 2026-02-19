'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

export default function DashboardLoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pw }),
      });

      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('아이디 또는 비밀번호가 틀립니다');
      }
    } catch {
      setError('연결에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />

      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-[360px]">
          <div className="mb-8 text-center">
            <span className="text-[36px]" role="img" aria-label="실타래 로고">🧵</span>
            <h1 className="mt-3 font-serif text-[24px] font-bold text-bark">
              대시보드 로그인
            </h1>
            <p className="mt-1 text-[14px] text-stone">관리자 전용 페이지입니다</p>
            <p className="mt-3 text-[13px] text-stone/60 font-mono bg-mist-light rounded-[6px] px-4 py-2">
              ID: bts &nbsp;·&nbsp; PW: arirang2026
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-[12px] border border-mist bg-warm-white p-8"
          >
            <div>
              <label
                htmlFor="admin-id"
                className="mb-1.5 block text-[13px] font-medium text-stone"
              >
                아이디
              </label>
              <input
                id="admin-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoComplete="username"
                required
                className="h-[48px] w-full rounded-[6px] border border-mist bg-cream px-4 text-[16px] text-bark focus:border-amber focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-pw"
                className="mb-1.5 block text-[13px] font-medium text-stone"
              >
                비밀번호
              </label>
              <input
                id="admin-pw"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="current-password"
                required
                className="h-[48px] w-full rounded-[6px] border border-mist bg-cream px-4 text-[16px] text-bark focus:border-amber focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-center text-[13px] text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !id.trim() || !pw.trim()}
              className="mt-1 h-[48px] w-full rounded-[6px] bg-bark text-[15px] font-medium text-warm-white transition-colors hover:bg-bark-light disabled:opacity-40"
            >
              {loading ? '확인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
