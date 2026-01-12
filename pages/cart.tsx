/**
 * Cart Page
 * 
 * Displays cart items and allows checkout.
 */

'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import PaymentForm from '@/components/payment/PaymentForm'
import { useCart } from '@/contexts/CartContext'
import { createSupabaseClient } from '@/lib/supabase/client'

const POSTER_PRICE = 29.99

export default function CartPage() {
  const { items, removeItem, clearCart, getTotalPrice } = useCart()
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<'cart' | 'payment'>('cart')
  const [orderIds, setOrderIds] = useState<string[]>([])
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/cart')
      return
    }

    if (items.length === 0) {
      alert('Votre panier est vide')
      return
    }

    try {
      // Create orders for each cart item
      const orders = await Promise.all(
        items.map(async (item) => {
          const { data, error } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              image_url: item.customization.imageUrl,
              text_content: item.customization.textContent,
              font_family: item.customization.fontFamily,
              status: 'pending_transformation',
              total_amount: item.price,
            })
            .select()
            .single()

          if (error) throw error
          return data.id
        })
      )

      setOrderIds(orders)
      setStep('payment')
    } catch (error: any) {
      console.error('Error creating orders:', error)
      alert('Erreur lors de la création des commandes: ' + error.message)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string, provider: 'stripe' | 'paypal') => {
    if (orderIds.length === 0) return

    try {
      // Update all orders with payment information
      const { error } = await supabase
        .from('orders')
        .update({
          payment_intent_id: paymentIntentId,
          payment_provider: provider,
        })
        .in('id', orderIds)

      if (error) throw error

      // Clear cart
      clearCart()

      // Redirect to orders page
      router.push('/orders')
    } catch (error: any) {
      console.error('Error updating orders:', error)
      alert('Erreur lors de la mise à jour des commandes: ' + error.message)
    }
  }

  const handlePaymentError = (error: string) => {
    alert('Erreur de paiement: ' + error)
  }

  return (
    <>
      <Head>
        <title>Panier - Mon Petit Poster</title>
        <meta name="description" content="Votre panier d'achat" />
      </Head>

      <Layout>
        <div className="container-custom py-12">
          {step === 'cart' && (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8">Mon panier</h1>

              {items.length === 0 ? (
                <div className="text-center py-16">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="text-xl text-gray-600 mb-4">Votre panier est vide</p>
                  <Link href="/customize" className="btn btn-primary">
                    Créer un poster
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="card flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.customization.imageUrl}
                            alt="Poster preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold mb-2">Poster personnalisé</h3>
                          {item.customization.textContent && (
                            <p className="text-sm text-gray-600 mb-1">
                              Texte: {item.customization.textContent}
                            </p>
                          )}
                          {item.customization.fontFamily && (
                            <p className="text-sm text-gray-600 mb-1">
                              Police: {item.customization.fontFamily}
                            </p>
                          )}
                          <p className="text-lg font-semibold text-primary-600 mt-2">
                            {item.price.toFixed(2)} €
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="btn btn-danger self-start md:self-center"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="card bg-primary-50 border-primary-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {getTotalPrice().toFixed(2)} €
                      </span>
                    </div>
                    <button onClick={handleCheckout} className="btn btn-primary w-full">
                      Procéder au paiement
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'payment' && items.length > 0 && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Finaliser votre commande</h1>
                <p className="text-gray-600">
                  Procédez au paiement pour {items.length} {items.length === 1 ? 'poster' : 'posters'}.
                </p>
              </div>

              {/* Order Summary */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Récapitulatif de la commande</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.customization.imageUrl}
                          alt="Order preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Poster personnalisé</p>
                        {item.customization.textContent && (
                          <p className="text-sm text-gray-600">
                            Texte: {item.customization.textContent}
                          </p>
                        )}
                        {item.customization.fontFamily && (
                          <p className="text-sm text-gray-600">
                            Police: {item.customization.fontFamily}
                          </p>
                        )}
                      </div>
                      <div className="text-lg font-semibold">
                        {item.price.toFixed(2)} €
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {getTotalPrice().toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {orderIds.length > 0 && (
                <PaymentForm
                  amount={getTotalPrice()}
                  orderId={orderIds.join(',')} // Pass all order IDs as comma-separated string
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              )}
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
