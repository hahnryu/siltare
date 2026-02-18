'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';

const LABELS = {
  logo: '🧵 실타래',
  back: '돌아가기',
  title: '자서전 책 만들기',
  subtitle: '어머니의 이야기를 아름다운 책 한 권으로 남겨보세요.',
  packageLabel: '패키지 선택',
  coverLabel: '표지 스타일',
  orderBtn: '주문하기',
  note: '주문 후 4~6주 내 배송됩니다.',
};

const PACKAGES = [
  { id: 'basic', name: '기본 패키지', price: '₩79,000', desc: '무선 제본, 200페이지, 1부', features: ['고품질 무선 제본', '200페이지 내외', '텍스트 위주 레이아웃'] },
  { id: 'premium', name: '프리미엄 패키지', price: '₩129,000', desc: '양장 제본, 250페이지, 1부 + 디지털', features: ['고급 양장 제본', '250페이지 내외', '사진 삽입 레이아웃', '디지털 PDF 포함'] },
  { id: 'family', name: '가족 패키지', price: '₩199,000', desc: '양장 제본 3부 + 디지털', features: ['고급 양장 제본 3부', '가족 전체에게 선물', '사진 삽입 레이아웃', '디지털 PDF 포함'] },
];

const COVER_STYLES = ['클래식 베이지', '모던 다크', '플로럴 화이트'];

export default function BookPage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const [selectedCover, setSelectedCover] = useState('클래식 베이지');

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-[520px] px-4 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-[14px] text-stone hover:text-bark transition-colors mb-6">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {LABELS.back}
        </button>
        <h1 className="font-serif text-[26px] font-bold text-bark mb-2">{LABELS.title}</h1>
        <p className="text-[15px] text-stone mb-8 leading-relaxed">{LABELS.subtitle}</p>

        <div className="mb-8">
          <h2 className="text-[16px] font-medium text-bark mb-3">{LABELS.packageLabel}</h2>
          <div className="flex flex-col gap-3">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`w-full text-left rounded-[12px] border p-4 transition-all ${selectedPackage === pkg.id ? 'border-amber bg-amber/10' : 'border-mist bg-warm-white hover:border-amber/50'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[16px] font-medium text-bark">{pkg.name}</p>
                    <p className="text-[13px] text-stone mt-0.5">{pkg.desc}</p>
                    <ul className="mt-2 space-y-0.5">
                      {pkg.features.map((f) => (
                        <li key={f} className="text-[13px] text-leaf flex items-center gap-1.5">
                          <span className="text-amber">+</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="text-[18px] font-bold text-bark whitespace-nowrap">{pkg.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-[16px] font-medium text-bark mb-3">{LABELS.coverLabel}</h2>
          <div className="flex gap-2 flex-wrap">
            {COVER_STYLES.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedCover(style)}
                className={`px-4 h-[40px] rounded-[6px] border text-[14px] transition-all ${selectedCover === style ? 'border-amber bg-amber/10 text-bark' : 'border-mist bg-warm-white text-stone hover:border-amber/50'}`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => alert('준비 중입니다')}
          className="w-full h-[56px] rounded-[6px] bg-bark text-warm-white text-[18px] font-medium hover:bg-bark-light transition-colors"
        >
          {LABELS.orderBtn}
        </button>
        <p className="mt-3 text-center text-[13px] text-stone">{LABELS.note}</p>
      </main>
      <footer className="py-6 text-center border-t border-mist mt-auto">
        <a href="/" className="text-[12px] text-stone hover:text-bark transition-colors">🧵 실타래</a>
      </footer>
    </div>
  );
}
