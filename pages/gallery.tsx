/**
 * Gallery Page
 * 
 * Displays a gallery of available poster designs.
 */

import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import ProductGrid from '@/components/home/ProductGrid'

export default function GalleryPage() {
  return (
    <>
      <Head>
        <title>Galerie - Mon Petit Poster</title>
        <meta
          name="description"
          content="Découvrez notre galerie de posters en style croquis. Choisissez parmi nos designs ou personnalisez le vôtre."
        />
      </Head>

      <Layout>
        <section className="py-16 bg-secondary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
                Notre galerie
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Découvrez notre collection de posters en style croquis. 
                Choisissez parmi nos designs ou créez votre propre poster personnalisé.
              </p>
            </div>
            
            <ProductGrid />
          </div>
        </section>
      </Layout>
    </>
  )
}
