/**
 * Testimonials Hero Component
 * 
 * Displays 2-3 key testimonials right after the Hero section.
 */

interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  location?: string
}

const HERO_TESTIMONIALS: Testimonial[] = [
  {
    id: '4',
    name: 'Thomas B.',
    rating: 5,
    comment: 'Excellent rapport qualité-prix. Le poster est arrivé bien emballé et correspond exactement à la commande.',
    location: 'Nice',
  },
  {
    id: '5',
    name: 'Julie R.',
    rating: 5,
    comment: 'Un cadeau parfait ! Mon ami était ravi de recevoir son poster personnalisé. Je recommande sans hésitation.',
    location: 'Toulouse',
  },
  {
    id: '6',
    name: 'Marc F.',
    rating: 5,
    comment: 'Processus simple et résultat magnifique. Le suivi de commande est clair et la livraison rapide.',
    location: 'Strasbourg',
  },
]

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1 justify-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsHero() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-8">
          <p className="text-sm text-primary-600 font-semibold mb-2">ILS NOUS FONT CONFIANCE</p>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700 mb-2">
            Plus de 1000 posters créés
          </h2>
          <p className="text-gray-600">Découvrez ce que nos clients en disent</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {HERO_TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="mb-3">
                <StarRating rating={testimonial.rating} />
              </div>
              
              <p className="text-gray-700 mb-4 italic text-sm">
                "{testimonial.comment}"
              </p>
              
              <div className="border-t border-gray-200 pt-3">
                <p className="font-semibold text-primary-700 text-sm">
                  {testimonial.name}
                </p>
                {testimonial.location && (
                  <p className="text-xs text-gray-500">
                    {testimonial.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
