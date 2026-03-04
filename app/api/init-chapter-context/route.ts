// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';
import { getInterview, updateInterview } from '@/lib/store';
import type { ChapterContext } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { interviewId } = await req.json();

    if (!interviewId) {
      return NextResponse.json(
        { error: 'interviewId가 필요합니다' },
        { status: 400 }
      );
    }

    const interview = await getInterview(interviewId);
    if (!interview) {
      return NextResponse.json({ error: '인터뷰를 찾을 수 없습니다' }, { status: 404 });
    }

    // chapter_context가 이미 있으면 에러
    if (interview.chapterContext) {
      return NextResponse.json(
        { error: 'chapter_context가 이미 존재합니다' },
        { status: 400 }
      );
    }

    // 기본값 주입
    const defaultContext: ChapterContext = {
      chapterNum: 1,
      sessionNum: 1,
      currentLayer: 'space',
      completedLayers: [],
      targetLayers: ['space', 'people'],
      chapterComplete: false,
    };

    await updateInterview(interviewId, {
      chapterContext: defaultContext,
    });

    return NextResponse.json({
      ok: true,
      chapterContext: defaultContext,
    });
  } catch (err) {
    console.error('[ERROR] /api/init-chapter-context:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
