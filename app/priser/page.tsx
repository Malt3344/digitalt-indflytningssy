'use client'

import Link from 'next/link'

export default function PriserPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl">Synsguiden</span>
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-black font-medium">
              Log ind
            </Link>
          </nav>
        </div>
      </header>

      <main className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enkel og fair prissætning
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Ingen månedlige gebyrer. Betal kun når du har brug for en rapport.
            </p>
          </div>

          {/* Main pricing card */}
          <div className="max-w-md mx-auto mb-16">
            <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Første syn gratis
              </div>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">149 kr</span>
                <span className="text-gray-500 ml-2">per synsrapport</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Ubegrænset antal rum og fotos</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Digital underskrift inkluderet</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Professionel PDF-rapport</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Arkiveret sikkert i skyen</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Ingen binding eller abonnement</span>
                </li>
              </ul>

              <Link
                href="/auth/signup"
                className="block w-full bg-black text-white text-center py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors"
              >
                Start gratis nu
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Ofte stillede spørgsmål
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Hvordan virker &quot;første syn gratis&quot;?
                </h3>
                <p className="text-gray-600 text-sm">
                  Dit allerførste indflytningssyn er helt gratis - inklusiv PDF-rapporten. Derefter koster hver rapport kun 149 kr.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Hvornår betaler jeg?
                </h3>
                <p className="text-gray-600 text-sm">
                  Du betaler først når du vil downloade PDF-rapporten. Du kan oprette og udfylde syn helt gratis.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Er der skjulte gebyrer?
                </h3>
                <p className="text-gray-600 text-sm">
                  Nej. 149 kr per rapport - det er alt. Ingen abonnementer, ingen bindingsperioder, ingen overraskelser.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Hvilke betalingsmetoder accepterer I?
                </h3>
                <p className="text-gray-600 text-sm">
                  Vi accepterer alle større betalingskort via Stripe - Visa, Mastercard, og American Express.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Synsguiden</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privatlivspolitik" className="hover:text-gray-900 transition-colors">Privatlivspolitik</Link>
              <Link href="/vilkaar" className="hover:text-gray-900 transition-colors">Handelsbetingelser</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
