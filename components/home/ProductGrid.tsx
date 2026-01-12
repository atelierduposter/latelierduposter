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
import { calculatePrice, formatPrice } from '@/lib/pricing'
import { PRODUCTS } from '@/lib/products'

export default function ProductGrid() {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null)
  const [tappedProductId, setTappedProductId] = useState<string | null>(null)

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-700 mb-4">
          Nos posters populaires
        </h2>
        <p className="text-center text-gray-600 mb-4">
          <span className="hidden md:inline">👁️ Passez la souris sur les photos pour voir l'avant/après</span>
          <span className="md:hidden">👁️ Appuyez sur les photos pour voir l'avant/après</span>
        </p>
        <p className="text-center text-sm text-primary-600 mb-12 font-medium">
          Prix de base (format A3, sans texte, sans cadre)
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
                    className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer protected-image group/image"
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
                    {/* Hover indicator */}
                    {product.hoverImageUrl && !showHoverImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover/image:bg-opacity-20 transition-all duration-200 z-10 pointer-events-none">
                        <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full text-sm font-medium text-primary-700 opacity-0 group-hover/image:opacity-100 transition-opacity">
                          👁️ Voir le résultat
                        </div>
                      </div>
                    )}
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
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary-700 mb-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-accent">
                          {formatPrice(calculatePrice({ format: product.format, hasText: false, hasFrame: false }))}
                        </p>
                        <p className="text-xs text-gray-500">Format {product.format}</p>
                      </div>
                    </div>
                    <Link 
                      href={`/customize?product=${product.id}&quick=true`}
                      className="w-full btn btn-primary text-center py-3 min-h-[44px] flex items-center justify-center"
                    >
                      Commander
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
