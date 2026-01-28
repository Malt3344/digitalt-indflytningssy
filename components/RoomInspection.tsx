'use client'

import { useState } from 'react'
import { Plus, Trash2, MessageSquare } from 'lucide-react'
import { RoomCondition } from '@/lib/types'

export interface RoomNote {
  id: string
  condition: RoomCondition
  description: string
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
            notes: [{ id: 'note-1', condition: 'Perfekt', description: '' }],
          },
        ]
  )
  
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
        notes: [{ id: `note-${Date.now()}`, condition: 'Perfekt', description: '' }],
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
                { id: `note-${Date.now()}`, condition: 'Perfekt', description: '' },
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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Rum-for-Rum Inspektion</h2>
        <p className="text-gray-600 mb-6">
          Tilføj alle rum én gang. Du kan tilføje flere bemærkninger per rum hvis nødvendigt.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {rooms.map((room, roomIndex) => (
            <div key={room.id} className="border-2 border-gray-200 rounded-lg p-6 relative">
              {/* Room Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Rum {roomIndex + 1}
                </h3>
                {rooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoom(room.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Room Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rum Navn
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Bemærkning {noteIndex + 1}
                      </span>
                      {room.notes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeNoteFromRoom(room.id, note.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Fjern
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stand
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['Perfekt', 'Brugsspor', 'Skal udbedres'] as RoomCondition[]).map(
                          (condition) => (
                            <button
                              key={condition}
                              type="button"
                              onClick={() =>
                                updateNote(room.id, note.id, 'condition', condition)
                              }
                              className={`py-3 px-4 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${
                                note.condition === condition
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                              }`}
                            >
                              {condition}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Beskrivelse
                      </label>
                      <textarea
                        value={note.description}
                        onChange={(e) =>
                          updateNote(room.id, note.id, 'description', e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Beskriv eventuelle skader eller bemærkninger..."
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addNoteToRoom(room.id)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Tilføj Bemærkning til {room.roomName || 'dette rum'}
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addRoom}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Tilføj Nyt Rum
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Tilbage
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Næste
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

