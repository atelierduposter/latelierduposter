/**
 * Home Page
 * 
 * Landing page for the IA Poster Shop.
 * Displays hero section, features, and call-to-action.
 */

import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>IA Poster Shop - Créez vos posters personnalisés</title>
        <meta
          name="description"
          content="Créez vos posters personnalisés en style croquis à partir de vos photos. Transformez vos souvenirs en œuvres d'art."
        />
      </Head>

      <Layout>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Créez vos posters personnalisés
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Transformez vos photos en magnifiques posters en style croquis.
                Choisissez parmi notre galerie ou uploadez votre propre image.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/customize" className="btn bg-white text-primary-600 hover:bg-gray-100">
                  Créer un poster
                </Link>
                <Link href="/auth/signup" className="btn bg-primary-700 text-white hover:bg-primary-600">
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">
              Comment ça fonctionne ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
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
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Choisissez votre image</h3>
                <p className="text-gray-600">
                  Sélectionnez une image dans notre galerie ou uploadez votre propre photo.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Personnalisez</h3>
                <p className="text-gray-600">
                  Ajoutez du texte personnalisé et choisissez votre police de caractères préférée.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Commandez et recevez</h3>
                <p className="text-gray-600">
                  Passez commande, notre équipe transforme votre image et vous l'envoie par email.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à créer votre poster ?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez nos clients satisfaits et transformez vos photos en œuvres d'art.
            </p>
            <Link href="/customize" className="btn btn-primary text-lg px-8 py-3">
              Commencer maintenant
            </Link>
          </div>
        </section>
      </Layout>
    </>
  )
}
