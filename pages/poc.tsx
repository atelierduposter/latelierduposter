/**
 * POC Page
 * 
 * Proof of Concept page accessible at /poc
 * Contains the full site content.
 */

import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import HeroBanner from '@/components/home/HeroBanner'
import TestimonialsHero from '@/components/home/TestimonialsHero'
import HowItWorks from '@/components/home/HowItWorks'
import PricingSection from '@/components/home/PricingSection'
import ProductGrid from '@/components/home/ProductGrid'
import GuaranteesSection from '@/components/home/GuaranteesSection'

export default function POCPage() {
  return (
    <>
      <Head>
        <title>Mon Petit Poster - Créez votre poster unique dès 29€ | Livraison rapide</title>
        <meta
          name="description"
          content="Transformez vos photos en magnifiques posters en style flat design. Formats A5/A4/A3, livraison 5-7 jours, Made in France. Plus de 1000 posters créés."
        />
        <meta name="keywords" content="poster personnalisé, flat design, photo en poster, cadeau personnalisé, A5, A4, A3" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Mon Petit Poster - Créez votre poster unique dès 29€" />
        <meta property="og:description" content="Transformez vos photos en magnifiques posters en style flat design. Livraison rapide, qualité premium." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://monpetitposter.fr/poc" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mon Petit Poster - Créez votre poster unique dès 29€" />
        <meta name="twitter:description" content="Transformez vos photos en magnifiques posters en style flat design." />
        
        {/* Structured Data - Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Poster personnalisé en style flat design",
              "description": "Transformez vos photos en magnifiques posters en style flat design. Formats A5, A4, A3 disponibles.",
              "brand": {
                "@type": "Brand",
                "name": "Mon Petit Poster"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "EUR",
                "lowPrice": "29",
                "highPrice": "53",
                "offerCount": "3",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1000"
              }
            })
          }}
        />
      </Head>

      <Layout>
        {/* Hero Banner Section */}
        <HeroBanner />

        {/* Testimonials Hero (Quick social proof) */}
        <TestimonialsHero />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Pricing Section */}
        <PricingSection />

        {/* Product Grid Section */}
        <ProductGrid />

        {/* Guarantees Section */}
        <GuaranteesSection />
      </Layout>
    </>
  )
}
