'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

// ---- AudioPlayer ----
const AUDIO_BAR_COUNT = 48;
const DEMO_DURATION = 32 * 60 + 14; // 32:14

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const WAVEFORM = Array.from({ length: AUDIO_BAR_COUNT }, (_, i) => {
  const t = i / AUDIO_BAR_COUNT;
  const base = 0.3 + 0.4 * Math.sin(t * Math.PI);
  return Math.min(1, base + seededRandom(i + 1) * 0.3);
});

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progress = currentTime / DEMO_DURATION;

  const toggle = useCallback(() => setPlaying((p) => !p), []);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= DEMO_DURATION) { setPlaying(false); return 0; }
          return t + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing]);

  return (
    <section className="px-4 mt-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-warm-white border border-mist p-6">
          <p className="text-sm font-medium text-stone mb-5">원본 음성 전체 듣기</p>
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber text-warm-white transition-transform hover:scale-105 active:scale-95"
              aria-label={playing ? '일시정지' : '재생'}
            >
              {playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}><polygon points="5,3 19,12 5,21"/></svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div
                className="flex items-end gap-[2px] h-12 cursor-pointer"
                role="slider"
                aria-label="오디오 재생 위치"
                aria-valuemin={0}
                aria-valuemax={DEMO_DURATION}
                aria-valuenow={Math.floor(currentTime)}
                tabIndex={0}
              >
                {WAVEFORM.map((height, i) => {
                  const isActive = i / AUDIO_BAR_COUNT <= progress;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentTime((i / AUDIO_BAR_COUNT) * DEMO_DURATION)}
                      className={`flex-1 min-w-[2px] rounded-full transition-colors duration-150 ${isActive ? 'bg-amber' : 'bg-mist'}`}
                      style={{ height: `${height * 100}%` }}
                      aria-hidden="true"
                      tabIndex={-1}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-stone">
                <span>{fmtTime(currentTime)}</span>
                <span>{fmtTime(DEMO_DURATION)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// ---- /AudioPlayer ----

const LABELS = {
  back: '돌아가기',
  recordedDate: '2026년 2월 15일 기록',
  title: '어머니의 이야기',
  subtitle: '김영순, 1952년 안동 출생',
  duration: '32분 14초',
  charCount: '4,280자',
  topicCount: '12개 주제',
  summaryHeading: 'AI 요약',
  chapterHeading: '이야기 목차',
  bookHeading: '자서전 책으로 만들기',
  bookSub: '어머니의 이야기를 아름다운 책 한 권으로',
  bookPrice: '₩79,000부터',
  bookCta: '책 만들기',
  shareHeading: '가족에게 공유하기',
  shareSub: '형제, 자매에게 이 기록을 나누세요',
  shareCta: '공유 링크 생성',
  footerNote: '소중한 이야기를 기록합니다',
};

const SUMMARY_PARAGRAPHS = [
  { text: '김영순님은 1952년 경북 안동에서 태어났습니다. 6남매 중 셋째로, 어린 시절 낙동강에서 물고기를 잡으며 놀았던 기억을 가장 먼저 떠올렸습니다. 집 앞 감나무 아래에서 할머니가 들려주신 옛이야기가 가장 따뜻한 기억이라고 합니다.', timestamp: '03:24' },
  { text: '17살에 서울로 올라와 봉제공장에서 일하며 야간학교를 다녔습니다. 고향을 떠나는 날, 어머니가 싸주신 보자기 하나가 전 재산이었다고 합니다. 그 시절 공장 동료들과 나누던 김밥 한 줄의 맛을 아직도 기억한다고 했습니다.', timestamp: '10:15' },
  { text: '스물네 살에 남편을 만나 결혼했고, 두 아이를 키우며 작은 분식집을 운영했습니다. 새벽 4시에 일어나 육수를 끓이던 날들이 힘들었지만, 아이들이 가게에서 숙제하던 모습을 떠올리며 미소를 지었습니다.', timestamp: '17:42' },
  { text: 'IMF 때 가게를 접어야 했던 순간이 인생에서 가장 힘든 시기였다고 합니다. 하지만 그때 가족이 함께 견뎌낸 경험이 지금의 단단함을 만들었다고 말했습니다. 마지막으로 자녀에게 전하는 말에서는 "네가 건강하고 행복하면, 엄마는 그것만으로 충분하다"는 메시지를 남겼습니다.', timestamp: '25:30' },
];

const CHAPTERS = [
  { id: 'ch-1', number: 1, title: '어린 시절 - 안동의 기억', timestamp: '00:00', excerpt: '"낙동강이 우리 놀이터였어. 여름이면 형제들이랑 강에 들어가서 물고기를 잡았는데, 손으로 잡았어. 그때는 물이 맑아서 물고기가 다 보였거든..."' },
  { id: 'ch-2', number: 2, title: '서울 상경 - 열일곱의 결심', timestamp: '08:12', excerpt: '"어머니가 보자기 하나를 싸주셨어. 그 안에 옷 두 벌하고 할머니가 쥐어주신 돈 조금. 기차 창밖으로 안동이 멀어지는데, 눈물이 나더라고..."' },
  { id: 'ch-3', number: 3, title: '결혼과 가족 - 당신의 아버지를 만나다', timestamp: '15:30', excerpt: '"네 아버지를 처음 본 건 공장 앞 버스 정류장이었어. 매일 같은 시간에 버스를 기다리는데, 어느 날 우산을 씌워주더라고. 그때 마음이 참 따뜻했어..."' },
  { id: 'ch-4', number: 4, title: '가장 힘들었던 시기 - IMF', timestamp: '22:45', excerpt: '"하루아침에 장사가 안 되는 거야. 단골손님들도 안 오고. 월세를 못 내서 가게를 접었는데, 그날 밤 네 아버지랑 둘이 앉아서 한참을 울었어..."' },
  { id: 'ch-5', number: 5, title: '자녀에게 - 민수야, 엄마가 하고 싶은 말', timestamp: '28:10', excerpt: '"민수야, 엄마가 많이 해준 건 없지만... 네가 건강하고 웃고 살면 그게 엄마한테는 제일 큰 선물이야. 힘들 때 혼자 끙끙대지 말고, 엄마한테 전화해..."' },
];

export default function ArchivePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        {/* Back button */}
        <div className="mx-auto max-w-2xl px-4 pt-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-stone hover:text-bark transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            {LABELS.back}
          </button>
        </div>

        {/* Hero summary */}
        <section className="px-4 pt-8 pb-8 md:pt-16 md:pb-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm text-stone tracking-wide">{LABELS.recordedDate}</p>
            <h1 className="font-serif mt-4 text-3xl font-bold tracking-tight text-bark text-balance md:text-4xl lg:text-5xl">
              {LABELS.title}
            </h1>
            <p className="mt-3 text-lg text-leaf md:text-xl">{LABELS.subtitle}</p>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-stone md:gap-8">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {LABELS.duration}
              </span>
              <span className="w-px h-4 bg-mist" aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber shrink-0"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                {LABELS.charCount}
              </span>
              <span className="w-px h-4 bg-mist" aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber shrink-0"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                {LABELS.topicCount}
              </span>
            </div>
          </div>
        </section>

        {/* AI Summary */}
        <section className="px-4 mt-4">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber shrink-0"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
              <h2 className="font-serif text-xl font-bold text-bark">{LABELS.summaryHeading}</h2>
            </div>

            <div className="rounded-xl bg-warm-white border border-mist p-6 md:p-8">
              <div className="space-y-5">
                {SUMMARY_PARAGRAPHS.map((para, i) => (
                  <div key={i}>
                    <p className="text-bark leading-relaxed text-[15px]">{para.text}</p>
                    <button
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-amber hover:text-amber-light transition-colors"
                      aria-label={`${para.timestamp} 시점으로 이동`}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                        <path d="M5 4L8 6L5 8V4Z" fill="currentColor" />
                      </svg>
                      {para.timestamp}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Chapter list */}
        <section className="px-4 mt-10">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              <h2 className="font-serif text-xl font-bold text-bark">{LABELS.chapterHeading}</h2>
            </div>

            <div className="rounded-xl bg-warm-white border border-mist overflow-hidden divide-y divide-mist">
              {CHAPTERS.map((chapter) => (
                <div key={chapter.id}>
                  <button
                    onClick={() => setOpenChapter(openChapter === chapter.id ? null : chapter.id)}
                    className="w-full flex items-start gap-3 px-6 py-5 text-left hover:bg-mist-light transition-colors"
                    aria-expanded={openChapter === chapter.id}
                  >
                    <span className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full bg-mist text-[12px] font-semibold text-bark mt-0.5">
                      {chapter.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-bark leading-snug">{chapter.title}</p>
                      <p className="text-xs text-stone mt-0.5">{chapter.timestamp}</p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-stone shrink-0 transition-transform duration-200 ${openChapter === chapter.id ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                  {openChapter === chapter.id && (
                    <div className="px-6 pb-5 pl-[60px]">
                      <p className="font-serif text-sm text-leaf leading-relaxed italic">{chapter.excerpt}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 mt-12 pb-16">
          <div className="mx-auto max-w-2xl">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Book CTA */}
              <div className="rounded-xl bg-warm-white border border-mist p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber shrink-0"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  <h3 className="font-serif text-base font-bold text-bark">{LABELS.bookHeading}</h3>
                </div>
                <p className="text-sm text-leaf leading-relaxed flex-1">{LABELS.bookSub}</p>
                <p className="text-sm font-semibold text-bark mt-3">{LABELS.bookPrice}</p>
                <button
                  onClick={() => router.push(`/book/${id}`)}
                  className="mt-4 w-full rounded-[6px] bg-bark text-warm-white py-2.5 text-sm font-medium transition-colors hover:bg-bark-light"
                >
                  {LABELS.bookCta}
                </button>
              </div>

              {/* Share CTA */}
              <div className="rounded-xl bg-warm-white border border-mist p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber shrink-0"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  <h3 className="font-serif text-base font-bold text-bark">{LABELS.shareHeading}</h3>
                </div>
                <p className="text-sm text-leaf leading-relaxed flex-1">{LABELS.shareSub}</p>
                <button
                  onClick={() => alert('준비 중입니다')}
                  className="mt-4 w-full rounded-[6px] border border-mist bg-warm-white text-bark py-2.5 text-sm font-medium transition-colors hover:bg-mist-light"
                >
                  {LABELS.shareCta}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-mist py-8 text-center">
        <a href="/" className="font-serif text-xs text-stone hover:text-bark transition-colors">
          🧵 실타래 &mdash; {LABELS.footerNote}
        </a>
      </footer>
    </div>
  );
}
