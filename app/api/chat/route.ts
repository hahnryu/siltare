// TODO: add auth check here
import { NextRequest } from 'next/server';
import { getInterview, updateInterview } from '@/lib/store';
import { generateSystemPrompt } from '@/lib/prompts';
import { Message } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { interviewId, message } = await req.json();

    const interview = await getInterview(interviewId);
    if (!interview) {
      return new Response('인터뷰를 찾을 수 없습니다', { status: 404 });
    }

    // 상태 업데이트
    if (interview.status === 'pending') {
      await updateInterview(interviewId, { status: 'active' });
    }

    // 사용자 메시지 저장
    if (message) {
      const userMsg: Message = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      interview.messages.push(userMsg);
    }

    // 시스템 프롬프트 생성
    const systemPrompt = generateSystemPrompt(interview);

    // OpenAI API 호출
    const openaiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...interview.messages.map(m => ({
        role: m.role as 'assistant' | 'user',
        content: m.content,
      })),
    ];

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: openaiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!openaiRes.ok || !openaiRes.body) {
      return new Response('AI 응답 실패', { status: 500 });
    }

    // SSE 스트리밍 응답
    const reader = openaiRes.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          controller.enqueue(new TextEncoder().encode(chunk));

          // 전체 응답 수집
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const parsed = JSON.parse(line.slice(6));
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) fullContent += delta;
              } catch {
                // skip
              }
            }
          }
        }

        // 어시스턴트 메시지 저장
        if (fullContent) {
          const assistantMsg: Message = {
            role: 'assistant',
            content: fullContent,
            timestamp: new Date().toISOString(),
          };
          interview.messages.push(assistantMsg);
          await updateInterview(interviewId, { messages: interview.messages });
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch {
    return new Response('서버 오류', { status: 500 });
  }
}
