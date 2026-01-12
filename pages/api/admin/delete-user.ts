/**
 * API Route: Delete user account
 * 
 * Deletes a user account using Supabase Admin API (service role).
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' })
    }

    // Delete user using Admin API
    // This will cascade delete orders due to ON DELETE CASCADE in schema
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
      throw error
    }

    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return res.status(500).json({ message: error.message || 'Internal server error' })
  }
}
