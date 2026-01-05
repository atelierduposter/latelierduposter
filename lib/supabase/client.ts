/**
 * Supabase Client Configuration
 * 
 * This file creates a singleton instance of the Supabase client
 * for use in client-side components and pages.
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
export const createSupabaseClient = () => {
  return createClientComponentClient()
}

// For use in server components and API routes
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Database types (will be generated from Supabase)
export type OrderStatus = 
  | 'pending_transformation'
  | 'in_progress'
  | 'sent_for_validation'
  | 'validated'
  | 'printing'
  | 'shipped'
  | 'delivered'

export interface Order {
  id: string
  user_id: string
  image_url: string
  final_image_url?: string
  text_content?: string
  font_family?: string
  status: OrderStatus
  total_amount: number
  payment_intent_id?: string
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  name: string
  thumbnail_url: string
  low_res_url: string
  created_at: string
}
