/**
 * API Route: Get user emails
 * 
 * Fetches user emails using Supabase Admin API (service role).
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
    const { userIds } = req.body

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'userIds array is required' })
    }

    // Fetch users from auth.users
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      throw error
    }

    // Filter and map to requested user IDs
    const userMap: Record<string, { email: string; created_at: string }> = {}
    
    users.users.forEach((user) => {
      if (userIds.includes(user.id)) {
        userMap[user.id] = {
          email: user.email || '',
          created_at: user.created_at,
        }
      }
    })

    return res.status(200).json(userMap)
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return res.status(500).json({ message: error.message || 'Internal server error' })
  }
}
