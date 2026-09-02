'use client'

import Link from 'next/link'
import SiteHeader from '@/components/marketing/SiteHeader'
import SiteFooter from '@/components/marketing/SiteFooter'
import Faq from '@/components/marketing/Faq'
import { ReportMockup } from '@/components/marketing/AppMockup'

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  )
}

const features = [
  'Ubegrænset antal rum og fotos',
  'Digital underskrift inkluderet',
  'Professionel PDF-rapport',
  'Arkiveret sikkert i skyen',
  'Ingen binding eller abonnement',
]

const faqs = [
  {
    q: 'Hvordan virker "første syn gratis"?',
    a: 'Dit allerførste indflytningssyn er helt gratis - inklusiv PDF-rapporten. Derefter koster hver rapport kun 149 kr.',
  },
  {
    q: 'Hvornår betaler jeg?',
    a: 'Du betaler først når du vil downloade PDF-rapporten. Du kan oprette og udfylde syn helt gratis.',
  },
  {
    q: 'Er der skjulte gebyrer?',
    a: 'Nej. 149 kr per rapport - det er alt. Ingen abonnementer, ingen bindingsperioder, ingen overraskelser.',
  },
  {
    q: 'Hvilke betalingsmetoder accepterer I?',
    a: 'Vi accepterer alle større betalingskort via Stripe - Visa, Mastercard, og American Express.',
  },
]

export default function PriserPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-line bg-sand">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-60 mask-fade-b" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />

        <div className="container-page relative grid items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="eyebrow">Priser</p>
            <h1 className="mt-3 font-display text-[2.4rem] font-extrabold leading-[1.08] tracking-tighter2 text-ink sm:text-[3rem]">
              Enkel og fair prissætning
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-soft">
              Ingen månedlige gebyrer. Betal kun når du har brug for en rapport.
            </p>

            <div className="relative mt-10 max-w-md">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-300/40 to-mint-300/30 blur-2xl" />
              <div className="rounded-[1.75rem] border border-brand-200 bg-white p-8 shadow-elevated">
                <span className="badge-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success-600" />
                  Første syn gratis
                </span>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-extrabold tracking-tighter2 text-ink">149 kr</span>
                  <span className="text-ink-muted">per synsrapport</span>
                </div>

                <ul className="mt-7 space-y-3.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-ink-soft">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success-100 text-success-700">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth/signup" className="btn-primary btn-xl mt-8 w-full">
                  Start gratis nu
                </Link>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-100/60 to-mint-200/40 blur-2xl" />
            <ReportMockup className="mx-auto rotate-2" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Ofte stillede spørgsmål</h2>
            </div>
            <div className="mt-10">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
