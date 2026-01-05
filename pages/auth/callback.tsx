/**
 * Auth Callback Page
 * 
 * Handles OAuth callbacks and email confirmation redirects from Supabase.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        router.push('/auth/login?error=callback_error')
        return
      }

      if (data.session) {
        router.push('/account')
      } else {
        router.push('/auth/login')
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Vérification en cours...</h2>
        <p className="text-gray-600">Veuillez patienter pendant que nous vérifions votre compte.</p>
      </div>
    </div>
  )
}
