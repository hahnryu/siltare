// TODO: add auth check here
import { NextResponse } from 'next/server';
import { getAllInterviews } from '@/lib/store';

export async function GET() {
  try {
    const interviews = await getAllInterviews();
    return NextResponse.json({ interviews });
  } catch (err) {
    console.error('[ERROR] /api/interviews:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
