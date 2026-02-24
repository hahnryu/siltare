// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';
import { createAudioChunk } from '@/lib/store';
import { AudioChunk } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const chunk: AudioChunk = await req.json();

    if (!chunk.id || !chunk.interviewId || !chunk.mimeType) {
      return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
    }

    await createAudioChunk(chunk);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
