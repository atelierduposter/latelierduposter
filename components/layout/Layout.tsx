/**
 * Layout Component
 * 
 * Main layout wrapper for all pages.
 * Includes header with navigation and footer.
 */

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createSupabaseClient()

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
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              IA Poster Shop
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Accueil
              </Link>
              <Link href="/customize" className="text-gray-700 hover:text-primary-600 transition-colors">
                Créer un poster
              </Link>
              
              {loading ? (
                <span className="text-gray-400">Chargement...</span>
              ) : user ? (
                <>
                  <Link href="/account" className="text-gray-700 hover:text-primary-600 transition-colors">
                    Mon compte
                  </Link>
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
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">IA Poster Shop</h3>
              <p className="text-gray-400">
                Créez vos posters personnalisés en style croquis à partir de vos photos.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/customize" className="hover:text-white transition-colors">
                    Créer un poster
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-white transition-colors">
                    Mon compte
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Pour toute question, contactez-nous à support@iapostershop.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} IA Poster Shop. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
