import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'dashboard_auth';

// Paths under /dashboard that do NOT require auth
const PUBLIC_DASHBOARD_PATHS = ['/dashboard/login', '/dashboard/log'];

async function expectedToken(): Promise<string> {
  const input = `${process.env.ADMIN_ID ?? ''}:${process.env.ADMIN_PW ?? ''}:${process.env.ADMIN_SECRET ?? ''}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public dashboard paths (exact match or sub-paths)
  const isPublic = PUBLIC_DASHBOARD_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/dashboard/login', req.url));
  }

  const valid = await expectedToken();
  if (token !== valid) {
    const res = NextResponse.redirect(new URL('/dashboard/login', req.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
