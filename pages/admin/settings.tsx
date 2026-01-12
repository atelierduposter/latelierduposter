/**
 * Admin Settings Page
 * 
 * General settings and configuration.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { isAdminAuthenticated, logoutAdmin } from '@/lib/admin/auth'

export default function AdminSettings() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Mon Petit Poster',
    contactEmail: 'contact@monpetitposter.fr',
    posterPrice: '29.99',
  })

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('admin_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [router])

  const handleSave = () => {
    localStorage.setItem('admin_settings', JSON.stringify(settings))
    alert('Paramètres sauvegardés !')
  }

  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Paramètres - Administration - Mon Petit Poster</title>
      </Head>

      <Layout>
        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Paramètres</h1>
              <div className="flex gap-4 mt-4">
                <Link href="/admin" className="text-primary-600 hover:text-primary-700">
                  Dashboard
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700">
                  Commandes
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="/admin/gallery" className="text-primary-600 hover:text-primary-700">
                  Galerie
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="/admin/users" className="text-primary-600 hover:text-primary-700">
                  Utilisateurs
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="/admin/analytics" className="text-primary-600 hover:text-primary-700">
                  Statistiques
                </Link>
                <span className="text-gray-400">|</span>
                <span className="text-gray-700 font-medium">Paramètres</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Déconnexion
            </button>
          </div>

          <div className="card max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Paramètres généraux</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du site
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix par défaut d'un poster (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.posterPrice}
                  onChange={(e) => setSettings({ ...settings, posterPrice: e.target.value })}
                  className="input"
                />
              </div>

              <div className="pt-4 border-t">
                <button onClick={handleSave} className="btn btn-primary">
                  Sauvegarder les paramètres
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
