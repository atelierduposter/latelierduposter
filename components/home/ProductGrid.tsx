/**
 * Product Grid Component
 * 
 * Displays 6 example posters in a responsive grid.
 * Each product has image, title, price, and hover effects (zoom & shadow).
 * Responsive: 3 columns on desktop, 2 on tablet, 1 on mobile.
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  price: number
  imageUrl: string
  hoverImageUrl?: string
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Les saintes',
    price: 29.99,
    imageUrl: '/images/poster_reel_les_saintes_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_les_saintes.jpg',
  },
  {
    id: '2',
    title: 'Calvi',
    price: 29.99,
    imageUrl: '/images/poster_reel_calvi_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_calvi.jpg',
  },
  {
    id: '3',
    title: 'Saint-Malo',
    price: 29.99,
    imageUrl: '/images/poster_reel_saint_malo_flat_design.png',
    hoverImageUrl: '/images/poster_reel_saint_malo.jpg',
  },
  {
    id: '4',
    title: 'Puy de Sancy',
    price: 29.99,
    imageUrl: '/images/poster_reel_sancy_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_sancy.jpg',
  },
  {
    id: '5',
    title: 'Les Calanques',
    price: 29.99,
    imageUrl: '/images/poster_reel_calanques_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_calanquesjpg.jpg',
  },
  {
    id: '6',
    title: 'Annecy',
    price: 29.99,
    imageUrl: '/images/poster_reel_annecy_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_annecy.jpg',
  },
]

export default function ProductGrid() {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null)
  const [tappedProductId, setTappedProductId] = useState<string | null>(null)

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-700 mb-4">
          Nos posters populaires
        </h2>
        <p className="text-center text-gray-600 mb-12">
          <span className="hidden md:inline">Passez la souris sur les photos pour voir l'avant/après</span>
          <span className="md:hidden">Appuyez sur les photos pour voir l'avant/après</span>
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => {
            const showHoverImage = product.hoverImageUrl && (
              hoveredProductId === product.id || tappedProductId === product.id
            )
            
            return (
              <div 
                key={product.id} 
                className="group"
                onMouseEnter={() => product.hoverImageUrl && setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
                  {/* Product Image */}
                  <div 
                    className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer protected-image"
                    onClick={(e) => {
                      if (product.hoverImageUrl) {
                        e.stopPropagation()
                        setTappedProductId(tappedProductId === product.id ? null : product.id)
                      }
                    }}
                    onTouchStart={(e) => {
                      if (product.hoverImageUrl) {
                        e.stopPropagation()
                        setTappedProductId(tappedProductId === product.id ? null : product.id)
                      }
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className={`w-full h-full object-contain transition-all duration-200 group-hover:scale-110 protected-image ${
                        showHoverImage ? 'opacity-0' : 'opacity-100'
                      }`}
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    {product.hoverImageUrl && (
                      <img
                        src={product.hoverImageUrl}
                        alt={product.title}
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 protected-image ${
                          showHoverImage ? 'opacity-100' : 'opacity-0'
                        }`}
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    )}
                    {/* Watermark overlay */}
                    <div className="absolute inset-0 pointer-events-none watermark-overlay" />
                  </div>
                  
                  {/* Product Info */}
                  <Link href={`/customize?product=${product.id}`}>
                    <div className="p-6 cursor-pointer">
                      <h3 className="text-xl font-semibold text-primary-700 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-2xl font-bold text-accent">
                        {product.price.toFixed(2)} €
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
