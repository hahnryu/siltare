// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';
import { getAudioChunks } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: { interviewId: string } }
) {
  try {
    const { interviewId } = params;
    const chunks = await getAudioChunks(interviewId);
    return NextResponse.json({ chunks });
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
