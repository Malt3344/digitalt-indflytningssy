'use client'

import { useState } from 'react'
import { Download, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DownloadPDFButtonProps {
  inspectionId: string
  isPaid: boolean
  onDownload: () => void
}

export default function DownloadPDFButton({ 
  inspectionId, 
  isPaid,
  onDownload 
}: DownloadPDFButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setLoading(true)
      
      // Check auth client-side first
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Du skal være logget ind for at betale')
        window.location.href = '/auth/login'
        return
      }
      
      const response = await fetch('/api/stripe/create-pdf-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`, // Send user ID as additional verification
        },
        body: JSON.stringify({
          inspectionId: inspectionId,
          userId: user.id, // Include user ID in payload
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Kunne ikke oprette betalingssession')
      }

      const { url } = await response.json()
      
      if (url) {
        // Redirect to Stripe Checkout page
        window.location.href = url
      } else {
        throw new Error('Kunne ikke oprette betalingslink')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Der opstod en fejl. Prøv venligst igen.')
    } finally {
      setLoading(false)
    }
  }

  const handleDirectDownload = () => {
    setLoading(true)
    onDownload()
    setTimeout(() => setLoading(false), 2000)
  }

  if (isPaid) {
    return (
      <button
        onClick={handleDirectDownload}
        disabled={loading}
        className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold active:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Genererer...' : '✓ Download synsrapport'}
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-sm text-gray-700 text-center">
          Betal <strong className="text-black">149 kr</strong> for at downloade din professionelle synsrapport
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-black text-white py-4 rounded-xl font-semibold active:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Indlæser...' : 'Betal 149 kr og download'}
      </button>
    </div>
  )
}
