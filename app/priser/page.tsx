'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { STRIPE_PLANS, SubscriptionTier } from '@/lib/stripe-plans'
import { stripePromise } from '@/lib/stripe-client'

export default function PriserPage() {
  const [loading, setLoading] = useState<SubscriptionTier | null>(null)

  const handleSubscribe = async (tier: SubscriptionTier) => {
    try {
      setLoading(tier)
      
      const plan = STRIPE_PLANS[tier]
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          tier: tier,
        }),
      })

      if (!response.ok) {
        throw new Error('Kunne ikke oprette betalingssession')
      }

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout using the session
      const stripe = await stripePromise
      if (stripe && sessionId) {
        // Use the Stripe.js redirectToCheckout method
        await (stripe as any).redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Der opstod en fejl. Prøv venligst igen.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vælg den rigtige plan for dig
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start med en gratis prøveperiode på 14 dage. Ingen binding, opsig når som helst.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(STRIPE_PLANS).map(([key, plan]) => {
            const tier = key as SubscriptionTier
            const isPopular = tier === 'professional'
            const isLoading = loading === tier

            return (
              <div
                key={tier}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                  isPopular ? 'ring-4 ring-sky-500' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-sky-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                    Mest populær
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-xl text-gray-500 ml-2">
                      kr/{plan.interval}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSubscribe(tier)}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors mb-8 ${
                      isPopular
                        ? 'bg-sky-500 hover:bg-sky-600'
                        : 'bg-gray-800 hover:bg-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Indlæser...
                      </>
                    ) : (
                      'Start gratis prøveperiode'
                    )}
                  </button>

                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check
                          className="text-green-500 mr-3 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
            Ofte stillede spørgsmål
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                Hvordan fungerer prøveperioden?
              </h3>
              <p className="text-gray-600">
                Du kan bruge alle funktioner gratis i 14 dage. Dit kort bliver først trukket efter prøveperioden udløber. Du kan opsige når som helst.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                Kan jeg skifte plan senere?
              </h3>
              <p className="text-gray-600">
                Ja, du kan opgradere eller nedgradere din plan når som helst fra din konto. Ændringer træder i kraft ved næste faktureringsperiode.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">
                Hvad sker der hvis jeg når mit månedlige limit?
              </h3>
              <p className="text-gray-600">
                For Basis-planen vil du blive bedt om at opgradere når du når 10 indflytningssyn. Professional og Virksomhed har ubegrænsede inspektioner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
