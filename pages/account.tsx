/**
 * Account Page
 * 
 * Displays user account information and settings.
 */

'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import { createSupabaseClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Mon compte - IA Poster Shop</title>
        <meta name="description" content="Gérez votre compte" />
      </Head>

      <Layout>
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold mb-8">Mon compte</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="text-2xl font-semibold mb-4">Informations du compte</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID utilisateur</dt>
                    <dd className="mt-1 text-gray-900 font-mono text-sm">{user.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Membre depuis</dt>
                    <dd className="mt-1 text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h2 className="text-2xl font-semibold mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/customize" className="btn btn-primary text-center">
                    Créer un nouveau poster
                  </Link>
                  <Link href="/orders" className="btn btn-secondary text-center">
                    Voir mes commandes
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Paramètres</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger w-full"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>

              {/* Help Section */}
              <div className="card bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Besoin d'aide ?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Si vous avez des questions ou besoin d'assistance, contactez notre support.
                </p>
                <a
                  href="mailto:support@iapostershop.com"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Contacter le support →
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
