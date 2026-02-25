'use client';

import { useEffect } from 'react';
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    const elements = document.querySelectorAll('.fade-up');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const HOW_STEPS = [
  {
    num: '1',
    title: '시작하기',
    desc: '버튼 하나 누르면 AI 인터뷰가 시작됩니다.\n가입도, 설치도, 준비도 필요 없습니다.',
  },
  {
    num: '2',
    title: '말하면 됩니다',
    desc: '마이크 버튼을 누르고 말씀하세요.\n타이핑은 필요 없습니다. 교정할 때만.',
  },
  {
    num: '3',
    title: 'AI가 깊이 묻습니다',
    desc: '어린 시절, 전환점, 후회, 감사.\n답변에 따라 더 깊이 들어갑니다.\n아이작슨이 잡스를 인터뷰하듯.',
  },
  {
    num: '4',
    title: '기록이 남습니다',
    desc: '음성 원본과 전사본, AI 요약이 함께.\n시간이 지나도 사라지지 않는 기록.',
  },
  {
    num: '5',
    title: '가족에게 보내세요',
    desc: '내 이야기를 하다 보면, 엄마 아빠 이야기가 나옵니다.\n링크 하나로 가족의 이야기도 남길 수 있습니다.',
  },
  {
    num: '6',
    title: '기록이 기록을 부릅니다',
    desc: '한 사람의 이야기가 다음 이야기를 만듭니다.\n개인의 목소리가 모여 가족의 서사가 됩니다.',
  },
];

const WHY_ITEMS = [
  {
    title: '3초 만에 시작합니다',
    desc: '버튼 하나로 바로 시작. 가입도 앱도 필요 없습니다.\nAI가 대화 상대가 됩니다.\n편한 시간에, 자기 속도로.',
  },
  {
    title: 'AI가 사람보다 깊이 묻습니다',
    desc: '자녀가 직접 인터뷰하면 감정에 빠지거나 어색해서\n핵심 질문을 놓칩니다.\nAI는 부드럽지만 체계적으로 생애 전체를 커버합니다.\n출생, 유년기, 학교, 직업, 결혼, 자녀, 위기, 후회, 감사.\n대답에 따라 더 깊이 파고듭니다.',
  },
  {
    title: '기록이 기록을 부릅니다',
    desc: '인터뷰가 끝나면, 대화 속에 등장한 인물에게\n실타래를 보낼 수 있습니다.\n한 사람의 기록이 다음 기록을 만듭니다.\n개인의 목소리가 모여 집단의 서사가 됩니다.',
  },
  {
    title: '합성 불가능한 원본',
    desc: '음성 복제가 일상이 되는 시대.\n합성되지 않은 인간의 목소리가 가장 희소한 자산이 됩니다.\n온체인 타임스탬프로 원본성을 증명합니다.',
  },
];

export default function HomePage() {
  useFadeIn();

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />

      <main className="flex-1">
        {/* ── Section 1: Hero ── */}
        <section className="flex flex-col items-center px-6 py-20 text-center">
          <div className="w-full max-w-[520px]">
            <span
              className="text-[56px] leading-none select-none"
              role="img"
              aria-label="실타래 로고"
            >
              🧵
            </span>
            <h1 className="mt-5 font-serif text-[48px] font-bold leading-tight tracking-tight text-bark">
              실타래
            </h1>
            <p className="mt-1 text-[13px] font-light tracking-wide text-stone">
              silt&apos;aræ
            </p>
            <p className="mt-5 font-serif text-[20px] font-light leading-relaxed text-leaf">
              모든 사람의 인생은 한 권의 책입니다.
            </p>

            {/* 블록 1: 셀프 인터뷰 (메인) */}
            <div className="mt-10 rounded-[12px] border border-mist bg-warm-white p-6">
              <Link
                href="/self"
                className="flex h-[56px] w-full items-center justify-center rounded-[6px] bg-bark text-[17px] font-medium text-warm-white shadow-sm transition-colors hover:bg-bark-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                내 이야기 시작하기
              </Link>
              <p className="mt-4 text-[15px] leading-relaxed text-stone">
                AI가 묻고, 기록하고, 당신을 분석합니다.<br />
                나도 몰랐던 내가 보입니다.
              </p>
            </div>

            {/* 구분선 */}
            <div className="my-8 flex items-center justify-center">
              <div className="h-px w-12 bg-mist" aria-hidden="true" />
            </div>

            {/* 블록 2: 부모님 인터뷰 (서브) */}
            <div className="text-center">
              <p className="text-[17px] font-medium leading-snug text-bark">
                부모님이 아직 곁에 계신가요?
              </p>
              <Link
                href="/request"
                className="mt-5 inline-flex h-[48px] items-center justify-center rounded-[6px] border border-mist bg-transparent px-10 text-[15px] font-medium text-bark transition-colors hover:bg-mist-light"
              >
                부모님께 보내기
              </Link>
              <p className="mt-4 text-[15px] leading-relaxed text-stone">
                더 늦기 전에 남겨두세요.<br />
                당신이 차마 묻지 못한 질문, 대신 여쭤 드립니다.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 2: How It Works ── */}
        <section id="how" className="bg-warm-white px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="fade-up mb-12 text-center">
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-amber">
                How It Works
              </p>
              <h2 className="mt-3 font-serif text-[32px] font-bold text-bark">
                말하면 됩니다.
              </h2>
              <p className="mt-2 text-[16px] text-stone">
                가입 없이. 앱 설치 없이.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {HOW_STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className="fade-up rounded-[12px] border border-mist bg-cream p-6"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="mb-3 font-serif text-[30px] font-bold leading-none text-amber">
                    {step.num}
                  </div>
                  <h3 className="mb-2 font-serif text-[17px] font-bold text-bark">
                    {step.title}
                  </h3>
                  <p className="whitespace-pre-line text-[14px] leading-[1.9] text-stone">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Quote (dark) ── */}
        <section className="fade-up bg-bark px-6 py-20 text-center">
          <blockquote className="mx-auto max-w-[480px]">
            <p className="font-serif text-[24px] font-light leading-[2.2] text-warm-white sm:text-[28px]">
              AI가 묻고<br />
              당신은 말하면 됩니다.<br />
              기록은 실타래가 합니다.
            </p>
          </blockquote>
        </section>

        {/* ── Section 4: Why This Works ── */}
        <section className="bg-cream px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="fade-up mb-12 text-center">
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-amber">
                Why This Works
              </p>
              <h2 className="mt-3 font-serif text-[32px] font-bold text-bark">
                왜 지금, 왜 AI, 왜 음성.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {WHY_ITEMS.map((item, i) => (
                <div
                  key={item.title}
                  className="fade-up rounded-[12px] border border-mist bg-warm-white p-8"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <h3 className="mb-3 font-serif text-[19px] font-bold text-bark">
                    {item.title}
                  </h3>
                  <p className="whitespace-pre-line text-[15px] leading-[1.9] text-stone">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5: 분석 소개 ── */}
        <section className="fade-up bg-mist-light px-6 py-20 text-center">
          <div className="mx-auto max-w-[520px]">
            <h2 className="font-serif text-[26px] font-bold text-bark">
              기록을 넘어, 발견.
            </h2>
            <p className="mt-4 text-[16px] leading-[1.9] text-stone">
              AI가 당신의 대화를 분석합니다.<br />
              자주 쓰는 단어, 감정 패턴, 가장 오래 머문 주제.<br />
              나도 몰랐던 내가 보입니다.
            </p>
            <p className="mt-6 text-[16px] leading-[1.9] text-stone">
              부모님께 보내셨다면,<br />
              &quot;아버지는 이런 분이셨습니다&quot; 리포트를 받아보세요.<br />
              평생 몰랐던 부모님의 내면을 만날 수 있습니다.
            </p>
            <Link
              href="/request"
              className="mt-8 inline-flex h-[52px] items-center justify-center rounded-[6px] border border-mist bg-warm-white px-10 text-[16px] font-medium text-bark transition-colors hover:bg-mist-light"
            >
              가족에게 실타래 보내기
            </Link>
          </div>
        </section>

        {/* ── Section 6: Inspired By ── */}
        <section className="fade-up bg-warm-white px-6 py-20 text-center">
          <div className="mx-auto max-w-[600px]">
            <p className="font-serif text-[22px] font-light leading-[1.9] text-bark">
              불휘 기픈 남간<br />
              바라매 아니 뮐쌔
            </p>
            <div className="mx-auto my-8 h-px w-12 bg-mist" aria-hidden="true" />
            <p className="text-[15px] leading-[1.9] text-stone">
              1976년, 뿌리깊은나무는 이름 없는 이들의 육성을<br />
              토박이말로 기록한 민중 자서전 20권을 남겼습니다.<br />
              실타래는 그 기록의 디지털 계승입니다.
            </p>
            <Link
              href="/inspiration"
              className="mt-8 inline-flex items-center gap-1 text-[15px] font-medium text-amber transition-colors hover:text-amber-light"
            >
              이야기 읽기 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* ── Section 7: Bottom CTA ── */}
        <section className="fade-up px-6 py-20 text-center">
          <div className="mx-auto max-w-[520px]">
            <h2 className="font-serif text-[30px] font-bold text-bark">
              아직 늦지 않았습니다.
            </h2>
            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/self"
                className="flex h-[56px] w-full items-center justify-center rounded-[6px] bg-bark text-[17px] font-medium text-warm-white shadow-sm transition-colors hover:bg-bark-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                내 이야기 시작하기
              </Link>
              <Link
                href="/request"
                className="flex h-[48px] w-full items-center justify-center rounded-[6px] border border-mist bg-transparent text-[15px] font-medium text-bark transition-colors hover:bg-mist-light"
              >
                부모님께 보내기
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <div className="py-2 text-center">
        <Link
          href="/dashboard"
          className="text-[11px] text-stone/40 transition-colors hover:text-stone"
        >
          관리자
        </Link>
      </div>
    </div>
  );
}
