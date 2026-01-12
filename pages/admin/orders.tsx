/**
 * Admin Orders Management Page
 * 
 * Detailed order management with filters and search.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { isAdminAuthenticated, logoutAdmin } from '@/lib/admin/auth'
import { createSupabaseClient } from '@/lib/supabase/client'
import { OrderStatus } from '@/lib/supabase/client'

interface Order {
  id: string
  user_id: string
  image_url: string
  final_image_url?: string
  text_content?: string
  font_family?: string
  status: OrderStatus
  total_amount: number
  created_at: string
  updated_at: string
  payment_provider?: string
  payment_intent_id?: string
}

export default function AdminOrders() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    loadOrders()
  }, [router])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading orders:', error)
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(term) ||
        order.user_id.toLowerCase().includes(term) ||
        (order.text_content && order.text_content.toLowerCase().includes(term))
      )
    }

    setFilteredOrders(filtered)
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      loadOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error: any) {
      alert('Erreur lors de la mise à jour: ' + error.message)
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }

  const statusLabels: Record<OrderStatus, string> = {
    pending_transformation: 'Commandé',
    in_progress: 'En préparation',
    sent_for_validation: 'En validation',
    validated: 'Validé',
    printing: 'Impression',
    shipped: 'Expédié',
    delivered: 'Livré',
  }

  const statusOptions: OrderStatus[] = [
    'pending_transformation',
    'in_progress',
    'sent_for_validation',
    'validated',
    'printing',
    'shipped',
    'delivered',
  ]

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
        <title>Commandes - Administration - Mon Petit Poster</title>
      </Head>

      <Layout>
        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Gestion des commandes</h1>
              <div className="flex gap-4 mt-4">
                <Link href="/admin" className="text-primary-600 hover:text-primary-700">
                  Dashboard
                </Link>
                <span className="text-gray-400">|</span>
                <span className="text-gray-700 font-medium">Commandes</span>
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
                <Link href="/admin/settings" className="text-primary-600 hover:text-primary-700">
                  Paramètres
                </Link>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Déconnexion
            </button>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ID, utilisateur, texte..."
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrer par statut
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                  className="input"
                >
                  <option value="all">Tous les statuts</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
              </h2>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-gray-500">Aucune commande trouvée</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Montant</th>
                      <th className="text-left py-3 px-4">Statut</th>
                      <th className="text-left py-3 px-4">Paiement</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="py-3 px-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                        <td className="py-3 px-4">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4">{parseFloat(String(order.total_amount)).toFixed(2)} €</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'validated'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'in_progress'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {order.payment_provider ? (
                            <span className="text-sm capitalize">{order.payment_provider}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">Non payé</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedOrder(order)
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

          {/* Order Detail Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Détails de la commande</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">ID Commande</p>
                      <p className="font-mono text-sm">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de création</p>
                      <p>{new Date(selectedOrder.created_at).toLocaleString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as OrderStatus)}
                        className="input mt-1"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Montant</p>
                      <p className="text-lg font-bold">{parseFloat(String(selectedOrder.total_amount)).toFixed(2)} €</p>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Image originale</p>
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={selectedOrder.image_url}
                          alt="Original"
                          className="w-full h-64 object-contain"
                        />
                      </div>
                    </div>
                    {selectedOrder.final_image_url && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Image finale</p>
                        <div className="bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={selectedOrder.final_image_url}
                            alt="Final"
                            className="w-full h-64 object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customization Details */}
                  {(selectedOrder.text_content || selectedOrder.font_family) && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Personnalisation</p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {selectedOrder.text_content && (
                          <p className="mb-2">
                            <span className="font-medium">Texte:</span> {selectedOrder.text_content}
                          </p>
                        )}
                        {selectedOrder.font_family && (
                          <p>
                            <span className="font-medium">Police:</span> {selectedOrder.font_family}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Info */}
                  {selectedOrder.payment_provider && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Paiement</p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="mb-2">
                          <span className="font-medium">Provider:</span> {selectedOrder.payment_provider}
                        </p>
                        {selectedOrder.payment_intent_id && (
                          <p>
                            <span className="font-medium">ID:</span>{' '}
                            <span className="font-mono text-sm">{selectedOrder.payment_intent_id}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
