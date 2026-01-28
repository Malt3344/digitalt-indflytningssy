'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Small delay to avoid layout shift on initial load
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-white border-t border-gray-200 shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-xl md:border">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">🍪 Vi bruger cookies</h3>
          <p className="text-sm text-gray-600">
            Vi bruger cookies til at huske din login og forbedre din oplevelse. 
            Læs mere i vores <a href="/privatlivspolitik" className="underline hover:text-black">privatlivspolitik</a>.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={acceptCookies}
            className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            Acceptér
          </button>
          <button
            onClick={declineCookies}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Kun nødvendige
          </button>
        </div>
      </div>
    </div>
  )
}
