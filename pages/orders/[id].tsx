/**
 * Order Detail Page
 * 
 * Displays detailed information about a specific order.
 */

import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import OrderDetail from '@/components/orders/OrderDetail'
import { useRouter } from 'next/router'

export default function OrderDetailPage() {
  const router = useRouter()
  const { id } = router.query

  if (!id || typeof id !== 'string') {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="card">
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <Head>
        <title>Détails de la commande - Mon Petit Poster</title>
        <meta name="description" content="Détails de votre commande" />
      </Head>

      <Layout>
        <div className="container-custom py-12">
          <OrderDetail orderId={id} />
        </div>
      </Layout>
    </>
  )
}
