/**
 * Order Card Component
 * 
 * Displays a single order with its status, image, and details.
 * Shows order status badge and allows viewing order details.
 */

import { Order, OrderStatus } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

interface OrderCardProps {
  order: Order
}

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

export default function OrderCard({ order }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Order Image */}
        <div className="flex-shrink-0">
          <div className="w-full md:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={order.image_url}
              alt="Order preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">Commande #{order.id.slice(0, 8)}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Date de commande : {formatDate(order.created_at)}
              </p>

              {order.text_content && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Texte :</span> {order.text_content}
                </p>
              )}

              {order.font_family && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Police :</span> {order.font_family}
                </p>
              )}

              <p className="text-lg font-semibold text-primary-600">
                {order.total_amount.toFixed(2)} €
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href={`/orders/${order.id}`}
                className="btn btn-primary text-center"
              >
                Voir les détails
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
