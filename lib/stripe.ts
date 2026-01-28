import Stripe from 'stripe'

// Initialize Stripe with secret key (SERVER-SIDE ONLY)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// Re-export plans and types from separate file
export { STRIPE_PLANS, type SubscriptionTier } from './stripe-plans'
