'use client'

import { useState } from 'react'
import { Plus, Trash2, MessageSquare, Upload, X, Camera } from 'lucide-react'
import { RoomCondition } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export interface RoomNote {
  id: string
  condition: RoomCondition
  description: string
  photos: string[]
}

export interface RoomData {
  id: string
  roomName: string
  notes: RoomNote[]
}

interface RoomInspectionProps {
  data: RoomData[]
  onNext: (rooms: RoomData[]) => void
  onBack: () => void
}

const COMMON_ROOMS = [
  'Stue',
  'Køkken',
  'Soveværelse',
  'Badeværelse',
  'Gang',
  'Entre',
  'Toilet',
  'Altan/Balkon',
]

export default function RoomInspection({ data, onNext, onBack }: RoomInspectionProps) {
  const [rooms, setRooms] = useState<RoomData[]>(
    data.length > 0
      ? data
      : [
          {
            id: '1',
            roomName: '',
            notes: [{ id: 'note-1', condition: 'Perfekt', description: '', photos: [] }],
          },
        ]
  )
  
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  
  // Track which rooms have "Andet" selected
  const [customRooms, setCustomRooms] = useState<Record<string, boolean>>(() => {
    // Initialize from existing data - if roomName is not in COMMON_ROOMS, it's custom
    const initial: Record<string, boolean> = {}
    data.forEach((room) => {
      if (room.roomName && !COMMON_ROOMS.includes(room.roomName)) {
        initial[room.id] = true
      }
    })
    return initial
  })

  const addRoom = () => {
    setRooms([
      ...rooms,
      {
        id: Date.now().toString(),
        roomName: '',
        notes: [{ id: `note-${Date.now()}`, condition: 'Perfekt', description: '', photos: [] }],
      },
    ])
  }

  const removeRoom = (roomId: string) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((room) => room.id !== roomId))
      // Clean up customRooms state
      const newCustomRooms = { ...customRooms }
      delete newCustomRooms[roomId]
      setCustomRooms(newCustomRooms)
    }
  }

  const addNoteToRoom = (roomId: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              notes: [
                ...room.notes,
                { id: `note-${Date.now()}`, condition: 'Perfekt', description: '', photos: [] },
              ],
            }
          : room
      )
    )
  }

  const removeNoteFromRoom = (roomId: string, noteId: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? { ...room, notes: room.notes.filter((note) => note.id !== noteId) }
          : room
      )
    )
  }

  const updateRoomName = (roomId: string, roomName: string) => {
    setRooms(rooms.map((room) => (room.id === roomId ? { ...room, roomName } : room)))
  }

  const updateNote = (
    roomId: string,
    noteId: string,
    field: keyof RoomNote,
    value: string
  ) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              notes: room.notes.map((note) =>
                note.id === noteId ? { ...note, [field]: value } : note
              ),
            }
          : room
      )
    )
  }

  // Photo handling for individual notes
  const handlePhotoUpload = async (roomId: string, noteId: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    const uploadKey = `${roomId}-${noteId}`
    setUploading({ ...uploading, [uploadKey]: true })

    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${noteId}-${Date.now()}-${i}.${fileExt}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('inspection-photos')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('inspection-photos')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    // Add uploaded photos to the note
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              notes: room.notes.map((note) =>
                note.id === noteId
                  ? { ...note, photos: [...note.photos, ...uploadedUrls] }
                  : note
              ),
            }
          : room
      )
    )

    setUploading({ ...uploading, [uploadKey]: false })
  }

  const removePhoto = (roomId: string, noteId: string, photoUrl: string) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              notes: room.notes.map((note) =>
                note.id === noteId
                  ? { ...note, photos: note.photos.filter((url) => url !== photoUrl) }
                  : note
              ),
            }
          : room
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that all rooms have names and at least one note
    const isValid = rooms.every((room) => room.roomName && room.notes.length > 0)
    
    if (!isValid) {
      alert('Alle rum skal have et navn og mindst én bemærkning')
      return
    }

    onNext(rooms)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rum-for-rum inspektion</h2>
        <p className="text-gray-500 mb-6">
          Tilføj alle rum én gang. Du kan tilføje flere bemærkninger per rum hvis nødvendigt.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {rooms.map((room, roomIndex) => (
            <div key={room.id} className="border border-gray-200 rounded-xl p-5 relative">
              {/* Room Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Rum {roomIndex + 1}
                </h3>
                {rooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoom(room.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Room Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Rum navn
                </label>
                <select
                  value={customRooms[room.id] ? 'Andet' : room.roomName}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === 'Andet') {
                      setCustomRooms({ ...customRooms, [room.id]: true })
                      updateRoomName(room.id, '')
                    } else {
                      setCustomRooms({ ...customRooms, [room.id]: false })
                      updateRoomName(room.id, value)
                    }
                  }}
                  required={!customRooms[room.id]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-white"
                >
                  <option value="">Vælg rum</option>
                  {COMMON_ROOMS.map((roomName) => (
                    <option key={roomName} value={roomName}>
                      {roomName}
                    </option>
                  ))}
                  <option value="Andet">Andet</option>
                </select>
              </div>

              {customRooms[room.id] && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Indtast rum navn"
                    value={room.roomName}
                    onChange={(e) => updateRoomName(room.id, e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  />
                </div>
              )}

              {/* Notes for this room */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MessageSquare className="h-4 w-4" />
                  Bemærkninger for {room.roomName || 'dette rum'}
                </div>

                {room.notes.map((note, noteIndex) => (
                  <div
                    key={note.id}
                    className="bg-gray-50 rounded-xl p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Bemærkning {noteIndex + 1}
                      </span>
                      {room.notes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeNoteFromRoom(room.id, note.id)}
                          className="text-gray-400 hover:text-red-500 text-sm transition-colors"
                        >
                          Fjern
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stand
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(['Perfekt', 'Brugsspor', 'Mangel'] as RoomCondition[]).map(
                          (condition) => (
                            <button
                              key={condition}
                              type="button"
                              onClick={() =>
                                updateNote(room.id, note.id, 'condition', condition)
                              }
                              className={`py-3 px-4 rounded-xl font-medium transition-colors text-sm whitespace-nowrap ${
                                note.condition === condition
                                  ? 'bg-black text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {condition}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Beskrivelse
                      </label>
                      <textarea
                        value={note.description}
                        onChange={(e) =>
                          updateNote(room.id, note.id, 'description', e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors resize-none"
                        placeholder="Beskriv eventuelle skader eller bemærkninger..."
                      />
                    </div>

                    {/* Photo upload for this note */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billeder (valgfrit)
                      </label>
                      
                      {/* Upload button */}
                      <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition-colors mb-3">
                        <Camera className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {uploading[`${room.id}-${note.id}`] ? 'Uploader...' : 'Tilføj billeder'}
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(room.id, note.id, e.target.files)}
                          disabled={uploading[`${room.id}-${note.id}`]}
                        />
                      </label>

                      {/* Photo grid */}
                      {note.photos && note.photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {note.photos.map((url, photoIndex) => (
                            <div key={photoIndex} className="relative group">
                              <img
                                src={url}
                                alt={`Billede ${photoIndex + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(room.id, note.id, url)}
                                className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addNoteToRoom(room.id)}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Tilføj bemærkning til {room.roomName || 'dette rum'}
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addRoom}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Tilføj nyt rum
          </button>

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

