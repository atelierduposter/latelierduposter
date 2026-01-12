/**
 * Admin Analytics Page
 * 
 * Displays detailed analytics with charts for visits and sales.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import { isAdminAuthenticated, logoutAdmin } from '@/lib/admin/auth'
import { createSupabaseClient } from '@/lib/supabase/client'
import { getUniqueVisitsByMonth } from '@/lib/analytics/tracking'
import Link from 'next/link'
import {
  LineChart,
  Line,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface Order {
  id: string
  total_amount: number
  created_at: string
}

interface MonthlyData {
  month: string
  visits: number
  sales: number
  revenue: number
}

export default function AdminAnalytics() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [visitsData, setVisitsData] = useState<MonthlyData[]>([])
  const [salesData, setSalesData] = useState<MonthlyData[]>([])
  const supabase = createSupabaseClient()

  useEffect(() => {
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
        .order('created_at', { ascending: true })

      if (ordersError) throw ordersError

      // Get visits by month
      const visitsByMonth = getUniqueVisitsByMonth()

      // Process orders by month
      const ordersByMonth: Record<string, { count: number; revenue: number }> = {}
      
      ordersData?.forEach((order: Order) => {
        const month = new Date(order.created_at).toISOString().substring(0, 7) // YYYY-MM
        if (!ordersByMonth[month]) {
          ordersByMonth[month] = { count: 0, revenue: 0 }
        }
        ordersByMonth[month].count++
        ordersByMonth[month].revenue += parseFloat(String(order.total_amount)) || 0
      })

      // Get all months from the last 12 months
      const months: string[] = []
      const now = new Date()
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        months.push(date.toISOString().substring(0, 7))
      }

      // Format data for charts
      const visitsChartData = months.map((month) => ({
        month: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        visits: visitsByMonth[month] || 0,
        sales: 0,
        revenue: 0,
      }))

      const salesChartData = months.map((month) => ({
        month: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        sales: ordersByMonth[month]?.count || 0,
        revenue: Math.round((ordersByMonth[month]?.revenue || 0) * 100) / 100,
      }))

      setVisitsData(visitsChartData)
      setSalesData(salesChartData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading analytics data:', error)
      setLoading(false)
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
        <title>Statistiques - Administration - Mon Petit Poster</title>
      </Head>

      <Layout>
        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Statistiques</h1>
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
                <span className="text-gray-700 font-medium">Statistiques</span>
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

          {/* Visits Chart */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">Historique des visites uniques</h2>
            <p className="text-gray-600 mb-4">
              Nombre de visites uniques par mois (12 derniers mois)
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={visitsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#BBD0CB"
                  strokeWidth={2}
                  name="Visites uniques"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Chart */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Historique des ventes</h2>
            <p className="text-gray-600 mb-4">
              Nombre de ventes et chiffre d'affaires par mois (12 derniers mois)
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" label={{ value: 'Nombre de ventes', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Chiffre d\'affaires (€)', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') {
                      return [`${value.toFixed(2)} €`, 'Chiffre d\'affaires']
                    }
                    return [value, 'Nombre de ventes']
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="sales"
                  fill="#BBD0CB"
                  name="Nombre de ventes"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF6B6B"
                  strokeWidth={2}
                  name="Chiffre d'affaires (€)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Layout>
    </>
  )
}
