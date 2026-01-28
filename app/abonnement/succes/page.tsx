'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

function SuccessContent() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-gray-50 rounded-2xl p-8 max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="text-green-500" size={64} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Betaling gennemført!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Din synsrapport er nu klar til download.
        </p>

        <button
          onClick={() => router.push('/')}
          className="w-full bg-black text-white py-3 px-6 rounded-xl font-semibold active:bg-gray-800"
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
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-black"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
