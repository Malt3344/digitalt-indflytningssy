// Stripe pricing plans configuration (safe for client-side use)

export const STRIPE_PLANS = {
  basic: {
    name: 'Basis',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC!,
    price: 99,
    interval: 'måned',
    features: [
      'Op til 10 indflytningssyn pr. måned',
      'PDF eksport',
      'Billedupload',
      'Digital signatur',
      'Email support'
    ]
  },
  professional: {
    name: 'Professionel',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL!,
    price: 249,
    interval: 'måned',
    features: [
      'Ubegrænsede indflytningssyn',
      'PDF eksport',
      'Billedupload',
      'Digital signatur',
      'Prioriteret support',
      'Branding tilpasning',
      'Avanceret rapportering'
    ]
  },
  enterprise: {
    name: 'Virksomhed',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE!,
    price: 499,
    interval: 'måned',
    features: [
      'Ubegrænsede indflytningssyn',
      'Multi-bruger adgang',
      'PDF eksport',
      'Billedupload',
      'Digital signatur',
      'Dedikeret support',
      'Branding tilpasning',
      'API adgang',
      'Avanceret rapportering',
      'Prioriteret feature requests'
    ]
  }
} as const

export type SubscriptionTier = keyof typeof STRIPE_PLANS

// One-time PDF payment configuration
export const PDF_DOWNLOAD_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_PDF_DOWNLOAD!;
export const PDF_DOWNLOAD_PRICE = 149; // DKK
