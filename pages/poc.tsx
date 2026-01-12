/**
 * POC Page
 * 
 * Proof of Concept page accessible at /poc
 * Contains the full site content.
 */

import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import HeroBanner from '@/components/home/HeroBanner'
import ProductGrid from '@/components/home/ProductGrid'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'

export default function POCPage() {
  return (
    <>
      <Head>
        <title>Mon Petit Poster - Créez votre poster unique en quelques clics</title>
        <meta
          name="description"
          content="Transformez vos photos en magnifiques posters en style croquis. Personnalisez avec du texte et choisissez parmi nos designs."
        />
      </Head>

      <Layout>
        {/* Hero Banner Section */}
        <HeroBanner />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Product Grid Section */}
        <ProductGrid />

        {/* Testimonials Section */}
        <Testimonials />
      </Layout>
    </>
  )
}
