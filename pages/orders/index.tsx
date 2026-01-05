/**
 * Orders List Page
 * 
 * Displays all orders for the authenticated user.
 */

import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import OrderList from '@/components/orders/OrderList'

export default function OrdersPage() {
  return (
    <>
      <Head>
        <title>Mes commandes - La fabrique à poster</title>
        <meta name="description" content="Consultez toutes vos commandes" />
      </Head>

      <Layout>
        <div className="container-custom py-12">
          <h1 className="text-4xl font-bold mb-8">Mes commandes</h1>
          <OrderList />
        </div>
      </Layout>
    </>
  )
}
