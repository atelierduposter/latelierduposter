/**
 * Testimonials Component
 * 
 * Displays customer reviews/testimonials with ratings.
 * Shows positive customer feedback about the poster service.
 */

interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  location?: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Marie D.',
    rating: 5,
    comment: 'Superbe qualité ! Mon poster de Paris est magnifique et a été livré rapidement. Je recommande vivement.',
    location: 'Lyon',
  },
  {
    id: '2',
    name: 'Pierre L.',
    rating: 5,
    comment: 'Service impeccable et résultat à la hauteur de mes attentes. Le style flat design est vraiment réussi.',
    location: 'Marseille',
  },
  {
    id: '3',
    name: 'Sophie M.',
    rating: 4,
    comment: 'J\'ai commandé un poster personnalisé avec du texte. Le rendu est parfait et l\'équipe très réactive.',
    location: 'Bordeaux',
  },
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
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
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

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les avis de nos clients satisfaits qui ont créé leurs posters personnalisés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>
              
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.comment}"
              </p>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-primary-700">
                  {testimonial.name}
                </p>
                {testimonial.location && (
                  <p className="text-sm text-gray-500">
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
