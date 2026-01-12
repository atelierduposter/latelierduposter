/**
 * Admin Users Management Page
 * 
 * View and manage user accounts.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { isAdminAuthenticated, logoutAdmin } from '@/lib/admin/auth'
import { createSupabaseClient } from '@/lib/supabase/client'

interface UserInfo {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  phone?: string
  createdAt?: string
  orderCount: number
  totalSpent: number
}

export default function AdminUsers() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserInfo[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    loadUsers()
  }, [router])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm])

  const loadUsers = async () => {
    try {
      // Get all orders to extract user information
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Group orders by user_id and extract user info
      const userMap = new Map<string, UserInfo>()

      for (const order of ordersData || []) {
        if (!userMap.has(order.user_id)) {
          const shipping = order.shipping_address || {}
          userMap.set(order.user_id, {
            id: order.user_id,
            firstName: shipping.firstName,
            lastName: shipping.lastName,
            address: shipping.address,
            city: shipping.city,
            postalCode: shipping.postalCode,
            country: shipping.country,
            phone: shipping.phone,
            orderCount: 0,
            totalSpent: 0,
            createdAt: order.created_at,
          })
        }

        const user = userMap.get(order.user_id)!
        user.orderCount += 1
        user.totalSpent += parseFloat(String(order.total_amount)) || 0
      }

      // Try to get email from auth.users (this requires admin access)
      // For now, we'll use a workaround by calling an API route
      const usersArray = Array.from(userMap.values())
      
      // Fetch emails via API route
      try {
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIds: usersArray.map(u => u.id) }),
        })
        
        if (response.ok) {
          const emailsData = await response.json()
          usersArray.forEach(user => {
            if (emailsData[user.id]) {
              user.email = emailsData[user.id].email
              user.createdAt = emailsData[user.id].created_at
            }
          })
        }
      } catch (error) {
        console.error('Error fetching user emails:', error)
      }

      setUsers(usersArray)
      setLoading(false)
    } catch (error) {
      console.error('Error loading users:', error)
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...users]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(user =>
        user.id.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.city?.toLowerCase().includes(term)
      )
    }

    setFilteredUsers(filtered)
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setDeleting(true)
    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la suppression')
      }

      alert('Compte supprimé avec succès')
      setShowDeleteConfirm(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error: any) {
      alert('Erreur lors de la suppression: ' + error.message)
    } finally {
      setDeleting(false)
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
        <title>Utilisateurs - Administration - Mon Petit Poster</title>
      </Head>

      <Layout>
        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Gestion des utilisateurs</h1>
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
                <span className="text-gray-700 font-medium">Utilisateurs</span>
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
            <button onClick={handleLogout} className="btn btn-secondary">
              Déconnexion
            </button>
          </div>

          {/* Search */}
          <div className="card mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher un utilisateur
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID, email, nom, ville..."
                className="input"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
              </h2>
            </div>

            {filteredUsers.length === 0 ? (
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Nom</th>
                      <th className="text-left py-3 px-4">Ville</th>
                      <th className="text-left py-3 px-4">Commandes</th>
                      <th className="text-left py-3 px-4">Total dépensé</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="py-3 px-4">{user.email || 'N/A'}</td>
                        <td className="py-3 px-4">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.firstName || user.lastName || 'N/A'}
                        </td>
                        <td className="py-3 px-4">{user.city || 'N/A'}</td>
                        <td className="py-3 px-4">{user.orderCount}</td>
                        <td className="py-3 px-4">{user.totalSpent.toFixed(2)} €</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedUser(user)
                            }}
                            className="btn btn-secondary text-sm"
                          >
                            Voir détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* User Detail Modal */}
          {selectedUser && !showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Détails de l'utilisateur</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Account Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Informations de compte</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ID Utilisateur</p>
                        <p className="font-mono text-sm">{selectedUser.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{selectedUser.email || 'N/A'}</p>
                      </div>
                      {selectedUser.createdAt && (
                        <div>
                          <p className="text-sm text-gray-500">Date de création</p>
                          <p>{new Date(selectedUser.createdAt).toLocaleString('fr-FR')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {(selectedUser.firstName || selectedUser.address) && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Informations de livraison</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedUser.firstName && (
                          <div>
                            <p className="text-sm text-gray-500">Prénom</p>
                            <p>{selectedUser.firstName}</p>
                          </div>
                        )}
                        {selectedUser.lastName && (
                          <div>
                            <p className="text-sm text-gray-500">Nom</p>
                            <p>{selectedUser.lastName}</p>
                          </div>
                        )}
                        {selectedUser.address && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Adresse</p>
                            <p>{selectedUser.address}</p>
                          </div>
                        )}
                        {selectedUser.city && (
                          <div>
                            <p className="text-sm text-gray-500">Ville</p>
                            <p>{selectedUser.city}</p>
                          </div>
                        )}
                        {selectedUser.postalCode && (
                          <div>
                            <p className="text-sm text-gray-500">Code postal</p>
                            <p>{selectedUser.postalCode}</p>
                          </div>
                        )}
                        {selectedUser.country && (
                          <div>
                            <p className="text-sm text-gray-500">Pays</p>
                            <p>{selectedUser.country}</p>
                          </div>
                        )}
                        {selectedUser.phone && (
                          <div>
                            <p className="text-sm text-gray-500">Téléphone</p>
                            <p>{selectedUser.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nombre de commandes</p>
                        <p className="text-2xl font-bold text-primary-600">{selectedUser.orderCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total dépensé</p>
                        <p className="text-2xl font-bold text-primary-600">{selectedUser.totalSpent.toFixed(2)} €</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-4 flex justify-end gap-4">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="btn btn-secondary"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="btn btn-danger"
                    >
                      Supprimer le compte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Confirmer la suppression</h2>
                  <p className="text-gray-700 mb-6">
                    Êtes-vous sûr de vouloir supprimer le compte de{' '}
                    <strong>{selectedUser.email || selectedUser.firstName || 'cet utilisateur'}</strong> ?
                    <br />
                    <br />
                    Cette action est <strong>irréversible</strong> et supprimera :
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Le compte utilisateur</li>
                      <li>Toutes les commandes associées</li>
                      <li>Toutes les données personnelles</li>
                    </ul>
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn btn-secondary"
                      disabled={deleting}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      className="btn btn-danger"
                      disabled={deleting}
                    >
                      {deleting ? 'Suppression...' : 'Supprimer définitivement'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
