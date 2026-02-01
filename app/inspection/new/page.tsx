'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import BasicInfo from '@/components/BasicInfo'
import RoomInspection, { RoomData } from '@/components/RoomInspection'
import MeterReadings from '@/components/MeterReadings'
import Keys from '@/components/Keys'
import Signature from '@/components/Signature'
import DownloadPDFButton from '@/components/DownloadPDFButton'
import { supabase } from '@/lib/supabase'
import { generatePDF } from '@/lib/pdf-generator'
import { isAdminEmail } from '@/lib/admin-config'

type Step = 1 | 2 | 3 | 4 | 5 | 6

export default function NewInspection() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inspectionId, setInspectionId] = useState<string | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [isFirstInspection, setIsFirstInspection] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Form data
  const [basicInfo, setBasicInfo] = useState({
    tenantName: '',
    address: '',
    inspectionDate: new Date().toISOString().split('T')[0],
  })
  const [rooms, setRooms] = useState<RoomData[]>([])
  const [meterReadings, setMeterReadings] = useState({
    elMeterNo: '',
    elReading: '',
    waterReading: '',
    heatReading: '',
  })
  const [keys, setKeys] = useState({
    keyCount: '',
    keyNotes: '',
  })
  const [signatures, setSignatures] = useState({
    landlordSignature: '',
    tenantSignature: '',
  })

  // Check if this is user's first inspection (for free first inspection logic)
  useEffect(() => {
    checkFirstInspection()
  }, [])

  const checkFirstInspection = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Check if user is admin (unlimited free access)
    const userIsAdmin = isAdminEmail(user.email)
    setIsAdmin(userIsAdmin)

    const { count } = await supabase
      .from('inspections')
      .select('*', { count: 'exact', head: true })
      .eq('landlord_id', user.id)

    // First inspection is free OR admin gets free access
    setIsFirstInspection(count === 0 || userIsAdmin)
  }

  const handleBasicInfoNext = (data: typeof basicInfo) => {
    setBasicInfo(data)
    setCurrentStep(2)
  }

  const handleRoomsNext = (roomData: RoomData[]) => {
    setRooms(roomData)
    setCurrentStep(3)
  }

  const handleMeterReadingsNext = (data: typeof meterReadings) => {
    setMeterReadings(data)
    setCurrentStep(4)
  }

  const handleKeysNext = (data: typeof keys) => {
    setKeys(data)
    setCurrentStep(5)
  }

  const handleSignaturesNext = async (signatureData: typeof signatures) => {
    setSignatures(signatureData)
    setIsSubmitting(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Du skal være logget ind for at gemme inspektionen')
        return
      }

      // Create inspection with is_paid based on first inspection logic
      console.log('=== CREATING INSPECTION ===')
      console.log('User ID:', user.id)
      console.log('Is first inspection:', isFirstInspection)
      
      const insertPayload = {
        landlord_id: user.id,
        tenant_name: basicInfo.tenantName,
        address: basicInfo.address,
        inspection_date: basicInfo.inspectionDate,
        status: 'signed',
        landlord_signature: signatureData.landlordSignature,
        tenant_signature: signatureData.tenantSignature,
        el_meter_no: meterReadings.elMeterNo || null,
        el_reading: meterReadings.elReading ? parseFloat(meterReadings.elReading) : null,
        water_reading: meterReadings.waterReading ? parseFloat(meterReadings.waterReading) : null,
        heat_reading: meterReadings.heatReading ? parseFloat(meterReadings.heatReading) : null,
        key_count: keys.keyCount ? parseInt(keys.keyCount) : null,
        key_notes: keys.keyNotes || null,
        is_paid: isFirstInspection || isAdmin, // First inspection OR admin gets free (is_paid = true)
      }
      
      console.log('Insert payload:', insertPayload)
      
      const { data: inspection, error: inspectionError } = await (supabase as any)
        .from('inspections')
        .insert(insertPayload)
        .select()
        .single()

      console.log('Insert result:', { inspection, inspectionError })

      if (inspectionError) {
        console.error('Inspection error:', inspectionError)
        throw inspectionError
      }

      console.log('Created inspection:', inspection)

      // Create rooms with their notes and photos
      for (const room of rooms) {
        for (const note of room.notes) {
          const { data: roomData, error: roomError } = await (supabase as any)
            .from('rooms')
            .insert({
              inspection_id: inspection.id,
              room_name: room.roomName,
              condition: note.condition,
              description: note.description,
            })
            .select()
            .single()

          if (roomError) throw roomError

          // Create photos for this note (photos are now stored per note)
          if (note.photos && note.photos.length > 0) {
            for (const photoUrl of note.photos) {
              await (supabase as any).from('photos').insert({
                room_id: roomData.id,
                url: photoUrl,
              })
            }
          }
        }
      }

      setInspectionId(inspection.id)
      setIsPaid(isFirstInspection)
      setCurrentStep(6)
    } catch (error) {
      console.error('Error saving inspection:', error)
      alert('Der opstod en fejl ved gemning af inspektionen')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!inspectionId) return

    try {
      // Fetch complete inspection data
      const { data: inspection } = await supabase
        .from('inspections')
        .select('*, rooms(*, photos(*))')
        .eq('id', inspectionId)
        .single()

      if (!inspection) throw new Error('Inspection not found')

      await generatePDF(inspection)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Der opstod en fejl ved generering af PDF')
    }
  }

  const stepLabels = ['Grundinfo', 'Rum & Billeder', 'Målere', 'Nøgler', 'Underskrifter']

  // Handle going back - either to previous step or show confirmation to leave
  const handleGoBack = () => {
    if (currentStep === 1) {
      // First step - confirm before leaving
      if (basicInfo.tenantName || basicInfo.address) {
        const confirmed = window.confirm('Er du sikker på, at du vil forlade? Dine indtastninger vil gå tabt.')
        if (confirmed) {
          router.push('/')
        }
      } else {
        router.push('/')
      }
    } else {
      // Go to previous step
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors -ml-2 px-2 py-1 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">
              {currentStep === 1 ? 'Annuller' : 'Tilbage'}
            </span>
          </button>
          
          <span className="font-semibold text-gray-900">
            {currentStep < 6 ? `Trin ${currentStep} af 5` : 'Fuldført'}
          </span>
          
          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      </header>

      <div className="py-6 px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Nyt indflytningssyn
            </h1>
            <p className="text-xs text-gray-400 mb-2">jf. lejelovens § 9</p>
            {isFirstInspection && currentStep < 6 && (
              <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Dette syn er gratis
              </span>
            )}
          </div>

          {/* Progress Bar - Clickable Navigation */}
          {currentStep < 6 && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1 as Step
                  const isCompleted = currentStep > stepNumber
                  const isCurrent = currentStep === stepNumber
                  const isClickable = stepNumber < currentStep // Can go back to completed steps
                  
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => isClickable && setCurrentStep(stepNumber)}
                      disabled={!isClickable}
                      className={`text-xs font-medium transition-colors ${
                        isCompleted
                          ? 'text-green-600 hover:text-green-700 cursor-pointer'
                          : isCurrent
                          ? 'text-black cursor-default'
                          : 'text-gray-400 cursor-default'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Steps */}
        {currentStep === 1 && (
          <BasicInfo data={basicInfo} onNext={handleBasicInfoNext} />
        )}

        {currentStep === 2 && (
          <RoomInspection
            data={rooms}
            onNext={handleRoomsNext}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <MeterReadings
            data={meterReadings}
            onNext={handleMeterReadingsNext}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Keys
            data={keys}
            onNext={handleKeysNext}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Signature
            data={signatures}
            onNext={handleSignaturesNext}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 6 && inspectionId && (
          <div className="bg-white rounded-2xl p-6 md:p-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Indflytningssyn fuldført!
            </h2>
            <p className="text-gray-500 mb-8">
              {isPaid 
                ? 'Dit syn er gemt. Du kan nu downloade synsrapporten.' 
                : 'Dit syn er gemt. Betal 149 kr for at downloade synsrapporten.'
              }
            </p>

            <div className="max-w-sm mx-auto space-y-3">
              <DownloadPDFButton 
                inspectionId={inspectionId}
                isPaid={isPaid}
                onDownload={handleDownloadPDF}
              />

              <button
                onClick={() => router.push('/')}
                className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Tilbage til forsiden
              </button>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center mx-4">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-black mx-auto mb-4"></div>
              <p className="text-gray-700">Gemmer...</p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
