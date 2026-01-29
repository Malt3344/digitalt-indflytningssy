'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import BasicInfo from '@/components/BasicInfo'
import RoomInspection, { RoomData } from '@/components/RoomInspection'
import MeterReadings from '@/components/MeterReadings'
import Keys from '@/components/Keys'
import Signature from '@/components/Signature'
import { supabase } from '@/lib/supabase'

type Step = 1 | 2 | 3 | 4 | 5 | 6

export default function EditInspection() {
  const router = useRouter()
  const params = useParams()
  const inspectionId = params.id as string
  
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

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

  // Load existing inspection data
  useEffect(() => {
    loadInspection()
  }, [inspectionId])

  const loadInspection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: inspection, error } = await (supabase as any)
        .from('inspections')
        .select('*, rooms(*, photos(*))')
        .eq('id', inspectionId)
        .eq('landlord_id', user.id)
        .single()

      if (error || !inspection) {
        setLoadError('Kunne ikke finde indflytningssynet')
        return
      }

      // Populate form data
      setBasicInfo({
        tenantName: inspection.tenant_name || '',
        address: inspection.address || '',
        inspectionDate: inspection.inspection_date || new Date().toISOString().split('T')[0],
      })

      setMeterReadings({
        elMeterNo: inspection.el_meter_no || '',
        elReading: inspection.el_reading?.toString() || '',
        waterReading: inspection.water_reading?.toString() || '',
        heatReading: inspection.heat_reading?.toString() || '',
      })

      setKeys({
        keyCount: inspection.key_count?.toString() || '',
        keyNotes: inspection.key_notes || '',
      })

      setSignatures({
        landlordSignature: inspection.landlord_signature || '',
        tenantSignature: inspection.tenant_signature || '',
      })

      // Transform rooms from DB format to component format
      // Now photos are stored directly on each note
      if (inspection.rooms && inspection.rooms.length > 0) {
        const roomsMap = new Map<string, RoomData>()

        inspection.rooms.forEach((room: any) => {
          // Get photos for this room/note
          const notePhotos = room.photos ? room.photos.map((p: any) => p.url) : []

          // Check if we already have this room name
          const existingRoom = Array.from(roomsMap.values()).find(r => r.roomName === room.room_name)
          
          if (existingRoom) {
            // Add as another note to existing room
            existingRoom.notes.push({
              id: `note-${room.id}`,
              condition: room.condition || 'Perfekt',
              description: room.description || '',
              photos: notePhotos,
            })
          } else {
            // Create new room entry
            const roomId = `room-${room.id}`
            roomsMap.set(roomId, {
              id: roomId,
              roomName: room.room_name,
              notes: [{
                id: `note-${room.id}`,
                condition: room.condition || 'Perfekt',
                description: room.description || '',
                photos: notePhotos,
              }],
            })
          }
        })

        setRooms(Array.from(roomsMap.values()))
      }

    } catch (err) {
      console.error('Error loading inspection:', err)
      setLoadError('Der opstod en fejl ved indlæsning')
    } finally {
      setIsLoading(false)
    }
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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Du skal være logget ind for at gemme inspektionen')
        return
      }

      // Update the inspection
      const { error: updateError } = await (supabase as any)
        .from('inspections')
        .update({
          tenant_name: basicInfo.tenantName,
          address: basicInfo.address,
          inspection_date: basicInfo.inspectionDate,
          landlord_signature: signatureData.landlordSignature || null,
          tenant_signature: signatureData.tenantSignature || null,
          el_meter_no: meterReadings.elMeterNo || null,
          el_reading: meterReadings.elReading ? parseFloat(meterReadings.elReading) : null,
          water_reading: meterReadings.waterReading ? parseFloat(meterReadings.waterReading) : null,
          heat_reading: meterReadings.heatReading ? parseFloat(meterReadings.heatReading) : null,
          key_count: keys.keyCount ? parseInt(keys.keyCount) : null,
          key_notes: keys.keyNotes || null,
          status: signatureData.landlordSignature && signatureData.tenantSignature ? 'signed' : 'draft',
        })
        .eq('id', inspectionId)

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      // Delete all existing rooms (and their photos cascade)
      await (supabase as any)
        .from('rooms')
        .delete()
        .eq('inspection_id', inspectionId)

      // Create new rooms with their notes and photos
      for (const room of rooms) {
        for (const note of room.notes) {
          const { data: roomData, error: roomError } = await (supabase as any)
            .from('rooms')
            .insert({
              inspection_id: inspectionId,
              room_name: room.roomName,
              condition: note.condition,
              description: note.description,
            })
            .select()
            .single()

          if (roomError) throw roomError

          // Create photos for this note
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

      setCurrentStep(6)
    } catch (error) {
      console.error('Error saving inspection:', error)
      alert('Der opstod en fejl ved gemning af inspektionen')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepLabels = ['Grundinfo', 'Rum & Billeder', 'Målere', 'Nøgler', 'Underskrifter']

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-black"></div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-white py-6 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-600 mb-4">{loadError}</p>
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
    <div className="min-h-screen bg-white py-6 px-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push(`/inspection/${inspectionId}`)}
            className="text-gray-500 text-sm mb-4 flex items-center gap-1 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Tilbage til syn
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Rediger syn
          </h1>
          <p className="text-xs text-gray-400">jf. lejelovens § 9</p>
        </div>

        {/* Progress Bar */}
        {currentStep < 6 && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {stepLabels.map((label, index) => (
                <div
                  key={label}
                  className={`text-xs font-medium ${
                    currentStep > index + 1
                      ? 'text-green-600'
                      : currentStep === index + 1
                      ? 'text-black'
                      : 'text-gray-400'
                  }`}
                >
                  {label}
                </div>
              ))}
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

        {currentStep === 6 && (
          <div className="bg-white rounded-2xl p-6 md:p-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ændringer gemt!
            </h2>
            <p className="text-gray-500 mb-8">
              Dit indflytningssyn er blevet opdateret.
            </p>

            <div className="max-w-sm mx-auto space-y-3">
              <button
                onClick={() => router.push(`/inspection/${inspectionId}`)}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Se syn
              </button>

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
              <p className="text-gray-700">Gemmer ændringer...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
