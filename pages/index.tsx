/**
 * Home Page - Under Construction
 * 
 * Displays a "coming soon" message.
 * The actual site is accessible at /poc
 */

import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Mon Petit Poster - Site en construction</title>
        <meta
          name="description"
          content="Mon Petit Poster - Site en construction"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary to-primary-100 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-700 mb-4">
              Mon Petit Poster
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 mb-8">
            <div className="mb-6">
              <svg 
                className="w-24 h-24 mx-auto text-primary-600 mb-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-4">
              Site en construction
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Nous travaillons actuellement sur notre nouveau site web.
              <br />
              Revenez bientôt pour découvrir nos magnifiques posters personnalisés !
            </p>
          </div>
          
          <div className="text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Mon Petit Poster. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </>
  )
}
