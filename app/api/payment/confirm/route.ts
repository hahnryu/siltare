import { NextResponse } from 'next/server';
import { updateInterview } from '@/lib/store';

// TODO: add auth check here

export async function POST(req: Request) {
  const { paymentKey, orderId, amount } = await req.json();

  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64');

  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encryptedSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: result.message || '결제 승인 실패' },
      { status: 400 }
    );
  }

  const interviewId = orderId.split('_')[1];

  await updateInterview(interviewId, {
    payment: {
      paymentKey: result.paymentKey,
      orderId: result.orderId,
      amount: result.totalAmount,
      method: result.method,
      status: result.status,
      approvedAt: result.approvedAt,
    },
  } as any);

  return NextResponse.json({ success: true, interviewId });
}
