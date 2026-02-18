'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Interview } from '@/lib/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function useFadeIn() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' },
    );
    const elements = document.querySelectorAll('.fade-up');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function formatKoreanDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 기록`;
  } catch {
    return '기록';
  }
}

function fmtTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Inline audio player (per user message) ───────────────────────────────────

function MsgAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setIsPlaying(false);
    const onErr = () => setHasError(true);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onErr);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onErr);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setHasError(true));
      setIsPlaying(true);
    }
  }

  if (hasError) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-2 flex items-center gap-2">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={toggle}
        aria-label={isPlaying ? '일시정지' : '재생'}
        className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-amber/10 text-amber transition-colors hover:bg-amber/20"
      >
        {isPlaying ? (
          <span className="flex gap-[2px]">
            <span className="h-[10px] w-[2px] rounded-sm bg-current" />
            <span className="h-[10px] w-[2px] rounded-sm bg-current" />
          </span>
        ) : (
          <span className="ml-[1px] block border-y-[5px] border-l-[9px] border-r-0 border-solid border-y-transparent border-l-current" />
        )}
      </button>
      <div className="flex flex-col gap-1">
        <div className="h-[3px] w-24 overflow-hidden rounded-full bg-mist">
          <div
            className="h-full rounded-full bg-amber transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-stone">
          {fmtTime(currentTime)} / {fmtTime(duration)}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ArchiveView({ interview }: { interview: Interview }) {
  const router = useRouter();
  const [linkCopied, setLinkCopied] = useState(false);
  useFadeIn();

  const { id, interviewee, requester, mode, messages, summary, entities, transcript, createdAt } =
    interview;

  const charCount = transcript?.replace(/\s/g, '').length
    ?? messages.reduce((sum, m) => sum + m.content.length, 0);

  const entityCount = entities
    ? (entities.persons?.length ?? 0) +
      (entities.places?.length ?? 0) +
      (entities.times?.length ?? 0) +
      (entities.events?.length ?? 0)
    : 0;

  const userMsgCount = messages.filter((m) => m.role === 'user').length;

  function handleShare() {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }).catch(() => {});
  }

  const subtitle =
    mode === 'invite' && requester
      ? `${requester.name}님이 요청한 이야기`
      : '본인이 직접 기록한 이야기';

  return (
    <main className="flex-1 py-8 md:py-14">

      {/* Back link */}
      <div className="mx-auto max-w-2xl px-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[14px] text-stone transition-colors hover:text-bark"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          돌아가기
        </button>
      </div>

      {/* ── Hero ── */}
      <section className="fade-up mx-auto mt-8 max-w-2xl px-5 text-center">
        <p className="text-[13px] tracking-wide text-stone">{formatKoreanDate(createdAt)}</p>
        <h1 className="mt-4 font-serif text-[32px] font-bold leading-tight text-bark md:text-[42px]">
          {interviewee.name}의 이야기
        </h1>
        <p className="mt-2 text-[17px] text-leaf">{subtitle}</p>

        {/* Stats row */}
        <div className="mt-8 flex items-center justify-center gap-6 text-[13px] text-stone md:gap-8">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {userMsgCount}회 대화
          </span>
          <span className="h-4 w-px bg-mist" aria-hidden="true" />
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {charCount.toLocaleString('ko-KR')}자
          </span>
          {entityCount > 0 && (
            <>
              <span className="h-4 w-px bg-mist" aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber">
                  <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                {entityCount}개 인물·장소
              </span>
            </>
          )}
        </div>
      </section>

      {/* ── AI Summary ── */}
      <section className="fade-up mx-auto mt-10 max-w-2xl px-5">
        <div className="mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
          </svg>
          <h2 className="font-serif text-[20px] font-bold text-bark">AI 요약</h2>
        </div>
        <div className="rounded-[12px] border border-mist bg-warm-white p-6 md:p-8">
          {summary ? (
            <p className="whitespace-pre-line text-[15px] leading-[1.9] text-bark">{summary}</p>
          ) : (
            <p className="text-[15px] text-stone">요약을 생성하는 중입니다...</p>
          )}
        </div>
      </section>

      {/* ── Transcript ── */}
      <section className="fade-up mx-auto mt-10 max-w-2xl px-5">
        <div className="mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <h2 className="font-serif text-[20px] font-bold text-bark">전체 대화</h2>
        </div>

        <div className="flex flex-col gap-4">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-[12px] px-4 py-3 ${
                    isUser
                      ? 'rounded-tr-[4px] border border-mist bg-warm-white'
                      : 'rounded-tl-[4px] bg-mist-light'
                  }`}
                >
                  {!isUser && (
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-amber">
                      실타래
                    </p>
                  )}
                  <p className="text-[15px] leading-[1.8] text-bark">{msg.content}</p>
                  {msg.timestamp && (
                    <p className="mt-1.5 text-[11px] text-stone/60">
                      {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {isUser && msg.audioUrl && <MsgAudioPlayer src={msg.audioUrl} />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Entities ── */}
      {entities && entityCount > 0 && (
        <section className="fade-up mx-auto mt-10 max-w-2xl px-5">
          <div className="mb-4 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber">
              <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" />
            </svg>
            <h2 className="font-serif text-[20px] font-bold text-bark">이야기 속 인물과 장소</h2>
          </div>

          <div className="flex flex-col gap-6">
            {entities.persons && entities.persons.length > 0 && (
              <div>
                <p className="mb-2 text-[12px] font-medium uppercase tracking-widest text-stone">인물</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {entities.persons.map((p, i) => (
                    <div key={i} className="rounded-[10px] border border-mist bg-warm-white px-4 py-3">
                      <p className="font-serif text-[15px] font-bold text-bark">{p.name}</p>
                      <p className="text-[12px] text-amber">{p.relation}</p>
                      <p className="mt-1 text-[13px] leading-[1.7] text-stone">{p.context}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entities.places && entities.places.length > 0 && (
              <div>
                <p className="mb-2 text-[12px] font-medium uppercase tracking-widest text-stone">장소</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {entities.places.map((p, i) => (
                    <div key={i} className="rounded-[10px] border border-mist bg-warm-white px-4 py-3">
                      <p className="font-serif text-[15px] font-bold text-bark">{p.name}</p>
                      {p.time && <p className="text-[12px] text-amber">{p.time}</p>}
                      <p className="mt-1 text-[13px] leading-[1.7] text-stone">{p.context}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {entities.events && entities.events.length > 0 && (
              <div>
                <p className="mb-2 text-[12px] font-medium uppercase tracking-widest text-stone">사건·기억</p>
                <div className="flex flex-col gap-2">
                  {entities.events.map((e, i) => (
                    <div key={i} className="rounded-[10px] border border-mist bg-warm-white px-4 py-3">
                      <p className="font-serif text-[15px] font-bold text-bark">{e.name}</p>
                      {(e.time || e.place) && (
                        <p className="text-[12px] text-amber">
                          {[e.time, e.place].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Bottom CTAs ── */}
      <section className="fade-up mx-auto mt-12 max-w-2xl px-5 pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Book CTA */}
          <div className="flex flex-col rounded-[12px] border border-mist bg-warm-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              <h3 className="font-serif text-[16px] font-bold text-bark">자서전 책으로 만들기</h3>
            </div>
            <p className="flex-1 text-[14px] leading-relaxed text-leaf">
              {interviewee.name}의 이야기를 아름다운 책 한 권으로
            </p>
            <p className="mt-3 text-[14px] font-semibold text-bark">₩79,000부터</p>
            <button
              onClick={() => router.push(`/book/${id}`)}
              className="mt-4 h-[44px] w-full rounded-[6px] bg-bark text-[14px] font-medium text-warm-white transition-colors hover:bg-bark-light"
            >
              책 만들기
            </button>
          </div>

          {/* Share CTA */}
          <div className="flex flex-col rounded-[12px] border border-mist bg-warm-white p-6">
            <div className="mb-3 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <h3 className="font-serif text-[16px] font-bold text-bark">가족에게 공유하기</h3>
            </div>
            <p className="flex-1 text-[14px] leading-relaxed text-leaf">
              형제, 자매에게 이 기록을 나누세요
            </p>
            <button
              onClick={handleShare}
              className="mt-4 h-[44px] w-full rounded-[6px] border border-mist bg-warm-white text-[14px] font-medium text-bark transition-colors hover:bg-mist-light"
            >
              {linkCopied ? '링크가 복사되었습니다 ✓' : '공유 링크 생성'}
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
