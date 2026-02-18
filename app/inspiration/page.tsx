'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-4');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-4 transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
}

const TIMELINE = [
  {
    year: '1447',
    title: '용비어천가',
    body: '뿌리 깊은 나무는 바람에 아니 흔들릴새. 조선 왕실의 계보를 기록한 이 노래는, 기원을 기억하는 것이 권력의 근거였음을 보여줍니다.',
  },
  {
    year: '1960s',
    title: '김수영 「거대한 뿌리」',
    body: '낡고 천하다 여겨지던 민중의 삶이 이 땅의 거대한 뿌리임을 선언했습니다.',
  },
  {
    year: '1976',
    title: '뿌리깊은나무 민중 자서전',
    body: '20권의 자서전은 한국 구술사의 원형이 되었습니다. 토박이말로, 그들의 목소리 그대로.',
  },
  {
    year: '2026',
    title: '실타래',
    body: '50년 후, 같은 질문을 AI로 묻습니다.',
  },
];

export default function InspirationPage() {
  return (
    <div className="min-h-dvh bg-cream">
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">

        {/* Hero */}
        <FadeSection className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-stone mb-4">Inspiration</p>
          <h1 className="font-serif text-[36px] md:text-[48px] font-bold leading-tight text-bark">
            기록의 계보
          </h1>
          <p className="mt-6 text-[17px] leading-[1.9] text-stone">
            실타래는 갑자기 나타난 것이 아닙니다. 이름 없는 이들의 목소리를 기록하려는 시도는 오래전부터 있었습니다.
          </p>
        </FadeSection>

        {/* Poem */}
        <FadeSection className="mb-16">
          <div className="rounded-[12px] bg-mist-light px-8 py-10">
            <blockquote className="font-serif text-[20px] italic leading-[2] text-bark/90 text-center">
              뿌리 깊은 나무는 바람에 아니 흔들리므로<br />
              꽃 좋고 열매 많나니<br />
              샘이 깊은 물은 가물에 아니 그치므로<br />
              내가 이루어 바다에 가나니
            </blockquote>
            <p className="mt-6 text-center text-sm text-stone">용비어천가 2장, 1447</p>
          </div>
        </FadeSection>

        {/* Timeline */}
        <FadeSection className="mb-16">
          <div className="flex flex-col gap-0">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="grid grid-cols-[80px_1fr] gap-6">
                {/* Year column */}
                <div className="flex flex-col items-end pt-1">
                  <span className="font-serif text-[15px] font-bold text-amber">{item.year}</span>
                  {i < TIMELINE.length - 1 && (
                    <div className="mt-2 flex-1 w-px bg-mist self-center mr-0" style={{ minHeight: 32 }} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-10">
                  <h3 className="font-serif text-[18px] font-bold text-bark">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.8] text-stone">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* Bridge */}
        <FadeSection className="mb-16">
          <div className="rounded-[12px] bg-bark px-8 py-10 text-center">
            <p className="font-serif text-[17px] leading-[1.9] text-cream/90 italic">
              "기록 없는 전략은 선전으로 붕괴하고, 네트워크 없는 아카이브는 박제로 굳으며, 전략 없는 기록은 침묵 속에 방치됩니다."
            </p>
            <p className="mt-6 text-sm text-cream/60">
              뿌리깊은나무 연구소{' '}
              <a
                href="https://rooted.center"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-cream/90 transition-colors"
              >
                rooted.center
              </a>
            </p>
          </div>
        </FadeSection>

        {/* Closing */}
        <FadeSection className="text-center">
          <p className="text-[17px] leading-[1.9] text-stone mb-8">
            실타래는 뿌리깊은나무가 50년 전에 시작한 기록을 디지털로 계승합니다. 다만 이번에는, 당신이 직접 그분께 링크를 보낼 수 있습니다.
          </p>
          <Link
            href="/request"
            className="inline-flex items-center gap-2 rounded-[6px] bg-bark px-8 py-3 text-[16px] font-medium text-warm-white transition-colors hover:bg-bark-light"
          >
            실타래 보내기 →
          </Link>
        </FadeSection>

      </main>

      <Footer />
    </div>
  );
}
