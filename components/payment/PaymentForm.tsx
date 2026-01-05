/**
 * Payment Form Component
 * 
 * Handles payment processing with Stripe and PayPal integration.
 * This is a placeholder implementation - actual payment processing should be
 * done server-side for PCI-DSS compliance.
 */

'use client'

import { useState } from 'react'

interface PaymentFormProps {
  amount: number
  orderId: string
  onPaymentSuccess: (paymentIntentId: string, provider: 'stripe' | 'paypal') => void
  onPaymentError: (error: string) => void
}

export default function PaymentForm({
  amount,
  orderId,
  onPaymentSuccess,
  onPaymentError,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [processing, setProcessing] = useState(false)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      // TODO: Implement actual payment processing
      // For Stripe, use Stripe Elements and create payment intent server-side
      // For PayPal, use PayPal SDK and create order server-side
      
      // This is a placeholder - actual implementation should:
      // 1. Create payment intent/order on server (API route)
      // 2. Redirect to payment provider or show payment form
      // 3. Handle webhook callbacks for payment confirmation
      // 4. Update order status in database

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, you would:
      // - For Stripe: Use Stripe.js and Elements
      // - For PayPal: Use PayPal SDK
      // - Process payment server-side via API routes
      // - Handle webhooks for payment confirmation

      const mockPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      onPaymentSuccess(mockPaymentIntentId, paymentMethod)
    } catch (error: any) {
      onPaymentError(error.message || 'Erreur lors du paiement')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Paiement</h2>
      
      <div className="mb-6">
        <p className="text-lg font-semibold mb-4">
          Montant total : <span className="text-primary-600">{amount.toFixed(2)} €</span>
        </p>
      </div>

      <form onSubmit={handlePayment} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Méthode de paiement
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('stripe')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === 'stripe'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l-2.541 4.378c-1.003-.526-2.128-1.019-3.994-1.295zM10.046 15.26c-2.157.789-3.34 1.426-3.34 2.409 0 .83.691 1.305 1.899 1.305 2.197 0 4.507-.858 6.09-1.63l2.54 4.38c-1.003.526-2.128 1.02-3.993 1.295zM2 13.396c2.218 0 4.006-1.891 4.006-4.216 0-2.329-1.788-4.218-4.006-4.218L0 4.96l.05 13.436L2 18.4zm17.54-2.534c-1.826 0-3.273 1.088-3.273 2.527 0 1.434 1.442 2.523 3.273 2.523 1.826 0 3.273-1.089 3.273-2.527 0-1.434-1.447-2.523-3.273-2.523z"/>
                </svg>
                <span className="font-medium">Stripe</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === 'paypal'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.174 1.351 1.05 3.3.93 4.717-.023.33-.045.658-.04.96.005.297.017.512.017.535.002.14.005.274.005.404 0 .263 0 .515-.004.737-.013 1.063-.07 1.55-.136 1.725-.21.547-.566.897-1.044 1.056-.274.091-.618.138-1.033.141-.566.005-1.273-.05-1.918-.055l-.07-.005c-.225-.016-.425-.03-.602-.043-1.09-.081-1.82-.135-2.327-.164a34.3 34.3 0 0 0-.34-.016l-.11-.005c-.207-.01-.385-.02-.535-.03l-.12-.005h-.012c-.195 0-.336.008-.428.017-.036.004-.06.007-.074.008l-.023.002c-.08.006-.127.013-.145.016-.044.006-.082.015-.116.028a.423.423 0 0 0-.09.05l-.01.005a.248.248 0 0 0-.042.032c-.064.05-.099.12-.11.2l-.033 1.712-.022.854-.014.623-.002.087v.018l-.004.104v.017c0 .017-.003.028-.007.033l-.003.007-.01.025a.2.2 0 0 1-.07.074l-.01.005a.273.273 0 0 1-.1.03l-.018.002h-.01a.45.45 0 0 1-.077-.008l-.006-.002a.55.55 0 0 1-.08-.02l-.01-.005a.217.217 0 0 1-.06-.033l-.01-.005a.2.2 0 0 1-.07-.074l-.01-.025-.003-.007a.041.041 0 0 1-.007-.033v-.017l-.004-.104v-.018l-.002-.087-.014-.623-.022-.854-.033-1.712c-.011-.08-.046-.15-.11-.2a.248.248 0 0 0-.042-.032l-.01-.005a.423.423 0 0 0-.09-.05c-.034-.013-.072-.022-.116-.028-.018-.003-.065-.01-.145-.016l-.023-.002c-.014-.001-.038-.004-.074-.008-.092-.009-.233-.017-.428-.017h-.012l-.12.005c-.15.01-.328.02-.535.03l-.11.005a34.3 34.3 0 0 0-.34.016c-.507.029-1.237.083-2.327.164-.177.013-.377.027-.602.043l-.07.005c-.645.005-1.352.06-1.918.055-.415-.003-.759-.05-1.033-.141-.478-.159-.834-.509-1.044-1.056-.066-.175-.123-.662-.136-1.725-.004-.222-.004-.474-.004-.737 0-.13-.003-.264-.005-.404 0-.023-.012-.238-.017-.535.005-.302.017-.63.04-.96.12-1.417.244-3.366-.244-4.717C8.036.543 10.044 0 12.614 0h7.46c.524 0 .972.382 1.054.901l2.107 19.696a.641.641 0 0 1-.633.74h-4.606c-.524 0-.972-.382-1.054-.9l-1.127-10.536a.321.321 0 0 0-.317-.278h-.01c-.14 0-.26.093-.3.226l-1.127 10.536c-.082.518-.53.9-1.054.9z"/>
                </svg>
                <span className="font-medium">PayPal</span>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Info Note */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> Cette fonctionnalité est un placeholder. 
            Pour une implémentation complète, intégrez:
          </p>
          <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
            <li>
              <strong>Stripe:</strong> Utilisez Stripe Elements et créez des Payment Intents 
              côté serveur pour la conformité PCI-DSS
            </li>
            <li>
              <strong>PayPal:</strong> Utilisez le SDK PayPal et créez les commandes 
              côté serveur
            </li>
            <li>Implémentez les webhooks pour confirmer les paiements</li>
            <li>Mettez à jour le statut des commandes dans la base de données</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing}
          className="btn btn-primary w-full"
        >
          {processing
            ? 'Traitement du paiement...'
            : `Payer ${amount.toFixed(2)} € avec ${paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'}`}
        </button>
      </form>
    </div>
  )
}
