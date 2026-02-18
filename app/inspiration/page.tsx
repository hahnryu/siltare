/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onError = () => setHasError(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  function togglePlay() {
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

  function formatTime(s: number) {
    if (!isFinite(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  if (hasError) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-[13px] text-cream/50">유석문 편집자 육성 (2026.02.15 녹취)</p>
      <div className="inline-flex items-center gap-3 rounded-full bg-cream/5 px-5 py-3">
        <audio ref={audioRef} src="/yoo_seokmoon.ogg" preload="metadata" />
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? '일시정지' : '재생'}
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
        >
          {isPlaying ? (
            <span className="flex gap-[3px]">
              <span className="h-[14px] w-[3px] rounded-sm bg-current" />
              <span className="h-[14px] w-[3px] rounded-sm bg-current" />
            </span>
          ) : (
            <span className="ml-[2px] block border-y-[7px] border-l-[12px] border-r-0 border-solid border-y-transparent border-l-current" />
          )}
        </button>
        <div className="flex flex-col gap-1.5">
          <div className="h-1 w-36 overflow-hidden rounded-full bg-cream/30 sm:w-52">
            <div
              className="h-full rounded-full bg-amber transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[12px] text-cream/50">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
      </div>
    </div>
  );
}

const MINJUNG_TITLES = [
  { title: '「두렁바위에 흐르는 눈물」', sub: '제암리 학살사건의 증인 전동례의 한평생' },
  { title: '「이제 이 조선 톱에도 녹이 슬었네」', sub: '조선목수 배희환의 한평생' },
  { title: '「장돌뱅이 돈이 왜 구린지 알어?」', sub: '마지막 보부상 유진룡의 한평생' },
  { title: '「나 죽으면 이걸로 끄쳐 버리지」', sub: '남도 옹기쟁이 박나섭의 한평생' },
  { title: '「시방은 안해, 강강술래럴 안해」', sub: '진도 앞소리꾼 최소심의 한평생' },
  { title: '「사삼 사태로 반 죽었어, 반!」', sub: '제주 중산간 농부 김승윤의 한평생' },
  { title: '「여보, 우리는 뒷간밖에 갔다온 데가 없어」', sub: '마지막 화전민 이광용의 한평생' },
  { title: '「"에이 짠한 사람!" 내가 나보고 그라요」', sub: '진도 단골 채정례의 한평생' },
];

export default function InspirationPage() {
  useFadeIn();

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />

      <main className="flex-1">
        {/* ── Section 1: Hero ── */}
        <section className="px-6 py-20 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-amber">
              Inspiration
            </p>
            <h1 className="mt-4 font-serif text-[38px] font-bold leading-tight text-bark sm:text-[48px]">
              기록의 계보
            </h1>
            <p className="mt-6 text-[17px] leading-[1.9] text-stone">
              실타래는 갑자기 나타난 것이 아닙니다.
              이름 없는 이들의 목소리를 기록하려는 시도는 오래전부터 있었습니다.
            </p>
          </div>
        </section>

        {/* ── Section 2: Poem ── */}
        <section className="bg-mist-light px-6 py-16 text-center">
          <div className="mx-auto max-w-xl">
            <p className="font-serif text-[20px] leading-[2.5] text-bark sm:text-[22px]">
              불휘 기픈 남간<br />
              바라매 아니 뮐쌔,<br />
              곶 됴코 여름 하나니.<br />
              <br />
              새미 기픈 므른<br />
              가마래 아니 그츨쌔,<br />
              내히 이러 바라래 가나니.
            </p>
            <p className="mt-8 text-[14px] text-stone">— 용비어천가 2장, 1447</p>
          </div>
        </section>

        {/* ── Section 3: Timeline ── */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">

            {/* 1447 */}
            <div className="fade-up pb-16">
              <p className="font-serif text-[12px] font-bold uppercase tracking-widest text-amber">
                1447
              </p>
              <h2 className="mt-2 font-serif text-[24px] font-bold text-bark">용비어천가</h2>
              <p className="mt-4 text-[16px] leading-[1.9] text-stone">
                뿌리 깊은 나무는 바람에 흔들리지 않는다.<br />
                세종이 백성을 향해 쓴 근원의 언어.<br />
                &ldquo;뿌리깊은나무&rdquo;는 여기서 시작됩니다.
              </p>
            </div>

            {/* 1960s */}
            <div className="fade-up pb-16">
              <p className="font-serif text-[12px] font-bold uppercase tracking-widest text-amber">
                1960s
              </p>
              <h2 className="mt-2 font-serif text-[24px] font-bold text-bark">
                김수영 「거대한 뿌리」
              </h2>
              <blockquote className="mt-5 border-l-2 border-amber pl-6">
                <p className="font-serif text-[16px] italic leading-[2.1] text-bark/80">
                  &ldquo;이 땅에 발을 붙이기 위해서는<br />
                  제3인도교의 물 속에 박은 철근 기둥도<br />
                  내가 내 땅에 박는 거대한 뿌리에 비하면<br />
                  좀벌레의 솜털&rdquo;
                </p>
              </blockquote>
              <p className="mt-5 text-[16px] leading-[1.9] text-stone">
                요강, 망건, 장죽, 곰보, 애꾸, 무식쟁이.<br />
                낡고 천하다 여겨지던 것들이<br />
                이 땅의 거대한 뿌리임을 선언한 시.<br />
                근원은 위에서 오는 것이 아니라 아래에서 올라오는 것.
              </p>
            </div>

            {/* 1976 */}
            <div className="fade-up pb-16">
              <p className="font-serif text-[12px] font-bold uppercase tracking-widest text-amber">
                1976
              </p>
              <h2 className="mt-2 font-serif text-[24px] font-bold text-bark">뿌리깊은나무</h2>
              <p className="mt-4 text-[16px] leading-[1.9] text-stone">
                한창기(1936–1997).<br />
                서울대 법대를 졸업하고 브리태니커 본사를 설득해<br />
                한국 문화를 담은 잡지를 만들었습니다.<br />
                순한글 가로쓰기. 훈민정음체 제호.<br />
                8만 부 이상을 찍은, 당시 최고 발행부수의 교양지.
              </p>
              <blockquote className="mt-5 border-l-2 border-amber pl-6">
                <p className="font-serif text-[16px] italic leading-[2.1] text-bark/80">
                  &ldquo;전통의 규범문화에 치이고, 외래 상업문화에 밀린<br />
                  토박이 민중문화에 물길을 터주려고 애쓰는 사람들을<br />
                  거들기 위해서.&rdquo;
                </p>
                <footer className="mt-2 text-[14px] text-stone">— 뿌리깊은나무 창간사</footer>
              </blockquote>
              <p className="mt-5 text-[16px] leading-[1.9] text-stone">
                1980년 신군부에 의해 폐간.<br />
                그러나 편집진은 흩어지지 않았습니다.
              </p>
            </div>

            {/* 1981–1991 */}
            <div className="fade-up pb-16">
              <p className="font-serif text-[12px] font-bold uppercase tracking-widest text-amber">
                1981–1991
              </p>
              <h2 className="mt-2 font-serif text-[24px] font-bold text-bark">민중자서전 20권</h2>
              <p className="mt-4 text-[16px] leading-[1.9] text-stone">
                폐간 이후, 한국 최초의 구술사(口述史) 시리즈가 시작됩니다.<br />
                학교라고는 문 앞에도 가보지 않은 민초들의 입말을,<br />
                사투리 그대로, 가감 없이 기록했습니다.
              </p>

              <ul className="mt-6 flex flex-col gap-4">
                {MINJUNG_TITLES.map((item) => (
                  <li key={item.title}>
                    <p className="font-serif text-[16px] font-bold text-bark">{item.title}</p>
                    <p className="mt-0.5 text-[14px] text-stone">{item.sub}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-[16px] text-stone">…외 12권, 총 20권.</p>
              <p className="mt-4 text-[16px] leading-[1.9] text-stone">
                제목만 읽어도 한 사람의 생이 느껴집니다.<br />
                이것이 구술의 힘입니다.
              </p>

              {/* Book Cover Gallery */}
              <div className="-mx-6 mt-8">
                <div className="scrollbar-hide flex cursor-grab snap-x snap-mandatory flex-row gap-4 overflow-x-auto px-6 py-6 active:cursor-grabbing">
                  {Array.from({ length: 20 }, (_, i) => {
                    const num = String(i + 1).padStart(2, '0');
                    return (
                      <img
                        key={num}
                        src={`/minjung/${num}.jpg`}
                        alt={`민중자서전 ${i + 1}권`}
                        className="h-[200px] w-auto flex-none snap-start rounded object-contain shadow-sm"
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2003 */}
            <div className="fade-up pb-16">
              <p className="font-serif text-[12px] font-bold uppercase tracking-widest text-amber">
                2003
              </p>
              <h2 className="mt-2 font-serif text-[24px] font-bold text-bark">StoryCorps (미국)</h2>
              <p className="mt-4 text-[16px] leading-[1.9] text-stone">
                데이브 아이세이가 뉴욕 그랜드센트럴역에 녹음부스를 설치합니다.<br />
                &ldquo;모든 사람의 이야기는 기록될 가치가 있다.&rdquo;<br />
                20년간 60만 건 이상의 인터뷰를 수집.<br />
                미국 의회도서관에 영구 보존.<br />
                민중자서전이 활자로 했던 일을, 음성으로 확장한 모델.
              </p>
            </div>

            {/* 2026 */}
            <div className="fade-up">
              <p className="font-serif text-[12px] font-bold uppercase tracking-widest text-amber">
                2026
              </p>
              <h2 className="mt-2 font-serif text-[24px] font-bold text-bark">실타래</h2>
              <p className="mt-4 text-[16px] leading-[1.9] text-stone">
                50년 후, 같은 질문을 AI로 묻습니다.<br />
                <br />
                한창기의 편집진이 마을을 찾아다니며 했던 일을,<br />
                이제 링크 하나로 할 수 있습니다.<br />
                <br />
                합성 콘텐츠가 범람하는 시대에,<br />
                합성되지 않은 인간의 목소리를 수집하고 보존합니다.<br />
                <br />
                기록의 도구가 달라졌을 뿐,<br />
                기록의 정신은 같습니다.
              </p>
            </div>

          </div>
        </section>

        {/* ── Section 4: Bridge (bg-bark) ── */}
        <section className="bg-bark px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-12 text-[16px] leading-[2.0] text-cream/70">
              과거에 뿌리를 두지 않은 미래는 맥락을 잃고,<br />
              승화되지 않은 과거는 답습과 반복을 낳으며,<br />
              전략 없는 기록은 침묵 속에 방치됩니다.
            </p>
            <blockquote className="border-l-2 border-amber pl-6 text-left">
              <p className="font-serif text-[20px] leading-[2.0] text-warm-white sm:text-[24px]">
                &ldquo;문화는 한 시대의 꽃이 아니라 뿌리에요. 뿌리가 깊으면 꽃은 철 따라 계속 필 수 있어요. 하지만 꽃이 피어도 뿌리가 약하면 그건 한 철에 지나지 않아요. 바로 이런 지점이 우리가 &lsquo;뿌리깊은나무&rsquo;를 통해 담아 내고자 했던 본령이었어요.&rdquo;
              </p>
              <footer className="mt-4 text-[14px] text-cream/60">
                — 유석문, 뿌리깊은나무 마지막 편집자
              </footer>
            </blockquote>
            <AudioPlayer />
          </div>
        </section>

        {/* ── Section 5: Closing ── */}
        <section className="bg-cream px-6 py-20 text-center">
          <div className="mx-auto max-w-[520px]">
            <p className="text-[17px] leading-[2.1] text-stone">
              실타래는 뿌리깊은나무가 50년 전에 시작한 기록을<br />
              디지털로 계승합니다.<br />
              <br />
              다만 이번에는,<br />
              당신이 직접 그분께 링크를 보낼 수 있습니다.
            </p>
            <Link
              href="/request"
              className="mt-10 inline-flex h-[56px] items-center justify-center rounded-[6px] bg-bark px-12 text-[17px] font-medium text-warm-white shadow-sm transition-colors hover:bg-bark-light"
            >
              실타래 보내기 →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
