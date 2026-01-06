/**
 * Hero Banner Component
 * 
 * Main banner section with placeholder poster image,
 * text 'Créez votre poster unique en quelques clics',
 * and CTA button 'Créer mon poster'.
 */

import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="relative bg-secondary py-20 md:py-32 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-700 mb-6">
              Créez votre poster unique en quelques clics
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Transformez vos photos en magnifiques posters en style croquis.
              Personnalisez avec du texte et choisissez parmi nos designs.
            </p>
            <Link
              href="/customize"
              className="inline-block btn btn-primary text-lg px-8 py-4 transition-transform duration-200 hover:scale-105"
            >
              Créer mon poster
            </Link>
          </div>

          {/* Image Placeholder */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary-300 to-primary-500 rounded-lg shadow-xl overflow-hidden">
              {/* Placeholder image - replace with actual poster image */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <svg
                    className="w-32 h-32 mx-auto text-white opacity-80 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-white text-lg font-medium">Poster personnalisé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
