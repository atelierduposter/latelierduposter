/**
 * API Route: Verify reCAPTCHA token
 * 
 * Verifies reCAPTCHA v3 token with Google's API.
 */

import { NextApiRequest, NextApiResponse } from 'next'

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!RECAPTCHA_SECRET_KEY) {
    // If no secret key, allow the request (reCAPTCHA is optional)
    return res.status(200).json({ success: true, score: 1.0 })
  }

  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: 'Token is required' })
    }

    // Verify token with Google
    const verifyResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    )

    const data = await verifyResponse.json()

    return res.status(200).json({
      success: data.success,
      score: data.score,
      action: data.action,
    })
  } catch (error: any) {
    console.error('Error verifying reCAPTCHA:', error)
    // On error, allow the request (fail open)
    return res.status(200).json({ success: true, score: 1.0 })
  }
}
