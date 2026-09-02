import Link from 'next/link'

export default function Logo({
  href = '/',
  variant = 'dark',
  className = '',
}: {
  href?: string | null
  variant?: 'dark' | 'light'
  className?: string
}) {
  const wordmark = variant === 'light' ? 'text-white' : 'text-ink'

  const mark = (
    <span
      className={
        'relative flex h-9 w-9 items-center justify-center rounded-[0.7rem] ' +
        (variant === 'light'
          ? 'bg-white/10 ring-1 ring-inset ring-white/20'
          : 'bg-gradient-to-br from-brand-500 to-brand-800 shadow-[0_6px_16px_-4px_rgba(24,107,82,0.55)]')
      }
    >
      <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem] text-white" fill="none">
        <path
          d="M4 11.2 12 4.5l8 6.7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 10.8V18a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 18v-7.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
        <path
          d="m9.4 13.7 1.9 1.9 3.8-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      <span className={`font-display text-[1.2rem] font-bold tracking-tighter2 ${wordmark}`}>
        Synsguiden
      </span>
    </span>
  )

  if (!href) return content
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
    >
      {content}
    </Link>
  )
}
