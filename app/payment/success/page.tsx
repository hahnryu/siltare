'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
  const [interviewId, setInterviewId] = useState('');

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setStatus('error');
      return;
    }

    const id = orderId.split('_')[1];
    setInterviewId(id);

    fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setTimeout(() => router.push(`/archive/${id}`), 3000);
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF6F0' }}>
      <div className="text-center px-4">
        {status === 'confirming' && (
          <p style={{ color: '#8B7355' }}>결제를 확인하고 있습니다...</p>
        )}
        {status === 'success' && (
          <>
            <p className="text-2xl mb-2" style={{ color: '#2C2418' }}>감사합니다</p>
            <p style={{ color: '#8B7355' }}>
              기록이 안전하게 보관됩니다.
            </p>
            <p className="mt-4 text-sm" style={{ color: '#9E9585' }}>
              잠시 후 이야기 기록으로 이동합니다...
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-xl mb-2" style={{ color: '#2C2418' }}>결제에 실패했습니다</p>
            <p style={{ color: '#8B7355' }}>
              잠시 후 다시 시도해 주세요.
            </p>
            <button
              onClick={() => router.push(`/archive/${interviewId}`)}
              className="mt-4 px-6 py-3 rounded-lg"
              style={{ background: '#C4956A', color: 'white' }}
            >
              돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF6F0' }}>
        <p style={{ color: '#8B7355' }}>로딩 중...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
