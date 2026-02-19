import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-mist bg-cream">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Brand */}
          <div>
            <p className="font-serif text-[16px] font-bold text-bark">실타래 Siltare</p>
            <p className="mt-1 text-[13px] font-light text-stone">AI 기반 구술 자서전 서비스</p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-4 text-[13px] text-stone">
            <Link href="/inspiration" className="hover:text-bark transition-colors">
              Inspiration
            </Link>
            <span className="text-mist" aria-hidden>|</span>
            <Link href="/vision" className="hover:text-bark transition-colors">
              Vision &amp; Roadmap
            </Link>
            <span className="text-mist" aria-hidden>|</span>
            <Link href="/request" className="hover:text-bark transition-colors">
              데모
            </Link>
          </nav>

          {/* Credits */}
          <p className="text-[12px] text-stone">
            A NodeONE Product · 뿌리깊은나무 연구소{' '}
            <a
              href="https://rooted.center"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bark transition-colors"
            >
              rooted.center
            </a>
          </p>
          <p className="text-[12px] text-stone/70">© 2026 NodeONE Inc.</p>
          <p className="text-[11px] text-stone/50 leading-relaxed">
            노드원 주식회사 | 대표: 류한석<br />
            사업자등록번호: 195-86-02431<br />
            서울 강남구 테헤란로70길 12, 402-150 A호
          </p>
        </div>
      </div>
    </footer>
  );
}
