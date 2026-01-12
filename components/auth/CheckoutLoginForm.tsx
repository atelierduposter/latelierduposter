/**
 * Checkout Login Form Component
 * 
 * Handles user login during checkout.
 */

'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

interface CheckoutLoginFormProps {
  onSuccess: (userId: string) => void
  onSignUpClick: () => void
}

export default function CheckoutLoginForm({ onSuccess, onSignUpClick }: CheckoutLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createSupabaseClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (!data.user) {
        throw new Error('Erreur lors de la connexion')
      }

      onSuccess(data.user.id)
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue lors de la connexion')
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Se connecter</h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="loginEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="loginPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Pas encore de compte ?{' '}
          <button
            onClick={onSignUpClick}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </div>
  )
}
