'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF6F0' }}>
      <div className="text-center px-4">
        <p className="text-xl mb-2" style={{ color: '#2C2418' }}>결제에 실패했습니다</p>
        <p className="text-sm mb-4" style={{ color: '#8B7355' }}>
          {message || '잠시 후 다시 시도해 주세요.'}
        </p>
        {code && (
          <p className="text-xs mb-4" style={{ color: '#9E9585' }}>
            오류 코드: {code}
          </p>
        )}
        <button
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg"
          style={{ background: '#C4956A', color: 'white' }}
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}
