/**
 * Header Component
 * 
 * Main navigation header with logo on left, menu on right.
 * Includes responsive hamburger menu for mobile.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()
  const { getItemCount } = useCart()

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/poc')
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/poc" className="text-2xl font-bold text-primary-700">
            Mon Petit Poster
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/poc" className="text-gray-700 hover:text-primary-600 transition-colors">
              Accueil
            </Link>
            <Link href="/gallery" className="text-gray-700 hover:text-primary-600 transition-colors">
              Galerie
            </Link>
            <Link href="/customize" className="text-gray-700 hover:text-primary-600 transition-colors">
              Personnaliser
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Contact
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 transition-colors relative">
              Panier
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>
            
            {loading ? (
              <span className="text-gray-400">Chargement...</span>
            ) : user ? (
              <>
                <Link href="/orders" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Mes commandes
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Connexion
                </Link>
                <Link href="/auth/signup" className="btn btn-primary">
                  Créer un compte
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                href="/poc" 
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="/gallery" 
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Galerie
              </Link>
              <Link 
                href="/customize" 
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Personnaliser
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/cart" 
                className="text-gray-700 hover:text-primary-600 transition-colors relative"
                onClick={() => setMobileMenuOpen(false)}
              >
                Panier
                {getItemCount() > 0 && (
                  <span className="ml-2 bg-accent text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {getItemCount()}
                  </span>
                )}
              </Link>
              
              {!loading && user && (
                <>
                  <Link 
                    href="/orders" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mes commandes
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary text-left"
                  >
                    Déconnexion
                  </button>
                </>
              )}
              
              {!loading && !user && (
                <>
                  <Link 
                    href="/auth/login" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="btn btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
