import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from '@/lib/store';

export async function GET(req: NextRequest) {
  const interviewId = req.nextUrl.searchParams.get('interviewId');
  if (!interviewId) {
    return NextResponse.json({ error: 'interviewId 필요' }, { status: 400 });
  }

  try {
    const messages = await getMessages(interviewId);
    return NextResponse.json(messages);
  } catch (err) {
    console.error('Failed to get messages:', err);
    return NextResponse.json({ error: '메시지 로드 실패' }, { status: 500 });
  }
}
