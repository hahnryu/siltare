// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'dashboard_auth';

async function computeToken(): Promise<string> {
  const input = `${process.env.ADMIN_ID ?? ''}:${process.env.ADMIN_PW ?? ''}:${process.env.ADMIN_SECRET ?? ''}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(req: NextRequest) {
  try {
    const { id, pw } = await req.json();

    const ADMIN_ID = process.env.ADMIN_ID;
    const ADMIN_PW = process.env.ADMIN_PW;

    if (!ADMIN_ID || !ADMIN_PW || id !== ADMIN_ID || pw !== ADMIN_PW) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 틀립니다' },
        { status: 401 },
      );
    }

    const token = await computeToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
    });

    return res;
  } catch {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

// Logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
