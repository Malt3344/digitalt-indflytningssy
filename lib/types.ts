export type InspectionStatus = 'draft' | 'completed' | 'signed' | 'locked'
export type RoomCondition = 'Perfekt' | 'Brugsspor' | 'Mangel'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid'
export type SubscriptionTier = 'basic' | 'professional' | 'enterprise'

export interface UserProfile {
  id: string
  email: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status?: SubscriptionStatus
  subscription_tier?: SubscriptionTier
  subscription_current_period_end?: string
  inspections_count?: number
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

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
  // Payment
  is_paid: boolean
  payment_intent_id?: string
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
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<UserProfile>
        Relationships: []
      }
      inspections: {
        Row: Inspection
        Insert: Omit<Inspection, 'id' | 'created_at'>
        Update: Partial<Inspection>
        Relationships: []
      }
      rooms: {
        Row: Room
        Insert: Omit<Room, 'id' | 'created_at'>
        Update: Partial<Room>
        Relationships: []
      }
      photos: {
        Row: Photo
        Insert: Omit<Photo, 'id' | 'created_at'>
        Update: Partial<Photo>
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
