// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getInterview, updateInterview, getMessages } from '@/lib/store';
import { generateDraftPrompt, diagnosisPrompt, entityExtractionPrompt } from '@/lib/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { interviewId, chapterNum } = await req.json();

    if (!interviewId || !chapterNum) {
      return NextResponse.json(
        { error: 'interviewId와 chapterNum이 필요합니다' },
        { status: 400 }
      );
    }

    const interview = await getInterview(interviewId);
    if (!interview) {
      return NextResponse.json({ error: '인터뷰를 찾을 수 없습니다' }, { status: 404 });
    }

    // Load messages from messages table
    const messages = await getMessages(interviewId);

    // 전사본 생성
    const transcript = messages
      .map((m) => `[${m.role === 'assistant' ? '실타래' : interview.interviewee.name}] ${m.content}`)
      .join('\n\n');

    // 1. 초고 생성 (Claude Sonnet, non-streaming)
    const draftPrompt = generateDraftPrompt(transcript, chapterNum, interview.interviewee.name);
    const draftMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [{ role: 'user', content: draftPrompt }],
    });
    const draft = draftMessage.content[0].type === 'text' ? draftMessage.content[0].text : '';

    // 2. 진단 생성 (1챕터만)
    let diagnosis = null;
    let suggestedChapters = null;
    if (chapterNum === 1) {
      const diagnosisMessage = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: `${diagnosisPrompt}\n\n전사본:\n${transcript}` },
        ],
      });
      const diagnosisText =
        diagnosisMessage.content[0].type === 'text' ? diagnosisMessage.content[0].text : '';

      try {
        diagnosis = JSON.parse(diagnosisText);
        suggestedChapters = diagnosis.suggestedChapters;
      } catch (err) {
        console.error('Failed to parse diagnosis JSON:', err);
        diagnosis = null;
      }
    }

    // 3. Entities 추출 (Claude Sonnet)
    const entityMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1500,
      messages: [
        { role: 'user', content: `${entityExtractionPrompt}\n\n전사본:\n${transcript}` },
      ],
    });
    const entityText = entityMessage.content[0].type === 'text' ? entityMessage.content[0].text : '';

    let entities;
    try {
      entities = JSON.parse(entityText);
    } catch {
      entities = { persons: [], places: [], times: [], events: [] };
    }

    // 4. DB 업데이트
    const updates: {
      autobiographyDraft?: Record<number, string>;
      diagnosis?: unknown;
      chapterMap?: unknown;
      chapterContext?: unknown;
      entities?: unknown;
    } = {};

    // autobiography_draft: 기존 객체에 chapterNum 키로 추가
    const existingDrafts =
      typeof interview.autobiographyDraft === 'object' && interview.autobiographyDraft !== null
        ? (interview.autobiographyDraft as Record<number, string>)
        : {};
    updates.autobiographyDraft = {
      ...existingDrafts,
      [chapterNum]: draft,
    };

    // diagnosis (1챕터만)
    if (chapterNum === 1 && diagnosis) {
      updates.diagnosis = diagnosis;
    }

    // chapter_map (1챕터 완주 후 suggestedChapters로 업데이트)
    if (chapterNum === 1 && suggestedChapters) {
      updates.chapterMap = suggestedChapters;
    }

    // entities
    updates.entities = entities;

    // chapter_context: chapterNum++, sessionNum 초기화
    if (interview.chapterContext) {
      updates.chapterContext = {
        ...interview.chapterContext,
        chapterNum: chapterNum + 1,
        sessionNum: 1,
        currentLayer: 'space' as const,
        completedLayers: [],
        targetLayers: ['space' as const, 'people' as const],
        chapterComplete: false,
      };
    }

    await updateInterview(interviewId, updates);

    // 5. 응답
    return NextResponse.json({
      draft,
      diagnosis: chapterNum === 1 ? diagnosis : undefined,
      suggestedChapters: chapterNum === 1 ? suggestedChapters : undefined,
      entities,
    });
  } catch (err) {
    console.error('[ERROR] /api/chapter-complete:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
