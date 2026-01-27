'use client'

import { useState } from 'react'
import { Download, CheckCircle, Lock } from 'lucide-react'
import BasicInfo from '@/components/BasicInfo'
import RoomInspection, { RoomData } from '@/components/RoomInspection'
import PhotoUpload from '@/components/PhotoUpload'
import MeterReadings from '@/components/MeterReadings'
import Keys from '@/components/Keys'
import Signature from '@/components/Signature'
import { supabase } from '@/lib/supabase'
import { generatePDF } from '@/lib/pdf-generator'

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

export default function NewInspection() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inspectionId, setInspectionId] = useState<string | null>(null)

  // Form data
  const [basicInfo, setBasicInfo] = useState({
    tenantName: '',
    address: '',
    inspectionDate: new Date().toISOString().split('T')[0],
  })
  const [rooms, setRooms] = useState<RoomData[]>([])
  const [photos, setPhotos] = useState<{ [roomId: string]: string[] }>({})
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

  const handleBasicInfoNext = (data: typeof basicInfo) => {
    setBasicInfo(data)
    setCurrentStep(2)
  }

  const handleRoomsNext = (roomData: RoomData[]) => {
    setRooms(roomData)
    setCurrentStep(3)
  }

  const handlePhotosNext = (photoData: { [roomId: string]: string[] }) => {
    setPhotos(photoData)
    setCurrentStep(4)
  }

  const handleMeterReadingsNext = (data: typeof meterReadings) => {
    setMeterReadings(data)
    setCurrentStep(5)
  }

  const handleKeysNext = (data: typeof keys) => {
    setKeys(data)
    setCurrentStep(6)
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

      // Create inspection
      const { data: inspection, error: inspectionError } = await supabase
        .from('inspections')
        .insert({
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
        })
        .select()
        .single()

      if (inspectionError) throw inspectionError

      // Create rooms with their notes
      for (const room of rooms) {
        for (const note of room.notes) {
          const { data: roomData, error: roomError } = await supabase
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

          // Create photos for this room
          const roomPhotos = photos[room.id] || []
          for (const photoUrl of roomPhotos) {
            await supabase.from('photos').insert({
              room_id: roomData.id,
              url: photoUrl,
            })
          }
        }
      }

      setInspectionId(inspection.id)
      setCurrentStep(7)
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

  const handleLockInspection = async () => {
    if (!inspectionId) return

    const confirm = window.confirm(
      'Er du sikker på at du vil låse inspektionen? Dette kan ikke fortrydes, og ingen ændringer kan foretages herefter.'
    )

    if (!confirm) return

    try {
      const { error } = await supabase
        .from('inspections')
        .update({ status: 'locked' })
        .eq('id', inspectionId)

      if (error) throw error

      alert('Inspektionen er nu låst og kan ikke ændres.')
      window.location.href = '/'
    } catch (error) {
      console.error('Error locking inspection:', error)
      alert('Der opstod en fejl ved låsning af inspektionen')
    }
  }

  const stepLabels = ['Grundinfo', 'Rum', 'Billeder', 'Målere', 'Nøgler', 'Underskrifter']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Digitalt Indflytningssyn
          </h1>
          <p className="text-lg text-gray-600">
            Opret et professionelt og lovligt indflytningssyn
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep < 7 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {stepLabels.map((label, index) => (
                <div
                  key={label}
                  className={`text-xs md:text-sm font-medium ${
                    currentStep > index + 1
                      ? 'text-primary-600'
                      : currentStep === index + 1
                      ? 'text-primary-700'
                      : 'text-gray-400'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
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
          <PhotoUpload
            rooms={rooms}
            data={photos}
            onNext={handlePhotosNext}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <MeterReadings
            data={meterReadings}
            onNext={handleMeterReadingsNext}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Keys
            data={keys}
            onNext={handleKeysNext}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 6 && (
          <Signature
            data={signatures}
            onNext={handleSignaturesNext}
            onBack={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 7 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Indflytningssyn Fuldført!
            </h2>
            <p className="text-gray-600 mb-8">
              Inspektionen er gemt og klar til download. Du kan nu låse inspektionen for at forhindre fremtidige ændringer.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleDownloadPDF}
                className="w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </button>

              <button
                onClick={handleLockInspection}
                className="w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                <Lock className="h-5 w-5" />
                Lås Inspektion (Kan ikke fortrydes)
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full max-w-md mx-auto block bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Tilbage til Forsiden
              </button>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Gemmer inspektion...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
