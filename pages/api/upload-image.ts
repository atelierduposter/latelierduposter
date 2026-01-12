/**
 * API Route: Upload image after authentication
 * 
 * Uploads an image to Supabase Storage for authenticated users.
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { imageData, userId, fileName } = req.body

    if (!imageData || !userId || !fileName) {
      return res.status(400).json({ message: 'Missing required parameters' })
    }

    // Create Supabase client with user's auth token
    const authToken = req.headers.authorization?.replace('Bearer ', '')
    if (!authToken) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    })

    // Convert base64 to blob
    const base64Data = imageData.split(',')[1] || imageData
    const binaryData = Buffer.from(base64Data, 'base64')
    const blob = new Blob([binaryData])

    // Upload to Supabase Storage
    const filePath = `${userId}-${Date.now()}-${fileName}`
    const { data, error } = await supabase.storage
      .from('uploaded-images')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('uploaded-images')
      .getPublicUrl(filePath)

    return res.status(200).json({ 
      imageUrl: urlData.publicUrl,
      filePath 
    })
  } catch (error: any) {
    console.error('Error uploading image:', error)
    return res.status(500).json({ message: error.message || 'Internal server error' })
  }
}
