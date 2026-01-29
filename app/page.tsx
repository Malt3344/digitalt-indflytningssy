'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

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
      // Fetch inspections
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
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-black"></div>
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
          {/* Simple Header */}
          <div className="text-center mb-6 mt-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Indflytningssyn
            </h1>
            {firstFree ? (
              <span className="inline-block bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                🎉 Første syn er gratis
              </span>
            ) : (
              <p className="text-gray-600 text-sm">149 kr per synsrapport</p>
            )}
          </div>

          {/* Main CTA */}
          <button
            onClick={() => router.push('/inspection/new')}
            className="w-full bg-black text-white text-center py-4 rounded-xl font-semibold text-lg mb-8 active:bg-gray-800"
          >
            + Nyt indflytningssyn
          </button>

          {/* Inspections List */}
          {hasInspections ? (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-3">
                Dine syn
              </h2>
              {inspections.map((inspection) => (
                <button
                  key={inspection.id}
                  onClick={() => router.push(`/inspection/${inspection.id}`)}
                  className="block w-full text-left bg-gray-50 rounded-xl p-4 active:bg-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {inspection.address || 'Ingen adresse'}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(inspection.created_at).toLocaleDateString('da-DK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    {inspection.is_paid && (
                      <span className="ml-3 flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Du har ingen syn endnu.<br/>
                Kom i gang nu - første syn er gratis!
              </p>
            </div>
          )}
        </main>
      </div>
    )
  }

  // Landing page for non-logged in users
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl">SynsApp</span>
            </div>
            <a
              href="/auth/login"
              className="text-gray-600 hover:text-black font-medium"
            >
              Log ind
            </a>
          </nav>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Første indflytningssyn er gratis
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Professionelt indflytningssyn<br/>
              <span className="text-gray-500">direkte fra mobilen</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
              Slip for papir, ringbind og scanninger. Lav juridisk gyldige synsrapporter på 5 minutter med fotos og digital underskrift.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/auth/signup"
                className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
              >
                Start gratis nu
              </a>
              <a
                href="#hvordan"
                className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-300 transition-colors"
              >
                Se hvordan det virker
              </a>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Ingen binding • Kun 149 kr per rapport
            </p>
          </div>
        </div>
      </header>

      {/* Problem Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Træthed af bøvlet med indflytningssyn?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Traditionelle metoder er langsomme, uorganiserede og skaber tvister mellem udlejer og lejer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tidskrævende</h3>
              <p className="text-sm text-gray-600">Håndskrevne noter, scanning af dokumenter, og manuel organisering tager timer.</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rodet dokumentation</h3>
              <p className="text-sm text-gray-600">Papirer bliver væk, fotos gemmes tilfældige steder, og det er svært at finde senere.</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tvister ved fraflytning</h3>
              <p className="text-sm text-gray-600">Manglende dokumentation fører til uenigheder om depositum og skader.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="hvordan" className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Sådan virker det
            </h2>
            <p className="text-gray-600">
              Fra start til færdig rapport på under 10 minutter
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Udfyld grundoplysninger</h3>
                <p className="text-gray-600">Lejerens navn, adresse og indflytningsdato. Tager 30 sekunder.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Gennemgå hvert rum</h3>
                <p className="text-gray-600">Tag fotos og beskriv tilstanden for hvert rum. Vælg mellem "Perfekt", "Brugsspor" eller "Skal udbedres".</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Tilføj målerstande og nøgler</h3>
                <p className="text-gray-600">Dokumenter el, vand og varme-aflæsninger samt antal nøgler.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Digital underskrift</h3>
                <p className="text-gray-600">Både udlejer og lejer underskriver direkte på skærmen.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Download PDF-rapport</h3>
                <p className="text-gray-600">Få en professionel synsrapport klar til print eller arkivering. Første er gratis!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why us section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Hvorfor vælge SynsApp?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 flex gap-4">
              <div className="w-11 h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Billigere end alternativer</h3>
                <p className="text-gray-500 text-sm">Kun 149 kr per rapport. Ingen abonnementer eller skjulte gebyrer.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 flex gap-4">
              <div className="w-11 h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Virker på alle enheder</h3>
                <p className="text-gray-500 text-sm">Brug din mobil, tablet eller computer. Ingen app-download.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 flex gap-4">
              <div className="w-11 h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Juridisk dokumentation</h3>
                <p className="text-gray-500 text-sm">Digitale underskrifter og timestamp. Beskyt dig ved tvister.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 flex gap-4">
              <div className="w-11 h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Færdig på 5-10 minutter</h3>
                <p className="text-gray-500 text-sm">Intuitivt flow der guider dig igennem. Ingen læringskurve.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Enkel prissætning
          </h2>
          <p className="text-gray-600 mb-8">
            Ingen abonnementer. Betal kun når du har brug for det.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-black">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Mest populær
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold">149 kr</span>
              <span className="text-gray-500 ml-2">per synsrapport</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Første syn er <strong>helt gratis</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ubegrænset antal rum og fotos</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Digital underskrift inkluderet</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Professionel PDF-rapport</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Arkiveret sikkert i skyen</span>
              </li>
            </ul>
            <a
              href="/auth/signup"
              className="block w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Prøv gratis nu
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Klar til at spare tid på indflytningssyn?
          </h2>
          <p className="text-gray-400 mb-8">
            Opret din gratis konto og lav dit første syn på under 10 minutter.
          </p>
          <a
            href="/auth/signup"
            className="inline-block bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Kom i gang gratis
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900">SynsApp</span>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="/privatlivspolitik" className="text-gray-500 hover:text-gray-900 transition-colors">Privatlivspolitik</a>
              <a href="/vilkaar" className="text-gray-500 hover:text-gray-900 transition-colors">Handelsbetingelser</a>
              <a href="mailto:support@synsapp.dk" className="text-gray-500 hover:text-gray-900 transition-colors">Kontakt</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} SynsApp. Alle rettigheder forbeholdes.
          </div>
        </div>
      </footer>
    </div>
  )
}
