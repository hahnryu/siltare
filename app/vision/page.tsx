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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className={`opacity-0 translate-y-4 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}

const WHY_WORKS = [
  { title: '콜드스타트 없음', body: '링크 하나로 시작. 가입 없이 부모님이 바로 대화할 수 있습니다.' },
  { title: 'AI의 깊이', body: 'GPT-4o 기반 구술사 연구자 페르소나. 사람보다 더 끈질기게, 더 정중하게 묻습니다.' },
  { title: '원본성 moat', body: '실제 육성과 표현은 합성 불가. 시간이 갈수록 희소성이 높아지는 자산입니다.' },
  { title: '네트워크 효과', body: '한 집안에서 시작해 형제, 자녀, 손자로 퍼집니다. 가족 단위 바이럴.' },
];

const COMPARISON = [
  { feature: '언어', storyworth: '영어 중심', remento: '영어 중심', siltare: '한국어 특화' },
  { feature: '입력 방식', storyworth: '이메일 질문', remento: '앱 녹음', siltare: '실시간 AI 대화' },
  { feature: '대화 깊이', storyworth: '없음', remento: '없음', siltare: '후속 질문 자동 생성' },
  { feature: '전사본', storyworth: '없음', remento: 'AI 전사', siltare: 'AI 전사 + 편집' },
  { feature: '책 제작', storyworth: '있음', remento: '없음', siltare: '있음 (예정)' },
  { feature: '가입 불필요', storyworth: '필요', remento: '필요', siltare: '필요 없음' },
  { feature: '가격', storyworth: '$99/year', remento: '$99/year', siltare: '₩39,000~' },
];

const EIGHT_WEEKS = [
  { period: 'Week 1-2', title: 'Core', items: ['인터뷰 플로우 완성', 'AI 대화 품질 검증', 'Whisper 정확도 테스트'] },
  { period: 'Week 3-4', title: 'Archive', items: ['아카이브 페이지', '챕터 자동 생성', '가족 공유 링크'] },
  { period: 'Week 5-6', title: 'Monetization', items: ['Toss 결제 연동', '책 주문 플로우', '이메일 결과 전송'] },
  { period: 'Week 7-8', title: 'Launch', items: ['Parents\' Day 캠페인', 'KakaoTalk 공유', 'PR 및 미디어'] },
];

const REVENUE_TIERS = [
  { name: '무료', price: '₩0', desc: '기본 포함', features: ['AI 대화 1회', '텍스트 아카이브', '공유 링크'], featured: false },
  { name: '선물', price: '₩39,000', desc: '가장 인기', features: ['음성 원본 보관', 'AI 전사본 + 요약', '가족 공유', '이메일 전달'], featured: true },
  { name: '자서전', price: '₩59,000~', desc: '특별한 기록', features: ['위 모두 포함', '소프트커버 책 1권', '표지 커스터마이징'], featured: false },
];

const WHY_US = [
  { label: '계보', body: '뿌리깊은나무 연구소와 협업. 한국 구술사의 정통 계보를 잇습니다.' },
  { label: '구조', body: 'Human-Origin Memory Protocol. 데이터 구조부터 장기 비전까지 설계되어 있습니다.' },
  { label: '기술', body: 'GPT-4o + Whisper. 70대 이상 한국어 화자 인식에 최적화된 파이프라인.' },
  { label: '실행', body: '8주 로드맵, 수익화 첫달 목표. 전략이 아니라 실행입니다.' },
  { label: '인연', body: '만든 사람이 직접 부모님에게 쓰고 싶어서 만들었습니다.' },
];

const LAYERS = [
  'Layer 0 (지금): 인터뷰 플로우 + AI 대화',
  'Layer 1 (4월): 결제 + 다중 세션 + 이메일',
  'Layer 2 (6월): 트랜스크립트 편집 + 공유',
  'Layer 3+: 인증, 다국어, 공개 아카이브',
];

export default function VisionPage() {
  return (
    <div className="min-h-dvh bg-cream">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24 flex flex-col gap-20">

        {/* 1. Hero / Thesis */}
        <FadeSection>
          <p className="text-xs uppercase tracking-[0.2em] text-stone mb-4">Vision &amp; Roadmap</p>
          <h1 className="font-serif text-[28px] md:text-[38px] font-bold leading-tight text-bark text-balance">
            합성 콘텐츠가 범람합니다. 음성 복제가 일상이 됩니다. 합성 가능한 시대에, 합성되지 않은 인간의 목소리가 가장 희소한 자산이 됩니다.
          </h1>
          <p className="mt-6 text-[18px] text-stone leading-relaxed">
            실타래는 그 목소리를 수집하는 첫 번째 도구입니다.
          </p>
          <ol className="mt-8 flex flex-col gap-2">
            {LAYERS.map((l) => (
              <li key={l} className="flex items-start gap-3 text-[15px] text-stone">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                {l}
              </li>
            ))}
          </ol>
        </FadeSection>

        {/* 2. Quote */}
        <FadeSection>
          <div className="rounded-[12px] bg-bark px-8 py-10 text-center">
            <p className="font-serif text-[20px] leading-[1.9] text-cream/90 italic">
              "개인의 육성이 모이면 집단의 상(像)이 드러납니다."
            </p>
          </div>
        </FadeSection>

        {/* 3. Why This Works */}
        <FadeSection>
          <h2 className="font-serif text-[24px] font-bold text-bark mb-6">왜 이게 됩니까</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WHY_WORKS.map((item) => (
              <div key={item.title} className="rounded-[12px] border border-mist bg-warm-white p-6">
                <h3 className="font-serif text-[16px] font-bold text-bark">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-stone">{item.body}</p>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 4. Comparison */}
        <FadeSection>
          <h2 className="font-serif text-[24px] font-bold text-bark mb-6">경쟁 비교</h2>
          <div className="overflow-x-auto rounded-[12px] border border-mist">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mist-light">
                  <th className="px-4 py-3 text-left font-medium text-stone">항목</th>
                  <th className="px-4 py-3 text-center font-medium text-stone">StoryWorth</th>
                  <th className="px-4 py-3 text-center font-medium text-stone">Remento</th>
                  <th className="px-4 py-3 text-center font-bold text-bark">실타래</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist bg-warm-white">
                {COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-4 py-3 text-stone">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-stone">{row.storyworth}</td>
                    <td className="px-4 py-3 text-center text-stone">{row.remento}</td>
                    <td className="px-4 py-3 text-center font-bold text-bark">{row.siltare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeSection>

        {/* 5. 8-Week Plan */}
        <FadeSection>
          <h2 className="font-serif text-[24px] font-bold text-bark mb-6">8주 실행 계획</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {EIGHT_WEEKS.map((w) => (
              <div key={w.period} className="rounded-[12px] border border-mist bg-warm-white p-6">
                <p className="text-xs uppercase tracking-widest text-amber mb-1">{w.period}</p>
                <h3 className="font-serif text-[16px] font-bold text-bark mb-3">{w.title}</h3>
                <ul className="flex flex-col gap-1.5">
                  {w.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[14px] text-stone">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stone/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 6. Revenue */}
        <FadeSection>
          <h2 className="font-serif text-[24px] font-bold text-bark mb-6">수익 모델</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {REVENUE_TIERS.map((t) => (
              <div
                key={t.name}
                className={`rounded-[12px] border-2 p-6 ${
                  t.featured ? 'border-amber bg-warm-white shadow-md' : 'border-mist bg-warm-white'
                }`}
              >
                {t.featured && (
                  <span className="inline-block rounded-full bg-amber px-2.5 py-0.5 text-xs font-medium text-warm-white mb-3">
                    {t.desc}
                  </span>
                )}
                <p className="font-serif text-[18px] font-bold text-bark">{t.name}</p>
                <p className="text-[22px] font-bold tabular-nums text-amber mt-1">{t.price}</p>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-stone">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber/60" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 text-[14px] text-stone">
            <div>
              <p className="font-bold text-bark mb-1">왜 카카오톡인가</p>
              <p className="leading-relaxed">50-70대 부모님이 가장 많이 쓰는 채널. 링크 하나로 시작.</p>
            </div>
            <div>
              <p className="font-bold text-bark mb-1">시즌 비즈니스</p>
              <p className="leading-relaxed">어버이날(5월), 추석, 설 전후 구매 피크. 예측 가능한 계절 수요.</p>
            </div>
            <div>
              <p className="font-bold text-bark mb-1">B2B 확장</p>
              <p className="leading-relaxed">요양원, 종중, 종교 단체. 기관 단위 계약 가능.</p>
            </div>
          </div>
        </FadeSection>

        {/* 7. Global Quote */}
        <FadeSection>
          <div className="rounded-[12px] bg-bark px-8 py-10 text-center">
            <p className="font-serif text-[20px] leading-[1.9] text-cream/90 italic">
              "한국에서 효도로 시작합니다. #아리랑으로 세계에 닿습니다."
            </p>
          </div>
        </FadeSection>

        {/* 8. Global */}
        <FadeSection>
          <h2 className="font-serif text-[24px] font-bold text-bark mb-6">글로벌 비전</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { title: '왜 아리랑인가', body: '아리랑은 이별, 고향, 그리움의 서사입니다. 한국인의 집단 무의식이자 보편 서사의 원형.' },
              { title: '한국에서 글로벌로', body: '재외동포 730만명. 일본, 미국, 중국의 한인 커뮤니티. 효도는 동아시아 공통 가치입니다.' },
              { title: '보편 서사', body: '부모님의 이야기는 어느 나라에서나 팔립니다. 언어만 바꾸면 됩니다.' },
              { title: '공감의 플랫폼', body: '개인의 이야기가 쌓이면 집단의 기억이 됩니다. Corpus → 연구 → 정체성 아카이브.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[12px] border border-mist bg-warm-white p-6">
                <h3 className="font-serif text-[16px] font-bold text-bark">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-stone">{item.body}</p>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 9. Why Us */}
        <FadeSection>
          <h2 className="font-serif text-[24px] font-bold text-bark mb-6">왜 우리입니까</h2>
          <div className="flex flex-col gap-4">
            {WHY_US.map((item) => (
              <div key={item.label} className="flex gap-4 items-start">
                <span className="mt-1 w-12 shrink-0 font-serif text-[13px] font-bold text-amber">{item.label}</span>
                <p className="text-[15px] leading-relaxed text-stone">{item.body}</p>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 10. Founder */}
        <FadeSection>
          <div className="rounded-[12px] border border-mist bg-warm-white p-8">
            <p className="text-xs uppercase tracking-widest text-stone mb-4">Founder</p>
            <h2 className="font-serif text-[22px] font-bold text-bark">류한 Hahn Ryu</h2>
            <ul className="mt-4 flex flex-col gap-1.5 text-[14px] text-stone">
              {[
                'NodeONE 대표',
                '뿌리깊은나무 연구소 rooted.center 협업',
                '한국 구술사 프로젝트 참여',
                'AI 제품 개발 경력',
                '아버지의 이야기를 기록하고 싶어서 만들었습니다.',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stone/50" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </FadeSection>

        {/* CTA */}
        <FadeSection className="text-center">
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
