// TODO: add auth check here
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getInterview, updateInterview, getMessages, createMessage } from '@/lib/store';
import { generateSystemPrompt, generateChapterContextBlock } from '@/lib/prompts';
import { Message, MessageMeta } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { interviewId, message, audioChunkId } = await req.json();

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[CHAT API] ANTHROPIC_API_KEY is not set');
      return new Response('AI 서비스 설정 오류', { status: 500 });
    }

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

    // Build system prompt with ChapterContext (if available)
    let systemPrompt = generateSystemPrompt(interview);
    if (interview.chapterContext) {
      const chapterBlock = generateChapterContextBlock(interview.chapterContext);
      systemPrompt = chapterBlock + '\n\n' + systemPrompt;
    }

    // Build Anthropic messages (system is separate, not in messages array)
    const anthropicMessages: { role: 'assistant' | 'user'; content: string }[] = [
      ...existingMessages.map((m) => ({
        role: m.role as 'assistant' | 'user',
        content: m.content,
      })),
    ];

    // Add resume context if returning from session_end (no user message + existing messages)
    if (!message && existingMessages.length > 0 && interview.status === 'active') {
      const lastAssistantMsg = [...existingMessages].reverse().find((m) => m.role === 'assistant');
      const lastUserMsg = [...existingMessages].reverse().find((m) => m.role === 'user');

      const resumeContext = lastAssistantMsg?.content
        ? `중요: 사용자가 이전 대화를 이어가기 위해 돌아왔습니다.

반드시 다음 형식으로 응답하세요:
1. 짧은 인사 (예: "돌아오셨군요", "다시 뵙게 되어 반갑습니다", "다시 이야기 나눠볼까요?")
2. 지난 대화 언급 (예: "지난번에 [주제] 이야기 하셨는데...")
3. 자연스럽게 다음 질문

지난 대화 마지막:
- 제가 물었던 것: "${lastAssistantMsg.content}"
${lastUserMsg ? `- 답변하신 것: "${lastUserMsg.content}"` : ''}

이제 자연스럽게 인사하며 다음 질문을 해주세요.`
        : `사용자가 이전 대화를 이어가기 위해 돌아왔습니다. "돌아오셨군요" 같은 짧은 인사 후 자연스럽게 다음 질문으로 이어주세요.`;

      systemPrompt = systemPrompt + '\n\n' + resumeContext;
    }

    // Add user message if provided
    if (message) {
      const userSequence = existingMessages.length + 1;
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
        audioChunkId: audioChunkId || undefined,
      };
      await createMessage(interviewId, userMsg, userSequence);
      anthropicMessages.push({ role: 'user' as const, content: message });
    }

    // ============================================================
    // PREVIOUS: OpenAI GPT-4o streaming (commented out 2026-03-04)
    // ============================================================
    // const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4o',
    //     messages: openaiMessages,
    //     stream: true,
    //     temperature: 0.7,
    //     max_tokens: 300,
    //   }),
    // });

    // ============================================================
    // CURRENT: Anthropic Claude Sonnet 4.5 streaming
    // ============================================================
    let fullContent = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('[CHAT API] Starting Anthropic stream for interview:', interviewId);
          const messageStream = await anthropic.messages.stream({
            model: 'claude-sonnet-4-5',
            max_tokens: 300,
            system: systemPrompt,
            messages: anthropicMessages,
          });

          for await (const event of messageStream) {
            // Anthropic event types: message_start, content_block_start, content_block_delta, content_block_stop, message_stop
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const textDelta = event.delta.text;
              fullContent += textDelta;

              // Convert to OpenAI format for client compatibility
              const openaiChunk = `data: ${JSON.stringify({
                choices: [{ delta: { content: textDelta } }],
              })}\n\n`;

              controller.enqueue(new TextEncoder().encode(openaiChunk));
            }
          }

          // Send [DONE] marker (OpenAI format)
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));

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
              meta,
            };

            await createMessage(interviewId, assistantMsg, assistantSequence).catch((err) => {
              console.error('Failed to save assistant message:', err);
            });
          }
        } catch (err) {
          console.error('[CHAT API] Anthropic stream error:', {
            error: err,
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
            interviewId,
          });
          controller.error(err);
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
    console.error('[CHAT API] Unhandled error:', {
      error: err,
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
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
