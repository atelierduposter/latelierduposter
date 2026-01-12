/**
 * Hero Banner Component
 * 
 * Main banner section with placeholder poster image,
 * text 'Créez votre poster unique en quelques clics',
 * and CTA button 'Créer mon poster personnalisé'.
 */

import Link from 'next/link'
import Image from 'next/image'

export default function HeroBanner() {
  return (
    <section className="relative bg-secondary py-20 md:py-32 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-700 mb-4 md:mb-6">
              Créez votre poster unique en quelques clics
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4">
              <span className="hidden sm:inline">Transformez vos photos en magnifiques posters en style flat design. Personnalisez avec du texte et choisissez parmi nos designs.</span>
              <span className="sm:hidden">Posters personnalisés en style flat design.</span>
            </p>
            <div className="mb-6">
              <p className="text-2xl md:text-3xl font-bold text-primary-600 mb-2">
                À partir de 29€
              </p>
              <p className="text-sm text-gray-500">Format A4 • Livraison rapide • Qualité premium</p>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Livraison 5-7 jours</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-blue-600">Made in France</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link
                href="/customize"
                className="inline-block btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] flex items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                Créer mon poster dès 29€
              </Link>
              <Link
                href="/gallery"
                className="inline-block btn btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] flex items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                Voir la galerie
              </Link>
            </div>
          </div>

          {/* Process Video */}
          <div className="relative group">
            {/* Badge "Vidéo de présentation" */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="text-sm font-semibold">Vidéo de présentation</span>
              </div>
            </div>

            {/* Video Container with enhanced styling */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-3xl">
              {/* Decorative gradient overlay on border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-100 via-transparent to-primary-200 opacity-50 pointer-events-none" />
              
              {/* Video */}
              <div className="relative z-10">
                <video
                  src="/images/BA.mp4"
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-auto object-contain protected-image"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-100 rounded-full opacity-30 blur-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary-200 rounded-full opacity-20 blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
