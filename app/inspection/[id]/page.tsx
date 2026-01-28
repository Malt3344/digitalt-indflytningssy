'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generatePDF } from '@/lib/pdf-generator'
import DownloadPDFButton from '@/components/DownloadPDFButton'
import Navigation from '@/components/Navigation'

interface Inspection {
  id: string
  tenant_name: string
  address: string
  inspection_date: string
  status: string
  is_paid: boolean
  created_at: string
  landlord_signature?: string
  tenant_signature?: string
  el_meter_no?: string
  el_reading?: number
  water_reading?: number
  heat_reading?: number
  key_count?: number
  key_notes?: string
  rooms?: any[]
}

export default function InspectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const inspectionId = params.id as string
  const paymentStatus = searchParams.get('payment')

  useEffect(() => {
    loadInspection()
  }, [inspectionId])

  // Handle payment success redirect
  useEffect(() => {
    if (paymentStatus === 'success') {
      // Refresh the inspection data to get updated is_paid status
      loadInspection()
    }
  }, [paymentStatus])

  const loadInspection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error: fetchError } = await supabase
        .from('inspections')
        .select('*, rooms(*, photos(*))')
        .eq('id', inspectionId)
        .eq('landlord_id', user.id)
        .single()

      if (fetchError) {
        setError('Kunne ikke finde indflytningssynet')
        return
      }

      setInspection(data)
    } catch (err) {
      console.error('Error loading inspection:', err)
      setError('Der opstod en fejl')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!inspection) return

    try {
      await generatePDF(inspection)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Der opstod en fejl ved generering af PDF')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-black"></div>
      </div>
    )
  }

  if (error || !inspection) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-red-600 mb-4">{error || 'Inspektion ikke fundet'}</p>
          <button
            onClick={() => router.push('/')}
            className="text-black underline font-medium"
          >
            Tilbage til forsiden
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Payment success message */}
        {paymentStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-center">
            ✓ Betaling gennemført! Du kan nu downloade din synsrapport.
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 text-sm mb-4 flex items-center gap-1"
          >
            ← Tilbage
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {inspection.address || 'Ingen adresse'}
          </h1>
          <p className="text-gray-500 text-sm">
            {new Date(inspection.inspection_date).toLocaleDateString('da-DK', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Info cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Lejer
            </h3>
            <p className="text-gray-900 font-medium">{inspection.tenant_name || '-'}</p>
          </div>

          {(inspection.el_reading || inspection.water_reading || inspection.heat_reading) && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Målerstande
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {inspection.el_reading && (
                  <div>
                    <p className="text-gray-500">El</p>
                    <p className="font-medium">{inspection.el_reading}</p>
                  </div>
                )}
                {inspection.water_reading && (
                  <div>
                    <p className="text-gray-500">Vand</p>
                    <p className="font-medium">{inspection.water_reading}</p>
                  </div>
                )}
                {inspection.heat_reading && (
                  <div>
                    <p className="text-gray-500">Varme</p>
                    <p className="font-medium">{inspection.heat_reading}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.key_count && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Nøgler
              </h3>
              <p className="text-gray-900 font-medium">{inspection.key_count} stk.</p>
              {inspection.key_notes && (
                <p className="text-gray-600 text-sm mt-1">{inspection.key_notes}</p>
              )}
            </div>
          )}

          {/* Signatures */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Underskrifter
            </h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Udlejer</p>
                {inspection.landlord_signature ? (
                  <span className="text-green-600 text-sm">✓ Underskrevet</span>
                ) : (
                  <span className="text-gray-400 text-sm">Mangler</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Lejer</p>
                {inspection.tenant_signature ? (
                  <span className="text-green-600 text-sm">✓ Underskrevet</span>
                ) : (
                  <span className="text-gray-400 text-sm">Mangler</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
        <DownloadPDFButton
          inspectionId={inspection.id}
          isPaid={inspection.is_paid}
          onDownload={handleDownload}
        />
      </main>
    </div>
  )
}
