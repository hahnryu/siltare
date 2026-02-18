// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { saveInterview, getInterview } from '@/lib/store';
import { Interview } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = nanoid(10);

    const interview: Interview = {
      id,
      mode: body.mode,
      status: 'pending',
      createdAt: new Date().toISOString(),
      requester: body.requester,
      interviewee: body.interviewee,
      context: body.context,
      context2: body.context2,
      messages: [],
    };

    await saveInterview(interview);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://siltare.app';
    return NextResponse.json({
      id,
      link: `${baseUrl}/i/${id}`,
    });
  } catch {
    return NextResponse.json({ error: '생성 실패' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 });
  }

  const interview = await getInterview(id);
  if (!interview) {
    return NextResponse.json({ error: '찾을 수 없습니다' }, { status: 404 });
  }

  return NextResponse.json(interview);
}
