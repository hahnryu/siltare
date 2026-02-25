// TODO: add auth check here
import { NextRequest } from 'next/server';
import { getInterview, updateInterview, getMessages, createMessage } from '@/lib/store';
import { generateSystemPrompt } from '@/lib/prompts';
import { Message, MessageMeta } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { interviewId, message } = await req.json();

    const interview = await getInterview(interviewId);
    if (!interview) {
      return new Response('인터뷰를 찾을 수 없습니다', { status: 404 });
    }

    // Mark as active (best-effort, don't block on failure)
    if (interview.status === 'pending' || interview.status === 'session_end') {
      updateInterview(interviewId, { status: 'active' }).catch(() => {});
    }

    // Load existing messages from messages table
    const existingMessages = await getMessages(interviewId);

    // Build system prompt and OpenAI messages
    const systemPrompt = generateSystemPrompt(interview);
    const openaiMessages: { role: 'system' | 'assistant' | 'user'; content: string }[] = [
      { role: 'system' as const, content: systemPrompt },
      ...existingMessages.map((m) => ({
        role: m.role as 'assistant' | 'user',
        content: m.content,
      })),
    ];

    // Add user message if provided
    if (message) {
      const userSequence = existingMessages.length + 1;
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      await createMessage(interviewId, userMsg, userSequence);
      openaiMessages.push({ role: 'user' as const, content: message });
    }

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
          const { cleanContent, meta } = parseMetaTag(fullContent);

          // Get updated message count for sequence
          const updatedMessages = await getMessages(interviewId);
          const assistantSequence = updatedMessages.length + 1;

          const assistantMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: cleanContent,
            timestamp: new Date().toISOString(),
            meta, // meta is optional, may be undefined
          };

          await createMessage(interviewId, assistantMsg, assistantSequence).catch((err) => {
            console.error('Failed to save assistant message:', err);
          });
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
  } catch (err) {
    console.error('Chat API error:', err);
    return new Response('서버 오류', { status: 500 });
  }
}

function parseMetaTag(content: string): { cleanContent: string; meta?: MessageMeta } {
  const metaMatch = content.match(/<meta\s+([^>]+)\/>\s*$/);
  if (!metaMatch) {
    return { cleanContent: content };
  }

  const attrs = metaMatch[1];
  const meta: MessageMeta = {};

  const phaseMatch = attrs.match(/phase="([^"]+)"/);
  if (phaseMatch) meta.phase = phaseMatch[1] as MessageMeta['phase'];

  const topicMatch = attrs.match(/topic="([^"]+)"/);
  if (topicMatch) meta.topic = topicMatch[1];

  const subtopicMatch = attrs.match(/subtopic="([^"]+)"/);
  if (subtopicMatch) meta.subtopic = subtopicMatch[1];

  const qtypeMatch = attrs.match(/qtype="([^"]+)"/);
  if (qtypeMatch) meta.questionType = qtypeMatch[1] as MessageMeta['questionType'];

  const intensityMatch = attrs.match(/intensity="([^"]+)"/);
  if (intensityMatch) meta.intensity = intensityMatch[1] as MessageMeta['intensity'];

  const cleanContent = content.replace(/<meta\s+[^>]+\/>\s*$/, '').trim();
  return { cleanContent, meta };
}
