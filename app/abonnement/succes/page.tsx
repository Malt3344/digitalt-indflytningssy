'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

function SuccessContent() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-surface-soft flex items-center justify-center px-4">
      <div className="card-elevated p-8 max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="text-success-600" size={56} />
        </div>

        <h1 className="text-2xl font-bold tracking-tightish text-ink mb-3">
          Betaling gennemført!
        </h1>

        <p className="text-ink-soft mb-6">
          Din synsrapport er nu klar til download.
        </p>

        <button
          onClick={() => router.push('/')}
          className="btn-primary btn-lg w-full"
        >
          Tilbage til forsiden
        </button>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-line border-t-brand-700"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
