'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import SiteHeader from '@/components/marketing/SiteHeader'
import SiteFooter from '@/components/marketing/SiteFooter'
import { PhoneMockup, ReportMockup } from '@/components/marketing/AppMockup'

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  )
}

const problems = [
  {
    title: 'Tidskrævende',
    body: 'Håndskrevne noter, scanning af dokumenter, og manuel organisering tager timer.',
    path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Rodet dokumentation',
    body: 'Papirer bliver væk, fotos gemmes tilfældige steder, og det er svært at finde senere.',
    path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    title: 'Tvister ved fraflytning',
    body: 'Manglende dokumentation fører til uenigheder om depositum og skader.',
    path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
]

const steps = [
  { title: 'Udfyld grundoplysninger', body: 'Lejerens navn, adresse og indflytningsdato. Tager 30 sekunder.' },
  { title: 'Gennemgå hvert rum', body: 'Tag fotos og beskriv tilstanden for hvert rum. Vælg mellem "Perfekt", "Brugsspor" eller "Mangel".' },
  { title: 'Tilføj målerstande og nøgler', body: 'Dokumenter el, vand og varme-aflæsninger samt antal nøgler.' },
  { title: 'Digital underskrift', body: 'Både udlejer og lejer underskriver direkte på skærmen.' },
]

const benefits = [
  {
    title: 'Billigere end alternativer',
    body: 'Kun 149 kr per rapport. Ingen abonnementer eller skjulte gebyrer.',
    path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Virker på alle enheder',
    body: 'Brug din mobil, tablet eller computer. Ingen app-download.',
    path: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
  {
    title: 'Juridisk dokumentation',
    body: 'Digitale underskrifter og timestamp. Beskyt dig ved tvister.',
    path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Færdig på 5-10 minutter',
    body: 'Intuitivt flow der guider dig igennem. Ingen læringskurve.',
    path: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
]

const pricingFeatures: React.ReactNode[] = [
  <>Første syn er <strong className="font-semibold text-ink">helt gratis</strong></>,
  'Ubegrænset antal rum og fotos',
  'Digital underskrift inkluderet',
  'Professionel PDF-rapport',
  'Arkiveret sikkert i skyen',
]

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [inspections, setInspections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('inspections')
        .select('*')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false })

      setInspections(data || [])
    }

    setUser(user)
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-line border-t-brand-600"></div>
    </div>
  }

  // If user is logged in, show simple dashboard
  if (user) {
    const hasInspections = inspections.length > 0
    const firstFree = !hasInspections

    return (
      <div className="min-h-screen bg-white">
        <Navigation />

        <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
          <div className="text-center mb-6 mt-4">
            <h1 className="text-2xl font-bold text-ink mb-2">Indflytningssyn</h1>
            {firstFree ? (
              <span className="badge-success">Første syn er gratis</span>
            ) : (
              <p className="text-ink-muted text-sm">149 kr per synsrapport</p>
            )}
          </div>

          <button
            onClick={() => router.push('/inspection/new')}
            className="btn-primary btn-xl w-full mb-8"
          >
            + Nyt indflytningssyn
          </button>

          {hasInspections ? (
            <div className="space-y-3">
              <h2 className="section-title px-1 mb-3">Dine syn</h2>
              {inspections.map((inspection) => (
                <button
                  key={inspection.id}
                  onClick={() => router.push(`/inspection/${inspection.id}`)}
                  className="block w-full text-left card p-4 transition-colors hover:border-brand-200 hover:bg-sand/60"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink truncate">
                        {inspection.address || 'Ingen adresse'}
                      </p>
                      <p className="text-sm text-ink-muted mt-0.5">
                        {new Date(inspection.created_at).toLocaleDateString('da-DK', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                    {inspection.is_paid && (
                      <span className="ml-3 flex-shrink-0 w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center">
                        <CheckIcon className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-sand-deep rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-ink-muted text-sm leading-relaxed">
                Du har ingen syn endnu.<br/>
                Kom i gang nu - første syn er gratis!
              </p>
            </div>
          )}
        </main>
      </div>
    )
  }

  // ---------- Landing page ----------
  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-sand">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-60 mask-fade-b" />
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-mint-200/50 blur-3xl" />

        <div className="container-page relative flex flex-col items-start gap-14 py-20 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div className="w-full min-w-0">
            <span className="pill-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Første indflytningssyn er gratis
            </span>

            <h1 className="mt-6 font-display text-[1.95rem] font-extrabold leading-[1.08] tracking-tighter2 text-ink [hyphens:auto] sm:text-[2.7rem] sm:leading-[1.05] lg:text-[3.4rem]">
              Professionelt indflytningssyn
              <span className="mt-1 block bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                direkte fra mobilen
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Slip for papir, ringbind og scanninger. Lav juridisk gyldige synsrapporter på 5
              minutter med fotos og digital underskrift.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="/auth/signup" className="btn-primary btn-xl">
                Start gratis nu
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10h11m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#hvordan" className="btn-secondary btn-xl">
                Se hvordan det virker
              </a>
            </div>

            <p className="mt-5 text-sm text-ink-muted">Ingen binding • Kun 149 kr per rapport</p>
          </div>

          {/* Mockups */}
          <div className="relative mx-auto w-full max-w-[460px] lg:h-[520px]">
            <div className="absolute -right-6 bottom-0 z-10 hidden rotate-3 sm:block lg:-right-14">
              <ReportMockup className="w-[300px] scale-95 shadow-elevated" />
            </div>
            <div className="relative z-0 -rotate-2 sm:-ml-6 lg:ml-0">
              <PhoneMockup />
            </div>
          </div>
        </div>

        {/* Value strip */}
        <div className="relative border-t border-line/70 bg-white/70 backdrop-blur">
          <div className="container-page grid grid-cols-2 divide-x divide-line/70 md:grid-cols-4">
            {[
              { k: '5 min', v: 'Typisk tid per syn' },
              { k: '0 kr', v: 'Første synsrapport' },
              { k: '149 kr', v: 'Per rapport derefter' },
              { k: 'PDF', v: 'Klar til print & arkiv' },
            ].map((s) => (
              <div key={s.v} className="px-2 py-6 text-center sm:px-4">
                <p className="font-display text-2xl font-bold text-ink">{s.k}</p>
                <p className="mt-1 text-xs text-ink-muted sm:text-sm">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Udfordringen</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Træthed af bøvlet med indflytningssyn?
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Traditionelle metoder er langsomme, uorganiserede og skaber tvister mellem udlejer og lejer.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {problems.map((item) => (
              <div key={item.title} className="card-elevated card-hover p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-100">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="hvordan" className="section scroll-mt-24 border-y border-line bg-sand">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Kom hurtigt i gang</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Sådan virker det</h2>
            <p className="mt-4 text-lg text-ink-soft">
              Fra start til færdig rapport på under 10 minutter
            </p>
          </div>

          <div className="mt-16 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <PhoneMockup />
            </div>

            <ol className="relative space-y-3 before:absolute before:left-[1.35rem] before:top-4 before:bottom-16 before:w-px before:bg-line-strong">
              {steps.map((step, i) => (
                <li key={step.title} className="relative flex gap-5 rounded-2xl border border-line bg-white p-6 shadow-card">
                  <span className="z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-base font-bold text-white shadow-[0_8px_18px_-6px_rgba(24,107,82,0.5)]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[1.05rem] font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">{step.body}</p>
                  </div>
                </li>
              ))}
              <li className="relative flex gap-5 rounded-2xl border border-brand-200 bg-brand-50/70 p-6">
                <span className="z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-[0_8px_18px_-6px_rgba(24,107,82,0.5)]">
                  <CheckIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[1.05rem] font-semibold">Download PDF-rapport</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">
                    Få en professionel synsrapport klar til print eller arkivering. Første er gratis!
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="fordele" className="section scroll-mt-24">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="eyebrow">Fordele</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Hvorfor vælge Synsguiden?</h2>

              <div className="mt-10 space-y-8">
                {benefits.map((item) => (
                  <div key={item.title} className="flex gap-5">
                    <div className="icon-tile-soft flex-shrink-0">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[1.05rem] font-semibold">{item.title}</h3>
                      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-100/60 to-mint-200/40 blur-2xl" />
              <div className="rounded-[2rem] border border-line bg-sand p-8">
                <ReportMockup className="mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section border-y border-line bg-sand">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Priser</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Enkel prissætning</h2>
            <p className="mt-4 text-lg text-ink-soft">
              Ingen abonnementer. Betal kun når du har brug for det.
            </p>
          </div>

          <div className="relative mx-auto mt-12 max-w-md">
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-300/40 to-mint-300/30 blur-2xl" />
            <div className="rounded-[1.75rem] border border-brand-200 bg-white p-8 shadow-elevated">
              <div className="flex items-center justify-between">
                <span className="pill-brand">Mest populær</span>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-5xl font-extrabold tracking-tighter2 text-ink">149 kr</span>
                <span className="text-ink-muted">per synsrapport</span>
              </div>
              <ul className="mt-7 space-y-3.5 text-left">
                {pricingFeatures.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-ink-soft">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success-100 text-success-700">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="/auth/signup" className="btn-primary btn-xl mt-8 w-full">
                Prøv gratis nu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-brand-800 py-24">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-[0.15]" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-mint-400/20 blur-3xl" />
        <div className="container-page relative max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Klar til at spare tid på indflytningssyn?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Opret din gratis konto og lav dit første syn på under 10 minutter.
          </p>
          <a href="/auth/signup" className="btn-inverse btn-xl mt-9">
            Kom i gang gratis
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h11m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
