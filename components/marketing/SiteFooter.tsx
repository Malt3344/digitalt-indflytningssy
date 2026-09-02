import Link from 'next/link'
import Logo from './Logo'

const columns = [
  {
    title: 'Produkt',
    links: [
      { href: '/#hvordan', label: 'Sådan virker det' },
      { href: '/#fordele', label: 'Fordele' },
      { href: '/priser', label: 'Priser' },
    ],
  },
  {
    title: 'Konto',
    links: [
      { href: '/auth/login', label: 'Log ind' },
      { href: '/auth/signup', label: 'Opret konto' },
    ],
  },
  {
    title: 'Juridisk',
    links: [
      { href: '/privatlivspolitik', label: 'Privatlivspolitik' },
      { href: '/vilkaar', label: 'Handelsbetingelser' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo href="/" variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Digitale indflytningssyn med fotodokumentation, digital underskrift og juridisk
              gyldig PDF-rapport.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-white/50">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-7 text-sm text-white/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Synsguiden. Alle rettigheder forbeholdes.</p>
          <a href="mailto:support@synsguiden.com" className="transition-colors hover:text-white">
            support@synsguiden.com
          </a>
        </div>
      </div>
    </footer>
  )
}
