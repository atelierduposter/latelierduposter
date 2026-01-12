/**
 * Order Detail Component
 * 
 * Displays detailed information about a specific order.
 * Shows order status, images, customization details, and payment information.
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Order, OrderStatus } from '@/lib/supabase/client'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_transformation: 'En attente de transformation',
  in_progress: 'En cours',
  sent_for_validation: 'Envoyé pour validation',
  validated: 'Validé',
  printing: 'En impression',
  shipped: 'Expédié',
  delivered: 'Livré',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_transformation: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  sent_for_validation: 'bg-purple-100 text-purple-800',
  validated: 'bg-green-100 text-green-800',
  printing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-teal-100 text-teal-800',
  delivered: 'bg-gray-100 text-gray-800',
}

export default function OrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      if (!data) {
        setError('Commande introuvable')
        return
      }

      setOrder(data)
    } catch (error: any) {
      console.error('Error fetching order:', error)
      setError(error.message || 'Erreur lors du chargement de la commande')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Chargement des détails de la commande...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="card">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Commande introuvable'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Commande #{order.id.slice(0, 8)}</h1>
          <p className="text-gray-600">Date de commande : {formatDate(order.created_at)}</p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Image originale</h2>
            <div className="bg-gray-100 rounded-lg overflow-hidden relative protected-image">
              <img
                src={order.image_url}
                alt="Original image"
                className="w-full h-auto protected-image"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              <div className="absolute inset-0 pointer-events-none watermark-overlay" />
            </div>
          </div>

          {order.final_image_url && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Image finale</h2>
              <div className="bg-gray-100 rounded-lg overflow-hidden relative protected-image">
                <img
                  src={order.final_image_url}
                  alt="Final image"
                  className="w-full h-auto protected-image"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
                <div className="absolute inset-0 pointer-events-none watermark-overlay" />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Cette image vous a été envoyée par email pour validation.
              </p>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Détails de la commande</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
                <dd className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </dd>
              </div>

              {order.text_content && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Texte personnalisé</dt>
                  <dd className="mt-1 text-gray-900">{order.text_content}</dd>
                </div>
              )}

              {order.font_family && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Police de caractères</dt>
                  <dd className="mt-1 text-gray-900" style={{ fontFamily: order.font_family }}>
                    {order.font_family}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500">Montant total</dt>
                <dd className="mt-1 text-2xl font-bold text-primary-600">
                  {order.total_amount.toFixed(2)} €
                </dd>
              </div>

              {order.payment_provider && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Moyen de paiement</dt>
                  <dd className="mt-1 text-gray-900 capitalize">{order.payment_provider}</dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500">Dernière mise à jour</dt>
                <dd className="mt-1 text-gray-900">{formatDate(order.updated_at)}</dd>
              </div>
            </dl>
          </div>

          {order.status === 'sent_for_validation' && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">
                Validation requise
              </h3>
              <p className="text-blue-800 text-sm">
                Votre image transformée vous a été envoyée par email. Veuillez la vérifier
                et confirmer si elle vous convient.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
