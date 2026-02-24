// TODO: add auth check here
import { NextRequest } from 'next/server';
import { getInterview, updateInterview } from '@/lib/store';
import { generateSystemPrompt } from '@/lib/prompts';
import { Interview, Message } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { interviewId, message, interviewMeta, clientMessages } = await req.json();

    // Try storage first; fall back to client-provided data (Vercel /tmp not shared across instances)
    let interview = await getInterview(interviewId);

    if (!interview) {
      if (!interviewMeta) {
        return new Response('인터뷰를 찾을 수 없습니다', { status: 404 });
      }
      // Reconstruct from client-provided metadata and message history
      interview = {
        ...interviewMeta,
        messages: (clientMessages || []).map((m: { role: string; content: string }) => ({
          role: m.role as 'assistant' | 'user',
          content: m.content,
          timestamp: new Date().toISOString(),
        })),
      } as Interview;
    }

    // Mark as active (best-effort, don't block on failure)
    if (interview.status === 'pending') {
      updateInterview(interviewId, { status: 'active' }).catch(() => {});
    }

    // Add user message to history
    if (message) {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      interview.messages.push(userMsg);
    }

    // Build system prompt and OpenAI messages
    const systemPrompt = generateSystemPrompt(interview);
    const openaiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...interview.messages.map((m) => ({
        role: m.role as 'assistant' | 'user',
        content: m.content,
      })),
    ];

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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

    const reader = openaiRes.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    const savedInterview = interview; // stable ref for closure

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          controller.enqueue(new TextEncoder().encode(chunk));

          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const parsed = JSON.parse(line.slice(6));
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) fullContent += delta;
              } catch {
                // skip malformed SSE chunks
              }
            }
          }
        }

        // Save assistant message (best-effort, don't fail the stream)
        if (fullContent) {
          const assistantMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: fullContent,
            timestamp: new Date().toISOString(),
          };
          savedInterview.messages.push(assistantMsg);
          updateInterview(interviewId, { messages: savedInterview.messages }).catch(() => {});
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
