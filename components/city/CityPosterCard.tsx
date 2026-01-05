/**
 * City Poster Card Component
 * 
 * Displays a city poster that can be ordered directly from the homepage.
 */

import Link from 'next/link'
import Image from 'next/image'

export interface CityPoster {
  id: string
  name: string
  imageUrl: string
  price: number
  description?: string
}

interface CityPosterCardProps {
  city: CityPoster
}

export default function CityPosterCard({ city }: CityPosterCardProps) {
  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-artisan-blue-light">
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-artisan-blue/20 to-transparent z-10" />
        <div className="w-full h-full bg-artisan-blue-light flex items-center justify-center">
          {/* Placeholder pour l'image - à remplacer par une vraie image */}
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🏛️</div>
            <p className="text-artisan-blue-soft text-sm font-medium">{city.name}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{city.name}</h3>
        {city.description && (
          <p className="text-gray-600 text-sm mb-4">{city.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">{city.price.toFixed(2)} €</span>
          <Link
            href={`/customize?city=${encodeURIComponent(city.id)}&cityName=${encodeURIComponent(city.name)}`}
            className="btn bg-primary-500 text-white hover:bg-primary-600 px-6 py-2 rounded-md transition-colors"
          >
            Commander
          </Link>
        </div>
      </div>
    </div>
  )
}
