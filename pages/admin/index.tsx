/**
 * Admin Dashboard
 * 
 * Main admin page with statistics and order management.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { isAdminAuthenticated, logoutAdmin } from '@/lib/admin/auth'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getUniqueVisitsByDay, getUniqueVisitsByMonth } from '@/lib/analytics/tracking'
import { OrderStatus } from '@/lib/supabase/client'

interface Order {
  id: string
  user_id: string
  image_url: string
  text_content?: string
  font_family?: string
  status: OrderStatus
  total_amount: number
  created_at: string
  payment_provider?: string
  user_email?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    uniqueVisitsToday: 0,
    uniqueVisitsThisMonth: 0,
    totalAccounts: 0,
    totalOrders: 0,
    averageCartValue: 0,
  })
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }
    setAuthenticated(true)
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      // Load orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Note: User emails are not directly accessible via RLS
      // In production, you might want to create a view or function
      const ordersWithEmails = (ordersData || []).map((order) => ({
        ...order,
        user_email: 'N/A', // Email not accessible via client-side Supabase
      }))

      setOrders(ordersWithEmails as Order[])

      // Calculate statistics
      const visitsByDay = getUniqueVisitsByDay()
      const visitsByMonth = getUniqueVisitsByMonth()
      const today = new Date().toISOString().split('T')[0]
      const thisMonth = new Date().toISOString().substring(0, 7)

      // Get user count (approximate from orders)
      // In production, create a function or view to get actual user count
      const { data: uniqueUsers } = await supabase
        .from('orders')
        .select('user_id')
      
      const userCount = uniqueUsers ? new Set(uniqueUsers.map((o: any) => o.user_id)).size : 0

      // Calculate order statistics
      const totalOrders = ordersData?.length || 0
      const totalAmount = ordersData?.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0) || 0
      const averageCartValue = totalOrders > 0 ? totalAmount / totalOrders : 0

      setStats({
        uniqueVisitsToday: visitsByDay[today] || 0,
        uniqueVisitsThisMonth: visitsByMonth[thisMonth] || 0,
        totalAccounts: userCount,
        totalOrders,
        averageCartValue,
      })

      setLoading(false)
    } catch (error) {
      console.error('Error loading admin data:', error)
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      // Reload orders
      loadData()
    } catch (error: any) {
      alert('Erreur lors de la mise à jour: ' + error.message)
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

  const statusOptions: OrderStatus[] = ['pending_transformation', 'in_progress', 'shipped', 'delivered']

  const statusLabels: Record<OrderStatus, string> = {
    pending_transformation: 'Commandé',
    in_progress: 'En préparation',
    sent_for_validation: 'En validation',
    validated: 'Validé',
    printing: 'Impression',
    shipped: 'Expédié',
    delivered: 'Livré',
  }

  return (
    <>
      <Head>
        <title>Administration - Mon Petit Poster</title>
      </Head>

      <Layout>
        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Administration</h1>
              <div className="flex gap-4 mt-4">
                <span className="text-gray-700 font-medium">Dashboard</span>
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
                <Link href="/admin/settings" className="text-primary-600 hover:text-primary-700">
                  Paramètres
                </Link>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Déconnexion
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Visites uniques (aujourd'hui)</h3>
              <p className="text-3xl font-bold text-primary-600">{stats.uniqueVisitsToday}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Visites uniques (ce mois)</h3>
              <p className="text-3xl font-bold text-primary-600">{stats.uniqueVisitsThisMonth}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Comptes créés</h3>
              <p className="text-3xl font-bold text-primary-600">{stats.totalAccounts}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Commandes totales</h3>
              <p className="text-3xl font-bold text-primary-600">{stats.totalOrders}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Panier moyen</h3>
              <p className="text-3xl font-bold text-primary-600">{stats.averageCartValue.toFixed(2)} €</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Commandes récentes</h2>
              <Link href="/admin/orders" className="btn btn-secondary text-sm">
                Voir toutes les commandes
              </Link>
            </div>
            
            {orders.length === 0 ? (
              <p className="text-gray-500">Aucune commande</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Montant</th>
                      <th className="text-left py-3 px-4">Statut</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-3 px-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                        <td className="py-3 px-4">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4">{parseFloat(String(order.total_amount)).toFixed(2)} €</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'validated' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/admin/orders#${order.id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm"
                          >
                            Voir détails
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Orders by Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statusOptions.map((status) => {
              const count = orders.filter(o => o.status === status).length
              return (
                <div key={status} className="card">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {statusLabels[status]}
                  </h3>
                  <p className="text-3xl font-bold text-primary-600">{count}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Layout>
    </>
  )
}
