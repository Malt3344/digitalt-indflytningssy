import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors when env vars are not available
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

// Proxy object for backwards compatibility - lazily accesses Stripe instance
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

// Re-export plans and types from separate file
export { STRIPE_PLANS, type SubscriptionTier } from './stripe-plans'
