import Link from 'next/link'
import Logo from './Logo'

const navLinks = [
  { href: '/#hvordan', label: 'Sådan virker det' },
  { href: '/#fordele', label: 'Fordele' },
  { href: '/priser', label: 'Priser' },
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/auth/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-sand hover:text-ink sm:inline-flex"
          >
            Log ind
          </Link>
          <Link href="/auth/signup" className="btn-primary btn-md">
            Kom i gang
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h11m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
