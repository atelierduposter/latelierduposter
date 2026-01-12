/**
 * Guarantees Section Component
 * 
 * Displays trust badges and guarantees to reassure customers.
 */

export default function GuaranteesSection() {
  const guarantees = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Livraison rapide',
      description: 'Sous 5-7 jours ouvrés',
      color: 'text-blue-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Paiement sécurisé',
      description: 'CB, PayPal, Stripe',
      color: 'text-green-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Satisfait ou remboursé',
      description: '14 jours pour changer d\'avis',
      color: 'text-yellow-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Qualité premium',
      description: 'Papier épais, finition soignée',
      color: 'text-purple-600',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Nos garanties
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nous nous engageons à vous offrir la meilleure expérience possible
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="card text-center hover:shadow-lg transition-shadow">
              <div className={`${guarantee.color} mb-4 flex justify-center`}>
                {guarantee.icon}
              </div>
              <h3 className="text-lg font-semibold text-primary-700 mb-2">
                {guarantee.title}
              </h3>
              <p className="text-sm text-gray-600">
                {guarantee.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
