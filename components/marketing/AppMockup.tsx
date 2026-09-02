/* Polished, static product mockups — no real data, purely illustrative. */

export function PhoneMockup({ className = '' }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-[280px] ${className}`}>
      {/* device */}
      <div className="relative rounded-[2.75rem] border border-black/10 bg-[#0c1512] p-3 shadow-[0_40px_80px_-24px_rgba(21,32,28,0.45)]">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-white">
          {/* status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[10px] font-semibold text-ink">
            <span>09:41</span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-ink/70" />
              <span className="inline-block h-2 w-3 rounded-sm bg-ink/40" />
              <span className="inline-block h-2.5 w-5 rounded-[3px] border border-ink/40" />
            </span>
          </div>
          <div className="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-[#0c1512]" />

          {/* app header */}
          <div className="flex items-center justify-between border-b border-line px-5 pt-3 pb-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-ink-muted">Rum 3 af 6</p>
              <p className="mt-0.5 text-[15px] font-bold text-ink">Køkken</p>
            </div>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
              Brugsspor
            </span>
          </div>

          {/* progress */}
          <div className="px-5 pt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand-deep">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
            </div>
          </div>

          {/* photo grid */}
          <div className="px-5 pt-4">
            <p className="mb-2 text-[10px] font-semibold text-ink-soft">Fotos (3)</p>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-[#cfe3d9] to-[#a9c9bb]" />
              <div className="aspect-square rounded-lg bg-gradient-to-br from-[#e4dcc9] to-[#cdbfa1]" />
              <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-line-strong text-ink-muted">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* condition segmented */}
          <div className="px-5 pt-4">
            <p className="mb-2 text-[10px] font-semibold text-ink-soft">Tilstand</p>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-sand p-1">
              <span className="rounded-lg py-1.5 text-center text-[10px] font-medium text-ink-muted">Perfekt</span>
              <span className="rounded-lg bg-white py-1.5 text-center text-[10px] font-semibold text-ink shadow-sm">Brugsspor</span>
              <span className="rounded-lg py-1.5 text-center text-[10px] font-medium text-ink-muted">Mangel</span>
            </div>
          </div>

          {/* note */}
          <div className="px-5 pt-4">
            <div className="rounded-xl border border-line bg-sand/60 p-3">
              <p className="text-[10px] leading-relaxed text-ink-soft">
                Ridser på bordplade ved vask. Øvrige overflader uden anmærkninger.
              </p>
            </div>
          </div>

          {/* cta */}
          <div className="px-5 pb-6 pt-4">
            <div className="rounded-full bg-brand-600 py-2.5 text-center text-[11px] font-semibold text-white">
              Næste rum →
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReportMockup({ className = '' }: { className?: string }) {
  const rows = [
    { room: 'Entré', status: 'Perfekt', tone: 'ok' },
    { room: 'Stue', status: 'Perfekt', tone: 'ok' },
    { room: 'Køkken', status: 'Brugsspor', tone: 'neutral' },
    { room: 'Badeværelse', status: 'Perfekt', tone: 'ok' },
    { room: 'Soveværelse', status: 'Mangel', tone: 'warn' },
  ]
  return (
    <div className={`w-[340px] max-w-full ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-elevated">
        <div className="flex items-center justify-between border-b border-line bg-sand/50 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Synsrapport · PDF</p>
            <p className="mt-1 font-display text-[15px] font-bold text-ink">Indflytningssyn</p>
          </div>
          <span className="badge-success text-xs">Underskrevet</span>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-end justify-between gap-3 text-xs">
            <div className="min-w-0">
              <p className="text-ink-muted">Adresse</p>
              <p className="truncate font-medium text-ink">Nørrebrogade 42, 2. th</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-ink-muted">Dato</p>
              <p className="font-medium text-ink">1. sep. 2026</p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-line rounded-xl border border-line">
            {rows.map((r) => (
              <div key={r.room} className="flex items-center justify-between px-3.5 py-2.5">
                <span className="text-xs text-ink-soft">{r.room}</span>
                <span
                  className={
                    'rounded-full px-2.5 py-0.5 text-[10px] font-semibold ' +
                    (r.tone === 'ok'
                      ? 'bg-success-50 text-success-700'
                      : r.tone === 'warn'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-sand-deep text-ink-soft')
                  }
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {['Udlejer', 'Lejer'].map((role) => (
              <div key={role} className="rounded-xl border border-line bg-sand/40 p-3">
                <p className="text-[10px] uppercase tracking-wide text-ink-muted">{role}</p>
                <svg viewBox="0 0 120 28" className="mt-1 h-6 w-full text-brand-700">
                  <path
                    d="M2 20c8-14 14 6 22-2s10-12 18-4 12 10 20 2 14-10 22-6 12 8 14 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
