'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 bg-cream/90 backdrop-blur transition-colors duration-200 ${
        scrolled ? 'border-b border-mist' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-[18px] font-bold text-bark hover:text-bark-light transition-colors"
        >
          실타래
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/#how"
            className="text-[14px] text-stone hover:text-bark transition-colors"
          >
            작동 방식
          </Link>
          <Link
            href="/inspiration"
            className="text-[14px] text-stone hover:text-bark transition-colors"
          >
            Inspiration
          </Link>
          <Link
            href="/vision"
            className="text-[14px] text-stone hover:text-bark transition-colors"
          >
            Vision
          </Link>
          <Link
            href="/request"
            className="inline-flex items-center rounded-[6px] bg-bark px-5 py-2 text-[14px] font-medium text-warm-white transition-colors hover:bg-bark-light"
          >
            시작하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
