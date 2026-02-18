import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center border-b border-mist bg-cream/90 backdrop-blur px-4">
      <Link
        href="/"
        className="font-serif text-[16px] font-semibold text-bark hover:text-bark-light transition-colors"
      >
        🧵 실타래
      </Link>
    </header>
  );
}
