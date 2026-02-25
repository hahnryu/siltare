// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as Blob;
    const interviewId = formData.get('interviewId') as string;
    const chunkId = formData.get('chunkId') as string;
    const mimeType = formData.get('mimeType') as string;

    if (!audio || !interviewId || !chunkId || !mimeType) {
      return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
    }

    const ext = mimeType.includes('webm') ? 'webm' : 'mp4';
    const path = `${interviewId}/${chunkId}.${ext}`;

    const { error } = await supabase.storage
      .from('audio-chunks')
      .upload(path, audio, { contentType: mimeType });

    if (error) {
      console.error('[ERROR] Audio upload failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ storagePath: path });
  } catch (err) {
    console.error('[ERROR] Audio upload exception:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
