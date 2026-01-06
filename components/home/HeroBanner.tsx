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
              Créer mon poster personnalisé
            </Link>
          </div>

          {/* Process Image */}
          <div className="relative">
            <div className="rounded-lg shadow-xl overflow-hidden">
              <Image
                src="/images/Process_Poster.png"
                alt="Processus de création de poster"
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
