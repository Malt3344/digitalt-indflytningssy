'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generatePDF } from '@/lib/pdf-generator'
import { isAdminEmail } from '@/lib/admin-config'

export default function DownloadPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'verifying' | 'downloading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  const inspectionId = params.id as string
  const paymentSuccess = searchParams.get('payment') === 'success'

  useEffect(() => {
    handleDownload()
  }, [inspectionId])

  const handleDownload = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // If coming from successful payment, verify it first
      if (paymentSuccess) {
        setStatus('verifying')
        try {
          const response = await fetch('/api/stripe/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inspectionId }),
          })
          const result = await response.json()
          if (!result.verified) {
            // Payment not found yet, might take a moment
            await new Promise(resolve => setTimeout(resolve, 2000))
            // Try one more time
            const retryResponse = await fetch('/api/stripe/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ inspectionId }),
            })
            await retryResponse.json()
          }
        } catch (e) {
          console.error('Error verifying payment:', e)
        }
      }

      // Fetch inspection and verify payment
      const { data: inspection, error: fetchError } = await (supabase as any)
        .from('inspections')
        .select('*, rooms(*, photos(*))')
        .eq('id', inspectionId)
        .eq('landlord_id', user.id)
        .single()

      if (fetchError || !inspection) {
        setError('Kunne ikke finde indflytningssynet')
        setStatus('error')
        return
      }

      // Check if admin (unlimited free access) or paid
      const userIsAdmin = isAdminEmail(user.email)
      
      if (!inspection.is_paid && !userIsAdmin) {
        // Redirect back to inspection page to pay
        router.push(`/inspection/${inspectionId}?payment=required`)
        return
      }

      setStatus('downloading')

      // Generate and download PDF
      await generatePDF(inspection)

      setStatus('success')

      // Redirect after a moment
      setTimeout(() => {
        router.push(`/inspection/${inspectionId}`)
      }, 2000)

    } catch (err) {
      console.error('Error downloading PDF:', err)
      setError('Der opstod en fejl ved generering af PDF')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-black mx-auto mb-4"></div>
            <p className="text-gray-600">Forbereder download...</p>
          </>
        )}

        {status === 'downloading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-black mx-auto mb-4"></div>
            <p className="text-gray-600">Genererer PDF...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Download startet</h2>
            <p className="text-gray-600">Din synsrapport downloades nu...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">✕</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Der opstod en fejl</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push(`/inspection/${inspectionId}`)}
              className="text-black underline font-medium"
            >
              Tilbage til synet
            </button>
          </>
        )}
      </div>
    </div>
  )
}
