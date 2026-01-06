/**
 * Product Grid Component
 * 
 * Displays 6 example posters in a responsive grid.
 * Each product has image, title, price, and hover effects (zoom & shadow).
 * Responsive: 3 columns on desktop, 2 on tablet, 1 on mobile.
 */

import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  imageUrl: string
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Paris - Tour Eiffel',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Lyon - Vieux Lyon',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Marseille - Vieux-Port',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    title: 'Bordeaux - Place de la Bourse',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1574781330855-d0db8cc4cff6?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    title: 'Nice - Promenade des Anglais',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    title: 'Strasbourg - Cathédrale',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1555993536-48e9134c5c9e?w=400&h=400&fit=crop',
  },
]

export default function ProductGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-700 mb-12">
          Nos posters populaires
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/customize?product=${product.id}`}
              className="group block"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary-700 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-bold text-accent">
                    {product.price.toFixed(2)} €
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
