import Link from 'next/link'
import Logo from './Logo'

const points = [
  'Første indflytningssyn er gratis',
  'Juridisk gyldig PDF med digital underskrift',
  'Ingen binding — betal kun per rapport',
]

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] max-w-xl overflow-hidden bg-brand-800 lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-[0.12]" />
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-mint-400/20 blur-3xl" />

        <div className="relative">
          <Logo href="/" variant="light" />
        </div>

        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tighter2 text-white">
            Indflytningssyn,<br />gjort ordentligt.
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-white/80">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-[0.95rem]">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-sm text-white/50">
          © {new Date().getFullYear()} Synsguiden
        </div>
      </aside>

      {/* Form area */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[26rem]">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo href="/" />
          </div>
          {children}
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-ink-muted transition-colors hover:text-ink">
              ← Tilbage til forsiden
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
