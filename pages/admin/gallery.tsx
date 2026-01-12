/**
 * Admin Gallery Management Page
 * 
 * Manage gallery images: add, edit, delete.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { isAdminAuthenticated, logoutAdmin } from '@/lib/admin/auth'
import { createSupabaseClient } from '@/lib/supabase/client'

interface GalleryImage {
  id: string
  name: string
  thumbnail_url: string
  low_res_url: string
  created_at: string
  updated_at: string
}

export default function AdminGallery() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    thumbnail_url: '',
    low_res_url: '',
  })
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    loadImages()
  }, [router])

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading images:', error)
      setLoading(false)
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('gallery_images').insert({
        name: formData.name,
        thumbnail_url: formData.thumbnail_url,
        low_res_url: formData.low_res_url,
      })

      if (error) throw error

      setFormData({ name: '', thumbnail_url: '', low_res_url: '' })
      setShowAddForm(false)
      loadImages()
    } catch (error: any) {
      alert('Erreur lors de l\'ajout: ' + error.message)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return

    try {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id)

      if (error) throw error
      loadImages()
    } catch (error: any) {
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Galerie - Administration - Mon Petit Poster</title>
      </Head>

      <Layout>
        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Gestion de la galerie</h1>
              <div className="flex gap-4 mt-4">
                <Link href="/admin" className="text-primary-600 hover:text-primary-700">
                  Dashboard
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700">
                  Commandes
                </Link>
                <span className="text-gray-400">|</span>
                <span className="text-gray-700 font-medium">Galerie</span>
                <span className="text-gray-400">|</span>
                <Link href="/admin/users" className="text-primary-600 hover:text-primary-700">
                  Utilisateurs
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="/admin/analytics" className="text-primary-600 hover:text-primary-700">
                  Statistiques
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="/admin/settings" className="text-primary-600 hover:text-primary-700">
                  Paramètres
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
                {showAddForm ? 'Annuler' : 'Ajouter une image'}
              </button>
              <button onClick={handleLogout} className="btn btn-secondary">
                Déconnexion
              </button>
            </div>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Ajouter une image à la galerie</h2>
              <form onSubmit={handleAddImage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'image
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la miniature
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL basse résolution (avec watermark)
                  </label>
                  <input
                    type="url"
                    value={formData.low_res_url}
                    onChange={(e) => setFormData({ ...formData, low_res_url: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
              </form>
            </div>
          )}

          {/* Images Grid */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">
              {images.length} image{images.length > 1 ? 's' : ''} dans la galerie
            </h2>

            {images.length === 0 ? (
              <p className="text-gray-500">Aucune image dans la galerie</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 h-48 overflow-hidden">
                      <img
                        src={image.low_res_url}
                        alt={image.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{image.name}</h3>
                      <p className="text-xs text-gray-500 mb-4">
                        Ajouté le {new Date(image.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="btn btn-danger w-full text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}
