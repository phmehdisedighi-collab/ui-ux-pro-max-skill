export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name_fa: string
          name_en: string
          description_fa: string
          description_en: string
          duration_minutes: number
          price: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name_fa: string
          name_en: string
          description_fa: string
          description_en: string
          duration_minutes: number
          price: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name_fa?: string
          name_en?: string
          description_fa?: string
          description_en?: string
          duration_minutes?: number
          price?: number
          is_active?: boolean
        }
      }
      available_slots: {
        Row: {
          id: string
          service_id: string
          start_time: string
          end_time: string
          is_booked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          start_time: string
          end_time: string
          is_booked?: boolean
          created_at?: string
        }
        Update: {
          is_booked?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_id: string
          slot_id: string
          platform: 'google_meet' | 'zoom'
          meeting_link: string | null
          notes: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          slot_id: string
          platform: 'google_meet' | 'zoom'
          meeting_link?: string | null
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          meeting_link?: string | null
          payment_id?: string | null
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          amount: number
          authority: string | null
          ref_id: string | null
          status: 'pending' | 'success' | 'failed'
          gateway: 'zarinpal'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          user_id: string
          amount: number
          authority?: string | null
          ref_id?: string | null
          status?: 'pending' | 'success' | 'failed'
          gateway?: 'zarinpal'
          created_at?: string
          updated_at?: string
        }
        Update: {
          authority?: string | null
          ref_id?: string | null
          status?: 'pending' | 'success' | 'failed'
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
