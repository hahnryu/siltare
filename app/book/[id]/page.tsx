'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

const LABELS = {
  back: '돌아가기',
  archiveLink: '아카이브',
  storyTitle: '어머니의 이야기',
  pageTitle: '책 만들기',
  packageHeading: '패키지 선택',
  customHeading: '표지 스타일 선택',
  dedicationHeading: '헌정사',
  dedicationPrefix: '이 책을',
  dedicationSuffix: '에게 바칩니다',
  dedicationPlaceholder: '소중한 가족',
  extraCopiesHeading: '추가 인쇄',
  extraCopiesPrice: '₩25,000 / 권',
  orderSummaryHeading: '주문 요약',
  totalLabel: '합계',
  orderBtn: '주문하기',
  productionNote: '제작 기간: 영업일 기준 5~7일',
  previewBtn: '미리보기',
};

const PACKAGES = [
  {
    id: 'digital',
    name: '디지털 아카이브',
    price: 39000,
    tag: '기본 포함',
    tagStyle: 'bg-mist text-stone',
    features: ['음성 원본 영구 보관', 'AI 전사본 + 요약', '온라인 공유 링크'],
  },
  {
    id: 'storybook',
    name: '스토리북',
    price: 79000,
    tag: '추천',
    tagStyle: 'bg-amber text-warm-white',
    isRecommended: true,
    features: ['위 포함 +', 'AI 편집 소프트커버 1권 (80-100페이지)', '표지 커스터마이징'],
  },
  {
    id: 'premium',
    name: '프리미엄 패밀리',
    price: 199000,
    tag: '선물용',
    tagStyle: 'bg-mist-light text-bark',
    features: ['위 포함 +', '하드커버 5권', '고급 박스 패키징', '가족 전원 디지털 공유'],
  },
];

const COVER_STYLES = [
  { id: 'minimal', name: '미니멀', colors: ['oklch(0.96 0.02 80)', 'oklch(0.93 0.03 75)'], accent: 'oklch(0.65 0.15 55)' },
  { id: 'classic', name: '클래식', colors: ['oklch(0.40 0.06 50)', 'oklch(0.32 0.05 45)'], accent: 'oklch(0.82 0.12 70)' },
  { id: 'modern', name: '모던', colors: ['oklch(0.25 0.02 50)', 'oklch(0.20 0.02 45)'], accent: 'oklch(0.72 0.14 60)' },
];

const EXTRA_COPY_PRICE = 25000;

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`;
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
      <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookMockup() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div style={{ perspective: '1200px' }}>
        <div
          className="relative w-52 h-72 md:w-60 md:h-80"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-18deg) rotateX(2deg)' }}
        >
          {/* Spine */}
          <div
            className="absolute left-0 top-0 h-full w-6 origin-left"
            style={{
              transform: 'rotateY(90deg) translateZ(-12px)',
              background: 'linear-gradient(to right, oklch(0.55 0.12 55), oklch(0.62 0.13 58))',
            }}
          />
          {/* Front cover */}
          <div
            className="absolute inset-0 rounded-r-sm overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              boxShadow: '6px 6px 20px rgba(0,0,0,0.18), 2px 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <div className="absolute inset-0 bg-[oklch(0.96_0.02_80)]" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber opacity-60" />
            <div className="relative flex flex-col items-center justify-between h-full px-6 py-8">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-px bg-amber/40" />
                <div className="w-12 h-px bg-amber/30" />
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <h2 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-bark/90">
                  어머니의 이야기
                </h2>
                <div className="w-10 h-px bg-amber/50" />
                <p className="text-[10px] text-stone tracking-widest font-light">김영순, 1952-2026</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-px bg-amber/30" />
                <p className="text-[9px] text-stone/70 tracking-[0.2em] uppercase">실타래 × 가족의 기록</p>
              </div>
            </div>
          </div>
          {/* Page edges */}
          <div
            className="absolute right-0 top-1 bottom-1 w-3 origin-right"
            style={{
              transform: 'rotateY(90deg)',
              background: 'repeating-linear-gradient(to bottom, #f5f0e8 0px, #f5f0e8 1px, #ebe5da 1px, #ebe5da 2px)',
            }}
          />
        </div>
      </div>
      <button className="flex items-center gap-2 rounded-[6px] border border-mist bg-warm-white px-4 h-[38px] text-[13px] text-bark hover:bg-mist-light transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        {LABELS.previewBtn}
      </button>
    </div>
  );
}

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState('storybook');
  const [selectedCover, setSelectedCover] = useState('minimal');
  const [dedication, setDedication] = useState('');
  const [extraCopies, setExtraCopies] = useState(0);

  const selectedPkg = PACKAGES.find((p) => p.id === selectedPackage)!;
  const showCustomization = selectedPackage !== 'digital';
  const extraTotal = extraCopies * EXTRA_COPY_PRICE;
  const total = selectedPkg.price + extraTotal;

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="이동 경로" className="mb-8">
          <ol className="flex items-center gap-1.5 text-sm text-stone">
            <li>
              <button onClick={() => router.push(`/archive/${id}`)} className="hover:text-bark transition-colors">
                {LABELS.archiveLink}
              </button>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </li>
            <li>
              <button onClick={() => router.push(`/archive/${id}`)} className="hover:text-bark transition-colors">
                {LABELS.storyTitle}
              </button>
            </li>
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </li>
            <li className="font-medium text-bark" aria-current="page">{LABELS.pageTitle}</li>
          </ol>
        </nav>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: Book preview */}
          <div className="flex flex-col items-center lg:sticky lg:top-12 lg:self-start">
            <BookMockup />
          </div>

          {/* Right: Configuration */}
          <div className="flex flex-col gap-8">
            {/* Package selection */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-bark">{LABELS.packageHeading}</h2>
              <div className="flex flex-col gap-3">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative flex flex-col gap-3 rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
                        isSelected
                          ? 'border-amber bg-warm-white shadow-md'
                          : 'border-mist bg-warm-white/50 hover:border-amber/40'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${pkg.tagStyle}`}>
                          {pkg.tag}
                        </span>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber">
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                              <path d="M2 8l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-lg font-bold text-bark">{pkg.name}</h3>
                        <span className="text-lg font-bold text-amber tabular-nums">{formatPrice(pkg.price)}</span>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-stone">
                            <CheckIcon />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {pkg.id === 'digital' && (
                        <p className="text-xs text-stone/70 italic">(인터뷰 기본 포함)</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customization */}
            {showCustomization && (
              <div className="flex flex-col gap-6 rounded-xl border border-mist bg-warm-white p-5">
                {/* Cover style */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-bark">{LABELS.customHeading}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {COVER_STYLES.map((style) => {
                      const isSelected = selectedCover === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setSelectedCover(style.id)}
                          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                            isSelected ? 'border-amber shadow-sm' : 'border-mist hover:border-amber/40'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <div
                            className="relative h-16 w-12 rounded-sm overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${style.colors[0]}, ${style.colors[1]})`,
                              boxShadow: '2px 2px 6px rgba(0,0,0,0.12)',
                            }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: style.accent }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-1.5">
                              <div className="h-[2px] w-6 rounded-full" style={{ background: style.accent, opacity: 0.6 }} />
                              <div className="h-[1.5px] w-4 rounded-full" style={{ background: style.accent, opacity: 0.4 }} />
                            </div>
                          </div>
                          <span className={`text-xs font-medium ${isSelected ? 'text-bark' : 'text-stone'}`}>
                            {style.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dedication */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="dedication" className="text-sm font-bold text-bark">{LABELS.dedicationHeading}</label>
                  <div className="flex items-center gap-0 text-sm text-stone">
                    <span className="shrink-0 text-bark/70">{LABELS.dedicationPrefix}</span>
                    <input
                      id="dedication"
                      type="text"
                      value={dedication}
                      onChange={(e) => setDedication(e.target.value)}
                      className="mx-2 flex-1 rounded-[6px] border border-mist bg-cream px-3 h-[36px] text-[14px] text-bark placeholder:text-stone focus:outline-none focus:border-amber"
                      placeholder={LABELS.dedicationPlaceholder}
                    />
                    <span className="shrink-0 text-bark/70">{LABELS.dedicationSuffix}</span>
                  </div>
                </div>

                {/* Extra copies */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-bark">{LABELS.extraCopiesHeading}</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone">{LABELS.extraCopiesPrice}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setExtraCopies(Math.max(0, extraCopies - 1))}
                        disabled={extraCopies === 0}
                        aria-label="수량 줄이기"
                        className="h-8 w-8 rounded-[6px] border border-mist bg-warm-white text-bark font-bold hover:bg-mist-light transition-colors disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold tabular-nums text-bark">{extraCopies}</span>
                      <button
                        type="button"
                        onClick={() => setExtraCopies(extraCopies + 1)}
                        aria-label="수량 늘리기"
                        className="h-8 w-8 rounded-[6px] border border-mist bg-warm-white text-bark font-bold hover:bg-mist-light transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order summary */}
            <div className="flex flex-col gap-4 rounded-xl border border-mist bg-warm-white p-5">
              <h3 className="text-lg font-bold text-bark">{LABELS.orderSummaryHeading}</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone">{selectedPkg.name}</span>
                  <span className="font-medium tabular-nums text-bark">{formatPrice(selectedPkg.price)}</span>
                </div>
                {showCustomization && extraCopies > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone">추가 인쇄 {extraCopies}권</span>
                    <span className="font-medium tabular-nums text-bark">{formatPrice(extraTotal)}</span>
                  </div>
                )}
                <div className="h-px bg-mist my-1" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-bark">{LABELS.totalLabel}</span>
                  <span className="text-xl font-bold tabular-nums text-amber">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={() => alert('준비 중입니다')}
                className="w-full h-[52px] rounded-[6px] bg-bark text-warm-white text-base font-bold hover:bg-bark-light transition-colors"
              >
                {LABELS.orderBtn}
              </button>
              <p className="text-center text-xs text-stone">{LABELS.productionNote}</p>
              {/* Payment badges */}
              <div className="flex items-center justify-center gap-3">
                {[
                  { label: '카카오페이', color: 'oklch(0.75 0.16 90)' },
                  { label: '네이버페이', color: 'oklch(0.62 0.18 155)' },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-1.5 rounded-md bg-mist-light px-2.5 py-1.5">
                    <div className="h-3 w-3 rounded-sm" style={{ background: color }} aria-hidden="true" />
                    <span className="text-[11px] font-medium text-stone">{label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 rounded-md bg-mist-light px-2.5 py-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  <span className="text-[11px] font-medium text-stone">신용카드</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center border-t border-mist">
        <a href="/" className="text-[12px] text-stone hover:text-bark transition-colors">🧵 실타래</a>
      </footer>
    </div>
  );
}
