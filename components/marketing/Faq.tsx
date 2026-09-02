'use client'

import { useState } from 'react'

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-sand/50"
              aria-expanded={isOpen}
            >
              <span className="font-display text-[0.95rem] font-semibold text-ink">{item.q}</span>
              <span
                className={
                  'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-soft transition-transform duration-200 ' +
                  (isOpen ? 'rotate-45 border-brand-300 bg-brand-50 text-brand-700' : '')
                }
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              className={
                'grid transition-all duration-200 ease-out ' +
                (isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')
              }
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
