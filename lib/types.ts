export type InspectionStatus = 'draft' | 'completed' | 'signed' | 'locked'
export type RoomCondition = 'Perfekt' | 'Brugsspor' | 'Skal udbedres'

export interface Inspection {
  id: string
  created_at: string
  landlord_id: string
  tenant_name: string
  address: string
  inspection_date: string
  status: InspectionStatus
  landlord_signature?: string
  tenant_signature?: string
  // Meter readings
  el_meter_no?: string
  el_reading?: number
  water_reading?: number
  heat_reading?: number
  // Keys
  key_count?: number
  key_notes?: string
}

export interface Room {
  id: string
  inspection_id: string
  room_name: string
  condition: RoomCondition
  description: string
  created_at: string
}

export interface Photo {
  id: string
  room_id: string
  url: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      inspections: {
        Row: Inspection
        Insert: Omit<Inspection, 'id' | 'created_at'>
        Update: Partial<Omit<Inspection, 'id' | 'created_at'>>
      }
      rooms: {
        Row: Room
        Insert: Omit<Room, 'id' | 'created_at'>
        Update: Partial<Omit<Room, 'id' | 'created_at'>>
      }
      photos: {
        Row: Photo
        Insert: Omit<Photo, 'id' | 'created_at'>
        Update: Partial<Omit<Photo, 'id' | 'created_at'>>
      }
    }
  }
}
