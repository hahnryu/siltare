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
      { threshold: 0.08 }
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

const DATA_LAYERS = [
  {
    num: '1',
    title: '개인의 목소리',
    body: '한 사람의 생애 인터뷰. 음성 원본 + 전사본 + AI 요약. 합성 불가능한 원본 데이터.',
  },
  {
    num: '2',
    title: '연결되는 서사 (온톨로지)',
    body: '인터뷰에서 추출된 인물, 장소, 시간, 사건이 자동으로 연결됩니다. A의 "부산 영도 피난"과 B의 "부산 영도 피난"이 같은 사건이면, 두 서사가 엮입니다. Human Voice Graph.',
  },
  {
    num: '3',
    title: '집단 기억의 코퍼스',
    body: '수만 개의 인터뷰가 쌓이면 세대별, 지역별, 관계별 패턴이 드러납니다. 합성 불가능한 원본 데이터로 구축되는 집단 기억의 지도. 공공 서사의 정당성이 여기서 나옵니다.',
  },
  {
    num: '4',
    title: '읽기가 쓰기를 부릅니다',
    body: '타인의 이야기를 읽습니다. 나와 비슷한 세대의 부모님, 같은 동네 출신 어르신, 같은 시대를 겪은 낯선 가족. 그 이야기에 공감하는 순간, 우리 부모님에게도 실타래를 보내게 됩니다. 아카이브가 플랫폼이 되는 지점.',
  },
];

const WHY_WORKS = [
  { title: '콜드스타트 없음', body: '링크 하나로 시작. 가입 없이 부모님이 바로 대화할 수 있습니다.' },
  { title: 'AI의 깊이', body: 'GPT-4o 기반 구술사 연구자 페르소나. 사람보다 더 끈질기게, 더 정중하게 묻습니다. 부드럽지만 체계적으로 생애 전체를 커버합니다. 30분 안에.' },
  { title: '원본성의 해자', body: '합성 데이터 시대에 "이 음성은 진짜 사람이 말한 것"이라는 증명이 가치를 갖습니다. 온체인 타임스탬프로 원본성을 기록합니다. 인터뷰가 쌓일수록 합성 불가능한 코퍼스가 됩니다.' },
  { title: '네트워크 효과', body: '한 집안에서 시작해 형제, 자녀, 손자로 퍼집니다. 대화 속에 등장한 인물에게 실타래를 보낼 수 있습니다. 가족 단위 바이럴.' },
];

const COMPARISON = [
  { feature: '인터뷰 방식', storyworth: '텍스트 Q&A', remento: '혼자 녹화', siltare: 'AI 실시간 대화' },
  { feature: '시작까지', storyworth: '가입 + 결제', remento: '$99 결제', siltare: '링크 클릭' },
  { feature: '소요 시간', storyworth: '1년', remento: '1년', siltare: '30분' },
  { feature: '핵심 경험', storyworth: '글쓰기', remento: '혼자 말하기', siltare: '대화하기' },
  { feature: '한국어', storyworth: '미지원', remento: '미지원', siltare: '네이티브' },
  { feature: '원본 증명', storyworth: '없음', remento: '없음', siltare: '온체인 타임스탬프' },
  { feature: '데이터 자산', storyworth: '개별 텍스트', remento: '개별 영상', siltare: 'Human Voice Graph' },
];

const EIGHT_WEEKS = [
  { period: 'Week 1-2', title: 'Core', items: ['인터뷰 플로우 완성', 'AI 대화 품질 검증', 'Whisper 정확도 테스트', '카카오톡 공유 API 연동', '모바일 PWA'] },
  { period: 'Week 3-4', title: 'Archive', items: ['아카이브 페이지', '챕터 자동 생성', '가족 공유 링크', '자서전 책 생성 파이프라인', '결과 전달 (카카오톡 알림)'] },
  { period: 'Week 5-6', title: 'Monetization', items: ['Toss/카카오페이 결제', '책 주문 플로우', '이메일 결과 전송', '파일럿 인터뷰 50건', '카카오 선물하기 입점 준비'] },
  { period: 'Week 7-8', title: 'Launch', items: ['데모데이 (4월 말)', '어버이날 캠페인 (5.8)', 'KakaoTalk 공유/PR', '바이럴 루프 최적화'] },
];

const ROADMAP = [
  { label: 'Layer 0 (지금)', body: '인터뷰 플로우 + AI 대화' },
  { label: 'Layer 1 (4월)', body: '결제 + 다중 세션 + 이메일' },
  { label: 'Layer 2 (6월)', body: '트랜스크립트 편집 + 공유' },
  { label: 'Layer 3+', body: '인증, 다국어, 공개 아카이브' },
];

const REVENUE_TIERS = [
  { name: '무료', price: '₩0', features: ['AI 대화 1회', '텍스트 아카이브', '공유 링크'], featured: false },
  { name: '선물', price: '₩39,000', features: ['음성 원본 보관', 'AI 전사본 + 요약', '가족 공유', '이메일 전달'], featured: true },
  { name: '자서전', price: '₩59,000~', features: ['위 모두 포함', '소프트커버 책 1권', '표지 커스터마이징'], featured: false },
];

const REVENUE_NOTES = [
  { title: '왜 카카오톡인가', body: '50-70대 부모님이 가장 많이 쓰는 채널. 링크 하나로 시작. 카카오 선물하기 "경험" 카테고리 입점이 핵심 마일스톤.' },
  { title: '시즌 비즈니스', body: '어버이날(5월), 추석, 설 전후 구매 피크. 비시즌에는 "기록이 기록을 부르는" 바이럴 루프로 상시 전환.' },
  { title: 'B2B 확장', body: '요양원, 종중, 종교 단체, 지자체 구술사 프로그램, 대학 구술 아카이브, 장례/추모 서비스. 기관 단위 계약 가능.' },
];

const GLOBAL_ITEMS = [
  { title: '왜 아리랑인가', body: '아리랑은 이별, 고향, 그리움의 서사입니다. 한국인의 집단 무의식이자 보편 서사의 원형. 모든 문화권에 부모가 있고, 모든 부모는 죽고, 모든 자녀는 "그때 물어볼 걸"이라고 후회합니다. 이 감정에 국경이 없습니다.' },
  { title: '한국에서 글로벌로', body: '재외동포 730만명. 일본(敬老の日), 중화권(重陽節), 미주 디아스포라 순서로. AI 인터뷰는 언어만 바꾸면 전 세계에서 작동합니다.' },
  { title: '보편 서사 추출', body: '수십만 개의 인터뷰가 쌓이면, 문화와 언어가 달라도 반복되는 서사 구조가 보이기 시작합니다. 전쟁, 이주, 가난, 사랑, 후회, 감사. 세대를 관통하는 패턴. 그것이 인류의 얼굴입니다.' },
  { title: '공감의 플랫폼', body: '개인의 이야기가 쌓이면 집단의 기억이 됩니다. 남의 이야기를 읽는 것 자체가 경험. "부산 영도 피난"을 검색하면 서로 다른 가족의 시선이 교차합니다. 큐레이션된 이야기는 뉴스레터, 팟캐스트, 숏폼으로 확장. 마케팅 채널이자 독립 수익원.' },
];

const CREDENTIALS = [
  { label: '계보', body: '1976년 뿌리깊은나무 민중 자서전 20권. 이름 없는 이들의 육성을 토박이말로 기록한 한국 구술사의 전범. 실타래는 이 기록의 디지털 계승.', link: { href: 'https://rooted.center', text: '뿌리깊은나무 연구소 rooted.center' } },
  { label: '구조', body: 'HOMP (인프라) → 실타래 (제품) → 뿌리깊은나무 연구소 (연구). 세 레이어가 하나의 비전 아래.' },
  { label: '기술', body: 'NodeONE Inc. (2018~). 다중 프로토콜 노드 운영.\nAI Alignment 특허 출원: Representation Stability Layer. 온체인 원본성 증명은 기존 인프라 위에서.' },
  { label: '실행', body: 'TEDxSeoul 창립 (2009). D.CAMP 창립멤버. 토큰 이코노미 설계. AI 정책 프레임워크 설계 (국회).' },
];

const FOUNDER_TITLES = [
  'NodeONE Inc. CEO',
  'TEDxSeoul 창립자',
  'D.CAMP 창립멤버',
  'Sofia University 트랜스퍼스널 심리학',
];

export default function VisionPage() {
  return (
    <div className="min-h-dvh bg-cream">
      <Header />

      <main className="mx-auto max-w-[720px] px-6 pt-28 pb-20 flex flex-col gap-20">

        {/* 1. Hero */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-8">Vision &amp; Roadmap</p>
          <h1 className="font-serif text-[clamp(22px,3.2vw,30px)] font-bold leading-[1.6] tracking-tight text-bark">
            모든 정보가 합성 가능한 AGI 시대.<br />
            합성되지 않은 인간의 육성과<br />
            그에 담긴 뜻이<br />
            가장 희소한 자산이 됩니다.
          </h1>
          <div className="mt-8 max-w-[640px] flex flex-col gap-5 text-[16px] leading-[2] text-stone font-light">
            <p>실타래는 그 목소리를 수집하는 첫 번째 도구입니다.</p>
            <p>효도 선물로 시작합니다. 부모님께 링크를 보내면, AI가 생애를 묻고 기록합니다. 30분이면 충분합니다. 하지만 거기서 끝나지 않습니다.</p>
          </div>
          <div className="mt-12 flex flex-col divide-y divide-mist">
            {DATA_LAYERS.map((layer) => (
              <div key={layer.num} className="py-6 grid grid-cols-[32px_1fr] gap-4 items-baseline">
                <span className="font-['Cormorant_Garamond',Georgia,serif] text-[20px] text-amber/70">{layer.num}</span>
                <div>
                  <h3 className="font-serif text-[16px] font-bold text-bark mb-1">{layer.title}</h3>
                  <p className="text-[14px] text-stone leading-[1.7] font-light">{layer.body}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 2. Quote */}
        <FadeSection>
          <div className="bg-bark px-8 py-12 text-center">
            <blockquote className="font-serif text-[clamp(18px,2.8vw,26px)] font-light leading-[1.75] text-cream/90 italic">
              개인의 육성이 모이면<br />집단의 상(像)이 드러납니다.
            </blockquote>
          </div>
        </FadeSection>

        {/* 3. Why This Works */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-4">Why This Works</p>
          <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] font-bold text-bark mb-2">왜 이게 됩니까.</h2>
          <div className="flex flex-col gap-8 mt-10">
            {WHY_WORKS.map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-[16px] font-bold text-bark mb-1.5">{item.title}</h3>
                <p className="text-[15px] text-stone leading-[1.8] font-light">{item.body}</p>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 4. Comparison */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-4">Comparison</p>
          <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] font-bold text-bark mb-8">기존 서비스와 다릅니다.</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-mist">
                  <th className="text-left px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.08em]"></th>
                  <th className="text-left px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.08em]">StoryWorth</th>
                  <th className="text-left px-4 py-3 font-medium text-stone text-[11px] uppercase tracking-[0.08em]">Remento</th>
                  <th className="text-left px-4 py-3 font-bold text-bark text-[11px] uppercase tracking-[0.08em]">실타래</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-mist/60">
                    <td className="px-4 py-2.5 text-stone font-light">{row.feature}</td>
                    <td className="px-4 py-2.5 text-stone font-light">{row.storyworth}</td>
                    <td className="px-4 py-2.5 text-stone font-light">{row.remento}</td>
                    <td className="px-4 py-2.5 font-bold text-bark">{row.siltare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeSection>

        {/* 5. 8-Week Plan */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-4">8-Week Plan</p>
          <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] font-bold text-bark mb-2">실행 계획</h2>
          <p className="text-[15px] text-stone mb-8 font-light">첫 수익 목표: 2026년 5월 8일 어버이날.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {EIGHT_WEEKS.map((w) => (
              <div key={w.period} className="bg-mist-light p-6 rounded-[6px]">
                <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-stone mb-2">{w.period}</p>
                <h3 className="font-serif text-[16px] font-bold text-bark mb-3">{w.title}</h3>
                <ul className="flex flex-col gap-1">
                  {w.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[14px] text-stone font-light leading-[1.6]">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 6. Roadmap */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-4">Product Roadmap</p>
          <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] font-bold text-bark mb-8">제품 발전 경로</h2>
          <div className="flex flex-col divide-y divide-mist/60">
            {ROADMAP.map((item) => (
              <div key={item.label} className="grid grid-cols-[100px_1fr] gap-5 py-4">
                <span className="text-[13px] font-medium text-amber pt-0.5">{item.label}</span>
                <p className="text-[15px] text-stone font-light leading-[1.7]">{item.body}</p>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 7. Revenue */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-4">Revenue</p>
          <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] font-bold text-bark mb-8">수익 모델</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {REVENUE_TIERS.map((t) => (
              <div
                key={t.name}
                className={`rounded-[6px] border p-6 ${
                  t.featured ? 'border-bark bg-bark text-cream' : 'border-mist bg-warm-white'
                }`}
              >
                <p className={`text-[11px] font-medium tracking-[0.1em] uppercase mb-1.5 ${t.featured ? 'text-stone' : 'text-stone'}`}>{t.name}</p>
                <p className={`font-['Cormorant_Garamond',Georgia,serif] text-[24px] font-semibold mb-3 ${t.featured ? 'text-cream' : 'text-bark'}`}>{t.price}</p>
                <ul className="flex flex-col gap-1">
                  {t.features.map((f) => (
                    <li key={f} className={`text-[13px] font-light leading-[1.6] ${t.featured ? 'text-stone' : 'text-stone'}`}>
                      · {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-6">
            {REVENUE_NOTES.map((note) => (
              <div key={note.title}>
                <h3 className="font-serif text-[16px] font-bold text-bark mb-1.5">{note.title}</h3>
                <p className="text-[15px] text-stone font-light leading-[1.8]">{note.body}</p>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 8. Global Quote */}
        <FadeSection>
          <div className="bg-bark px-8 py-12 text-center">
            <blockquote className="font-serif text-[clamp(18px,2.8vw,26px)] font-light leading-[1.75] text-cream/90 italic">
              한국에서 효도로 시작합니다.<br />
              3.20 BTS 앨범 &apos;아리랑&apos; 출시에 맞춰<br />
              #arirang 으로 세계에 닿습니다.<br />
              <br />
              수십만 개의 인터뷰에서<br />
              보편 서사를 추출합니다.<br />
              인류의 얼굴을 뽑습니다.
            </blockquote>
          </div>
        </FadeSection>

        {/* 9. Global */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-4">Global</p>
          <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] font-bold text-bark mb-8">
            아리랑에서 시작해서<br />보편 서사로.
          </h2>
          <div className="flex flex-col gap-8">
            {GLOBAL_ITEMS.map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-[16px] font-bold text-bark mb-1.5">{item.title}</h3>
                <p className="text-[15px] text-stone font-light leading-[1.8]">{item.body}</p>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 10. HOMP Vision */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-4">Vision</p>
          <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] font-bold text-bark mb-8">Human-Origin Memory Protocol</h2>
          <div className="max-w-[640px] flex flex-col gap-5 text-[16px] leading-[2] text-stone font-light">
            <p>실타래는 HOMP(Human-Origin Memory Protocol)의 첫 번째 애플리케이션입니다.</p>
            <p>모든 인터뷰에서 언급되는 인물, 장소, 시간, 사건이 온톨로지로 연결됩니다. 인터뷰 A의 "부산 영도 피난"과 인터뷰 B의 "부산 영도 피난"이 같은 장소와 시간이면, 두 서사가 엮입니다. 이것이 Human Voice Graph입니다.</p>
            <p>인터뷰가 쌓일수록 그래프가 풍부해지고, 데이터의 가치가 비선형으로 증가합니다. Human Voice Graph의 종착점은 개별 가족의 기록이 아니라, 인류 공통 서사의 지도입니다.</p>
          </div>
        </FadeSection>

        {/* 11. Why Us */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-4">Why Us</p>
          <h2 className="font-serif text-[clamp(24px,3.5vw,34px)] font-bold text-bark mb-8">왜 우리인가.</h2>
          <div className="flex flex-col divide-y divide-mist/60">
            {CREDENTIALS.map((c) => (
              <div key={c.label} className="grid grid-cols-[80px_1fr] gap-5 py-4">
                <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-stone pt-0.5">{c.label}</span>
                <div className="text-[15px] text-stone font-light leading-[1.7]">
                  {c.body.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                  {c.link && (
                    <><br /><a href={c.link.href} target="_blank" rel="noopener noreferrer" className="text-stone underline underline-offset-3 hover:text-bark transition-colors">{c.link.text}</a></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* 12. Founder */}
        <FadeSection>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-8">Founder</p>
          <h2 className="font-serif text-[24px] font-bold text-bark mb-4">류한석 Hahn Ryu</h2>
          <div className="flex flex-col text-[14px] text-stone font-light leading-[1.9]">
            {FOUNDER_TITLES.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="mt-4 text-[15px] text-stone font-light italic">아버지의 이야기를 기록하고 싶어서 만들었습니다.</p>
          <a
            href="https://hahnryu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-[14px] text-stone font-semibold hover:text-bark transition-colors"
          >
            hahnryu.com
          </a>
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
