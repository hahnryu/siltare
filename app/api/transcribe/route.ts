// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as Blob;

    if (!audio) {
      return NextResponse.json({ error: '음성 파일이 필요합니다' }, { status: 400 });
    }

    const whisperForm = new FormData();
    whisperForm.append('file', audio, 'audio.webm');
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('language', 'ko');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperForm,
    });

    if (!res.ok) {
      return NextResponse.json({ error: '음성 인식 실패' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ text: data.text });
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
