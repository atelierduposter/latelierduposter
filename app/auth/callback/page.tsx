/**
 * Auth Callback Page
 * 
 * Handles Supabase authentication callbacks (email confirmation, OAuth).
 * Exchanges the access_token from URL for a session and redirects accordingly.
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the code and other params from URL
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Handle OAuth errors
        if (error) {
          setStatus('error')
          setErrorMessage(errorDescription || error || 'Une erreur est survenue lors de l\'authentification')
          setTimeout(() => {
            router.push(`/auth/login?error=${encodeURIComponent(error)}`)
          }, 2000)
          return
        }

        // Exchange code for session
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError)
            setStatus('error')
            setErrorMessage('Impossible de valider votre session. Veuillez réessayer.')
            setTimeout(() => {
              router.push(`/auth/login?error=session_error`)
            }, 2000)
            return
          }

          if (data.session) {
            setStatus('success')
            // Small delay to show success state
            setTimeout(() => {
              router.push('/account')
            }, 1000)
          } else {
            setStatus('error')
            setErrorMessage('Aucune session n\'a pu être créée.')
            setTimeout(() => {
              router.push('/auth/login?error=no_session')
            }, 2000)
          }
        } else {
          // No code in URL, try to get existing session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()

          if (sessionError || !session) {
            setStatus('error')
            setErrorMessage('Aucune session valide trouvée.')
            setTimeout(() => {
              router.push('/auth/login?error=no_session')
            }, 2000)
            return
          }

          setStatus('success')
          setTimeout(() => {
            router.push('/account')
          }, 1000)
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        setStatus('error')
        setErrorMessage('Une erreur inattendue est survenue.')
        setTimeout(() => {
          router.push('/auth/login?error=unexpected_error')
        }, 2000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="text-center max-w-md mx-auto px-4">
        {status === 'loading' && (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <h2 className="text-2xl font-semibold text-primary-700 mb-2">
              Vérification en cours...
            </h2>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous vérifions votre compte.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-block w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-primary-700 mb-2">
              Connexion réussie !
            </h2>
            <p className="text-gray-600">
              Redirection en cours...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-block w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-primary-700 mb-2">
              Erreur de connexion
            </h2>
            <p className="text-gray-600 mb-4">
              {errorMessage}
            </p>
            <p className="text-sm text-gray-500">
              Redirection vers la page de connexion...
            </p>
          </>
        )}
      </div>
    </div>
  )
}
