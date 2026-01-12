/**
 * Customize Page
 * 
 * Main page for customizing posters.
 * Includes image selection, text customization, and order submission.
 */

'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import PosterCustomizer, { PosterCustomization } from '@/components/poster/PosterCustomizer'
import ProgressBar from '@/components/poster/ProgressBar'
import PaymentForm from '@/components/payment/PaymentForm'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useCart } from '@/contexts/CartContext'
import { getProductById } from '@/lib/products'

export default function CustomizePage() {
  const [customization, setCustomization] = useState<PosterCustomization | null>(null)
  const [step, setStep] = useState<'customize' | 'payment' | 'review'>('customize')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedProductImage, setSelectedProductImage] = useState<string | undefined>(undefined)
  const [selectedProductFormat, setSelectedProductFormat] = useState<'A4' | 'A3' | 'A5' | undefined>(undefined)
  const router = useRouter()
  const supabase = createSupabaseClient()
  const { addItem } = useCart()

  useEffect(() => {
    // Check if user is logged in
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Check for city parameter in URL
    if (router.query.city) {
      setSelectedCity(router.query.city as string)
    }

    // Check for product parameter in URL
    if (router.query.product) {
      const productId = router.query.product as string
      const product = getProductById(productId)
      if (product) {
        // Use the flat design image as the initial image
        setSelectedProductImage(product.imageUrl)
        setSelectedProductFormat(product.format)
      }
    }
  }, [supabase, router.query])

  const handleCustomizationComplete = (customization: PosterCustomization) => {
    setCustomization(customization)
  }

  const handleAddToCart = () => {
    if (!customization) {
      alert('Veuillez d\'abord sélectionner une image')
      return
    }

    // Price is already calculated in customization
    addItem(customization, customization.price)
    alert('Poster ajouté au panier !')
    router.push('/cart')
  }

  const handleCreateOrder = async () => {
    if (!customization || !user) return

    try {
      // Create order in database
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          image_url: customization.imageUrl,
          text_content: customization.textContent,
          font_family: customization.fontFamily,
          status: 'pending_transformation',
          total_amount: customization.price,
        })
        .select()
        .single()

      if (error) throw error
      setOrderId(data.id)
      setStep('review')
    } catch (error: any) {
      console.error('Error creating order:', error)
      alert('Erreur lors de la création de la commande: ' + error.message)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string, provider: 'stripe' | 'paypal') => {
    if (!orderId) return

    try {
      // Update order with payment information
      const { error } = await supabase
        .from('orders')
        .update({
          payment_intent_id: paymentIntentId,
          payment_provider: provider,
        })
        .eq('id', orderId)

      if (error) throw error

      // Redirect to orders page
      router.push(`/orders/${orderId}`)
    } catch (error: any) {
      console.error('Error updating order:', error)
      alert('Erreur lors de la mise à jour de la commande: ' + error.message)
    }
  }

  const handlePaymentError = (error: string) => {
    alert('Erreur de paiement: ' + error)
  }

  return (
    <>
      <Head>
        <title>Personnaliser votre poster - Mon Petit Poster</title>
        <meta name="description" content="Créez et personnalisez votre poster" />
      </Head>

      <Layout>
        <div className="container-custom py-12">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`flex items-center ${
                  step === 'customize' ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step === 'customize'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  1
                </div>
                <span className="ml-2 font-medium">Personnalisation</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div
                className={`flex items-center ${
                  step === 'payment' ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step === 'payment'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  2
                </div>
                <span className="ml-2 font-medium">Paiement</span>
              </div>
            </div>
          </div>

          {step === 'customize' && (
            <div className="space-y-8">
              {selectedCity && (
                <div className="bg-artisan-blue-light border border-artisan-blue-soft rounded-lg p-4 mb-6">
                  <p className="text-gray-700">
                    <span className="font-semibold">Ville sélectionnée :</span> {router.query.cityName || selectedCity}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Vous pouvez personnaliser ce poster avec du texte ou choisir une autre image.
                  </p>
                </div>
              )}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Personnalisez votre poster</h1>
                <p className="text-gray-600">
                  Choisissez votre image, ajoutez du texte personnalisé et créez votre œuvre unique.
                </p>
              </div>

              {/* Progress Bar */}
              <ProgressBar
                currentStep={1}
                totalSteps={3}
                steps={['Personnalisation', 'Panier', 'Paiement']}
              />

              <PosterCustomizer 
                onCustomizationComplete={handleCustomizationComplete}
                initialImageUrl={selectedProductImage}
                initialFormat={selectedProductFormat}
              />

              {customization && (
                <div className="card bg-primary-50 border-primary-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-primary-900 mb-1">
                        Prêt à passer commande ?
                      </p>
                      <p className="text-primary-700">
                        Prix total : <span className="font-bold text-2xl">{customization.price.toFixed(2)} €</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Format {customization.format} • {customization.textContent ? 'Avec texte' : 'Sans texte'} • {customization.hasFrame ? 'Avec cadre' : 'Sans cadre'}
                      </p>
                    </div>
                    <button onClick={handleAddToCart} className="btn btn-primary">
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'payment' && customization && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Finaliser votre commande</h1>
                <p className="text-gray-600">
                  Créez votre commande et procédez au paiement.
                </p>
              </div>

              {/* Order Summary */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Récapitulatif de la commande</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={customization.imageUrl}
                        alt="Order preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">Poster personnalisé</p>
                      {customization.textContent && (
                        <p className="text-sm text-gray-600">
                          Texte: {customization.textContent}
                        </p>
                      )}
                      {customization.fontFamily && (
                        <p className="text-sm text-gray-600">
                          Police: {customization.fontFamily}
                        </p>
                      )}
                    </div>
                    <div className="text-lg font-semibold">
                      {customization.price.toFixed(2)} €
                    </div>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {customization.price.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {!orderId ? (
                <div className="text-center">
                  <button onClick={handleCreateOrder} className="btn btn-primary">
                    Créer la commande et payer
                  </button>
                </div>
              ) : (
                <PaymentForm
                  amount={customization.price}
                  orderId={orderId}
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
