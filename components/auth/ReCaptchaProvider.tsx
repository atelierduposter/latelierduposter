/**
 * reCAPTCHA Provider Component
 * 
 * Wraps the app with reCAPTCHA v3 provider.
 */

'use client'

import { ReactNode } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

interface ReCaptchaProviderProps {
  children: ReactNode
}

export default function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

  if (!recaptchaSiteKey) {
    // If no reCAPTCHA key is configured, render children without protection
    console.warn('reCAPTCHA site key not configured. Anti-bot protection is disabled.')
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      language="fr"
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
