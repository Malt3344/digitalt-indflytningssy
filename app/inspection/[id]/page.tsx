'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Trash2 } from 'lucide-react'
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

  const handleDelete = async () => {
    if (!inspection) return
    
    const confirmed = window.confirm('Er du sikker på, at du vil slette dette indflytningssyn? Denne handling kan ikke fortrydes.')
    
    if (!confirmed) return

    try {
      // Delete rooms (and their photos cascade) first
      await supabase
        .from('rooms')
        .delete()
        .eq('inspection_id', inspection.id)

      // Delete the inspection
      const { error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', inspection.id)

      if (error) throw error

      router.push('/')
    } catch (error) {
      console.error('Error deleting inspection:', error)
      alert('Der opstod en fejl ved sletning')
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

        {/* Info cards - simplified view */}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Lejer
            </h3>
            <p className="text-gray-900 font-medium">{inspection.tenant_name || '-'}</p>
          </div>

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
                  <span className="text-orange-500 text-sm">Mangler</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Lejer</p>
                {inspection.tenant_signature ? (
                  <span className="text-green-600 text-sm">✓ Underskrevet</span>
                ) : (
                  <span className="text-orange-500 text-sm">Mangler</span>
                )}
              </div>
            </div>
          </div>

          {/* Legal reference */}
          <p className="text-xs text-gray-400 text-center">
            Indflytningssyn jf. lejelovens § 9
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 mb-4">
          {/* Edit button - always show */}
          <button
            onClick={() => router.push(`/inspection/${inspection.id}/edit`)}
            className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Rediger syn
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Slet syn
          </button>
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
