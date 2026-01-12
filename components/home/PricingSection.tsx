/**
 * Pricing Section Component
 * 
 * Displays pricing information with format comparison table.
 */

import { formatPrice, getBasePrice, getAvailableFormats } from '@/lib/pricing'

export default function PricingSection() {
  const formats = getAvailableFormats()
  
  const formatDetails = {
    A4: { dimensions: '21 × 29.7 cm', description: 'Format standard' },
    A3: { dimensions: '29.7 × 42 cm', description: 'Best seller' },
    A2: { dimensions: '42 × 59.4 cm', description: 'Format grand' },
  }

  return (
    <section className="py-16 bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Nos tarifs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Prix de base (sans texte, sans cadre). Options disponibles : avec texte (+2€) ou avec cadre (+14€)
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {formats.map((format) => (
              <div
                key={format}
                className={`card text-center ${
                  format === 'A3' ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                }`}
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-primary-700 mb-2">{format}</h3>
                  {format === 'A3' && (
                    <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      Best seller
                    </span>
                  )}
                  <p className="text-sm text-gray-600 mb-2">{formatDetails[format].dimensions}</p>
                  <p className="text-xs text-gray-500">{formatDetails[format].description}</p>
                </div>
                <div className="text-3xl font-bold text-accent mb-4">
                  {formatPrice(getBasePrice(format))}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>✓ Sans texte</p>
                  <p>✓ Sans cadre</p>
                  <p className="text-primary-600">+ Options disponibles</p>
                </div>
              </div>
            ))}
          </div>

          {/* Options */}
          <div className="card bg-primary-50 border-primary-200">
            <h3 className="text-xl font-semibold text-primary-700 mb-4 text-center">
              Options disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">+2€</div>
                <p className="font-medium text-gray-700 mb-1">Avec texte</p>
                <p className="text-sm text-gray-600">Ajoutez du texte personnalisé pour seulement 2€ de plus</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">+14€</div>
                <p className="font-medium text-gray-700 mb-1">Avec cadre</p>
                <p className="text-sm text-gray-600">Protection et présentation premium avec cadre inclus</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
