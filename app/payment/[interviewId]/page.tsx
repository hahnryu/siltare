'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadTossPayments, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

const PRODUCTS = {
  'record-preservation': {
    name: '기록 보관',
    amount: 9900,
    description: '음성 원본 영구 보관 + AI 편집 요약 + 챕터 자동 생성',
  },
} as const;

export default function PaymentPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const router = useRouter();
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const product = PRODUCTS['record-preservation'];

  const orderId = `siltare_${interviewId}_${Date.now()}`;

  useEffect(() => {
    (async () => {
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      const w = tossPayments.widgets({ customerKey: TossPaymentsWidgets.ANONYMOUS });
      await w.setAmount({ currency: 'KRW', value: product.amount });
      setWidgets(w);
    })();
  }, []);

  useEffect(() => {
    if (!widgets) return;
    (async () => {
      await widgets.renderPaymentMethods({
        selector: '#payment-methods',
        variantKey: 'DEFAULT',
      });
      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });
      setReady(true);
    })();
  }, [widgets]);

  const handlePayment = async () => {
    if (!widgets || loading) return;
    setLoading(true);
    try {
      await widgets.requestPayment({
        orderId,
        orderName: product.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        metadata: { interviewId },
      });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAF6F0' }}>
      <div className="max-w-[520px] mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold" style={{ color: '#2C2418' }}>
            기록 보관하기
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#8B7355' }}>
            {product.description}
          </p>
        </div>

        <div className="rounded-xl p-6 mb-6"
          style={{ background: '#FFFDF9', border: '1px solid #E8E0D4' }}>
          <div className="flex justify-between items-center">
            <span style={{ color: '#2C2418' }}>{product.name}</span>
            <span className="text-xl font-bold" style={{ color: '#2C2418' }}>
              {product.amount.toLocaleString()}원
            </span>
          </div>
        </div>

        <div id="payment-methods" className="mb-4" />
        <div id="agreement" className="mb-6" />

        <button
          onClick={handlePayment}
          disabled={!ready || loading}
          className="w-full py-4 rounded-lg text-white font-bold text-lg transition-opacity"
          style={{
            background: ready ? '#C4956A' : '#9E9585',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '결제 진행 중...' : `${product.amount.toLocaleString()}원 결제하기`}
        </button>

        <button
          onClick={() => router.push(`/archive/${interviewId}`)}
          className="w-full mt-3 py-3 text-sm"
          style={{ color: '#8B7355' }}
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}
