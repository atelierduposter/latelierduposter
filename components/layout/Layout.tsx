/**
 * Layout Component
 * 
 * Main layout wrapper for all pages.
 * Uses the new Header and Footer components.
 */

import Header from '@/components/home/Header'
import Footer from '@/components/home/Footer'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  )
}
