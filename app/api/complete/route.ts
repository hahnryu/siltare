// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';
import { getInterview, updateInterview } from '@/lib/store';
import { entityExtractionPrompt, summaryPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { interviewId } = await req.json();

    const interview = await getInterview(interviewId);
    if (!interview) {
      return NextResponse.json({ error: '인터뷰를 찾을 수 없습니다' }, { status: 404 });
    }

    // 전사본 생성
    const transcript = interview.messages
      .map(m => `[${m.role === 'assistant' ? '실타래' : interview.interviewee.name}] ${m.content}`)
      .join('\n\n');

    // GPT-4o로 요약
    const summaryRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: summaryPrompt },
          { role: 'user', content: transcript },
        ],
        temperature: 0.5,
      }),
    });
    const summaryData = await summaryRes.json();
    const summary = summaryData.choices?.[0]?.message?.content || '';

    // GPT-4o로 개체 추출
    const entityRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: entityExtractionPrompt },
          { role: 'user', content: transcript },
        ],
        temperature: 0.3,
      }),
    });
    const entityData = await entityRes.json();
    let entities;
    try {
      entities = JSON.parse(entityData.choices?.[0]?.message?.content || '{}');
    } catch {
      entities = { persons: [], places: [], times: [], events: [] };
    }

    // 인터뷰 업데이트
    await updateInterview(interviewId, {
      status: 'complete',
      transcript,
      summary,
      entities,
    });

    return NextResponse.json({ transcript, summary, entities });
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
