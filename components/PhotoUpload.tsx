'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { RoomData } from './RoomInspection'
import { supabase } from '@/lib/supabase'

interface PhotoUploadProps {
  rooms: RoomData[]
  data: { [roomId: string]: string[] }
  onNext: (photos: { [roomId: string]: string[] }) => void
  onBack: () => void
}

export default function PhotoUpload({ rooms, data, onNext, onBack }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<{ [roomId: string]: string[] }>(data)
  const [uploading, setUploading] = useState<{ [roomId: string]: boolean }>({})

  const handleFileUpload = async (roomId: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading({ ...uploading, [roomId]: true })

    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${roomId}-${Date.now()}-${i}.${fileExt}`
      const filePath = `${fileName}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('inspection-photos')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('inspection-photos')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    setPhotos({
      ...photos,
      [roomId]: [...(photos[roomId] || []), ...uploadedUrls],
    })
    setUploading({ ...uploading, [roomId]: false })
  }

  const removePhoto = (roomId: string, photoUrl: string) => {
    setPhotos({
      ...photos,
      [roomId]: (photos[roomId] || []).filter((url) => url !== photoUrl),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(photos)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload billeder</h2>
        <p className="text-gray-500 mb-6">
          Upload billeder for hvert rum. Dette er valgfrit, men anbefales for dokumentation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {rooms.map((room) => (
            <div key={room.id} className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">{room.roomName}</h3>

              <div className="mb-4">
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">
                      {uploading[room.id] ? 'Uploader...' : 'Klik for at uploade billeder'}
                    </span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(room.id, e.target.files)}
                    disabled={uploading[room.id]}
                  />
                </label>
              </div>

              {photos[room.id] && photos[room.id].length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {photos[room.id].map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`${room.roomName} - Billede ${index + 1}`}
                        className="w-full h-28 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(room.id, url)}
                        className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(!photos[room.id] || photos[room.id].length === 0) && (
                <div className="text-center py-6 text-gray-400">
                  <ImageIcon className="mx-auto h-10 w-10 mb-2" />
                  <p className="text-sm">Ingen billeder uploadet endnu</p>
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Tilbage
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Næste
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
