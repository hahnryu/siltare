// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';
import { getInterview, updateInterview } from '@/lib/store';

export async function PATCH(req: NextRequest) {
  try {
    const { interviewId, chapterNum, draft } = await req.json();

    if (!interviewId || !chapterNum || draft === undefined) {
      return NextResponse.json(
        { error: 'interviewId, chapterNum, draft가 필요합니다' },
        { status: 400 }
      );
    }

    const interview = await getInterview(interviewId);
    if (!interview) {
      return NextResponse.json({ error: '기록을 찾을 수 없습니다' }, { status: 404 });
    }

    // Get existing drafts
    const existingDrafts =
      typeof interview.autobiographyDraft === 'object' && interview.autobiographyDraft !== null
        ? (interview.autobiographyDraft as Record<number, string>)
        : {};

    // Update specific chapter
    const updatedDrafts = {
      ...existingDrafts,
      [chapterNum]: draft,
    };

    await updateInterview(interviewId, {
      autobiographyDraft: updatedDrafts,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[ERROR] /api/update-draft:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
