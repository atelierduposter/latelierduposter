/**
 * Checkout Sign Up Form Component
 * 
 * Handles user registration during checkout with shipping information and anti-bot protection.
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/router'

interface ShippingInfo {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

interface CheckoutSignUpFormProps {
  onSuccess: (userId: string, shippingInfo: ShippingInfo) => void
  onLoginClick: () => void
}

export default function CheckoutSignUpForm({ onSuccess, onLoginClick }: CheckoutSignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [botCheck, setBotCheck] = useState(false)
  const [botCheckTime, setBotCheckTime] = useState<number | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const supabase = createSupabaseClient()
  const { executeRecaptcha } = useGoogleReCaptcha()

  useEffect(() => {
    // Track form load time for bot detection
    setBotCheckTime(Date.now())
  }, [])

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const validateBotCheck = async (): Promise<boolean> => {
    // Simple bot detection: check if form was filled too quickly (< 3 seconds)
    if (!botCheckTime) return false
    const timeSpent = (Date.now() - botCheckTime) / 1000
    if (timeSpent < 3) {
      return false
    }

    // Check honeypot field (hidden field that bots might fill)
    const honeypot = formRef.current?.querySelector('input[name="website"]') as HTMLInputElement
    if (honeypot?.value) {
      return false
    }

    // reCAPTCHA v3 verification
    if (executeRecaptcha) {
      try {
        const token = await executeRecaptcha('signup')
        setRecaptchaToken(token)
        
        // Verify token on server (optional but recommended)
        const verifyResponse = await fetch('/api/verify-recaptcha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        
        if (verifyResponse.ok) {
          const { success, score } = await verifyResponse.json()
          // Score < 0.5 is likely a bot
          if (!success || (score !== undefined && score < 0.5)) {
            return false
          }
        }
      } catch (error) {
        console.error('reCAPTCHA error:', error)
        // If reCAPTCHA fails, fall back to checkbox
        return botCheck
      }
    } else {
      // Fallback to checkbox if reCAPTCHA is not available
      return botCheck
    }

    return true
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    // Validate required shipping fields
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country) {
      setError('Veuillez remplir tous les champs de livraison')
      return
    }

    // Bot check
    const isValid = await validateBotCheck()
    if (!isValid) {
      setError('Vérification anti-bot échouée. Veuillez réessayer.')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            postalCode: shippingInfo.postalCode,
            country: shippingInfo.country,
            phone: shippingInfo.phone,
          },
        },
      })

      if (error) throw error

      if (!data.user) {
        throw new Error('Erreur lors de la création du compte')
      }

      // Call success callback with user ID and shipping info
      onSuccess(data.user.id, shippingInfo)
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue lors de la création du compte')
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte et finaliser votre commande</h2>
      
      <form ref={formRef} onSubmit={handleSignUp} className="space-y-6">
        {/* Honeypot field for bot detection */}
        <input
          type="text"
          name="website"
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Account Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Informations de compte</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Informations de livraison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                id="firstName"
                type="text"
                value={shippingInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="input"
                placeholder="Jean"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                id="lastName"
                type="text"
                value={shippingInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="input"
                placeholder="Dupont"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse *
              </label>
              <input
                id="address"
                type="text"
                value={shippingInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                className="input"
                placeholder="123 Rue de la République"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ville *
              </label>
              <input
                id="city"
                type="text"
                value={shippingInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                className="input"
                placeholder="Paris"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Code postal *
              </label>
              <input
                id="postalCode"
                type="text"
                value={shippingInfo.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                required
                className="input"
                placeholder="75001"
                pattern="[0-9]{5}"
                maxLength={5}
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Pays *
              </label>
              <select
                id="country"
                value={shippingInfo.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
                className="input"
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone (optionnel)
              </label>
              <input
                id="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="input"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>
        </div>

        {/* Anti-bot Protection */}
        {executeRecaptcha ? (
          <div className="text-xs text-gray-500 text-center">
            <p>Protection anti-bot activée (reCAPTCHA v3)</p>
            <p className="mt-1">Votre interaction avec ce formulaire est analysée pour prévenir les abus.</p>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="botCheck"
              checked={botCheck}
              onChange={(e) => setBotCheck(e.target.checked)}
              className="mt-1"
              required
            />
            <label htmlFor="botCheck" className="text-sm text-gray-700">
              Je ne suis pas un robot *
            </label>
          </div>
        )}

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
          {loading ? 'Création du compte...' : 'Créer mon compte et continuer'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Déjà un compte ?{' '}
          <button
            onClick={onLoginClick}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  )
}
