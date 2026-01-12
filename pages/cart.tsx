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
import CheckoutSignUpForm from '@/components/auth/CheckoutSignUpForm'
import CheckoutLoginForm from '@/components/auth/CheckoutLoginForm'
import { formatPrice } from '@/lib/pricing'

interface ShippingInfo {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export default function CartPage() {
  const { items, removeItem, clearCart, getTotalPrice, getPreviewUrl } = useCart()
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<'cart' | 'auth' | 'payment'>('cart')
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')
  const [orderIds, setOrderIds] = useState<string[]>([])
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null)
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
    if (items.length === 0) {
      alert('Votre panier est vide')
      return
    }

    // If user is not logged in, show auth form
    if (!user) {
      setStep('auth')
      return
    }

    // If user is logged in but no shipping info, we need to get it
    // For now, proceed to payment (shipping info should be in user metadata)
    await createOrders()
  }

  const createOrders = async () => {
    if (!user) return

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
              // Store format, frame info, and shipping info in shipping_address
              shipping_address: {
                format: (item.customization as any).format || 'A3',
                hasFrame: (item.customization as any).hasFrame || false,
                ...(shippingInfo || user.user_metadata || {}),
              },
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

  const handleSignUpSuccess = async (userId: string, shipping: ShippingInfo) => {
    setShippingInfo(shipping)
    // Refresh user data
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    // Upload any base64 images to Supabase Storage
    await uploadBase64Images(userId)
    
    await createOrders()
  }

  const handleLoginSuccess = async (userId: string) => {
    // Refresh user data
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    // Check if user has shipping info in metadata
    if (user?.user_metadata) {
      const metadata = user.user_metadata
      if (metadata.firstName && metadata.address) {
        setShippingInfo({
          firstName: metadata.firstName,
          lastName: metadata.lastName || '',
          address: metadata.address,
          city: metadata.city || '',
          postalCode: metadata.postalCode || '',
          country: metadata.country || 'France',
          phone: metadata.phone,
        })
      }
    }
    
    // Upload any base64 images to Supabase Storage
    await uploadBase64Images(userId)
    
    await createOrders()
  }

  const uploadBase64Images = async (userId: string) => {
    // Get auth token
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Check each cart item for base64 images
    for (const item of items) {
      // If imageUrl is a base64 data URL, upload it
      if (item.customization.imageUrl && item.customization.imageUrl.startsWith('data:')) {
        try {
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              imageData: item.customization.imageUrl,
              userId: userId,
              fileName: `poster-${item.id}.jpg`,
            }),
          })

          if (response.ok) {
            const { imageUrl } = await response.json()
            // Update the item's imageUrl in the cart
            // Note: This would require updating the cart context
            // For now, the base64 will work for display, and we'll use it in the order
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          // Continue with base64 URL if upload fails
        }
      }
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
                          {(getPreviewUrl(item.id) || item.customization?.imageUrl) ? (
                            <img
                              src={getPreviewUrl(item.id) || item.customization.imageUrl}
                              alt="Poster preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // Try fallback to imageUrl if previewUrl fails
                                const preview = getPreviewUrl(item.id)
                                if (preview && item.customization.imageUrl && e.currentTarget.src !== item.customization.imageUrl) {
                                  e.currentTarget.src = item.customization.imageUrl
                                } else {
                                  console.error('Image load error:', preview || item.customization.imageUrl)
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
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

          {step === 'auth' && (
            <div className="max-w-2xl mx-auto">
              {authMode === 'signup' ? (
                <CheckoutSignUpForm
                  onSuccess={handleSignUpSuccess}
                  onLoginClick={() => setAuthMode('login')}
                />
              ) : (
                <CheckoutLoginForm
                  onSuccess={handleLoginSuccess}
                  onSignUpClick={() => setAuthMode('signup')}
                />
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
                          src={getPreviewUrl(item.id) || item.customization.imageUrl}
                          alt="Order preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Try fallback to imageUrl if previewUrl fails
                            const preview = getPreviewUrl(item.id)
                            if (preview && item.customization.imageUrl && e.currentTarget.src !== item.customization.imageUrl) {
                              e.currentTarget.src = item.customization.imageUrl
                            }
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Poster personnalisé</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Format: {(item.customization as any).format || 'A3'}</p>
                          {item.customization.textContent ? (
                            <p>Texte: {item.customization.textContent}</p>
                          ) : (
                            <p className="text-primary-600">Sans texte</p>
                          )}
                          {item.customization.fontFamily && (
                            <p>Police: {item.customization.fontFamily}</p>
                          )}
                          <p>Cadre: {(item.customization as any).hasFrame ? 'Oui' : 'Non'}</p>
                        </div>
                      </div>
                      <div className="text-lg font-semibold">
                        {formatPrice(item.price)}
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
