/**
 * Products Data
 * 
 * Shared product definitions for use across components.
 */

export interface Product {
  id: string
  title: string
  format: 'A4' | 'A3' | 'A5'
  imageUrl: string
  hoverImageUrl?: string
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Les saintes',
    format: 'A3',
    imageUrl: '/images/poster_reel_les_saintes_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_les_saintes.jpg',
  },
  {
    id: '2',
    title: 'Calvi',
    format: 'A3',
    imageUrl: '/images/poster_reel_calvi_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_calvi.jpg',
  },
  {
    id: '3',
    title: 'Saint-Malo',
    format: 'A3',
    imageUrl: '/images/poster_reel_saint_malo_flat_design.png',
    hoverImageUrl: '/images/poster_reel_saint_malo.jpg',
  },
  {
    id: '4',
    title: 'Puy de Sancy',
    format: 'A3',
    imageUrl: '/images/poster_reel_sancy_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_sancy.jpg',
  },
  {
    id: '5',
    title: 'Les Calanques',
    format: 'A3',
    imageUrl: '/images/poster_reel_calanques_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_calanquesjpg.jpg',
  },
  {
    id: '6',
    title: 'Annecy',
    format: 'A3',
    imageUrl: '/images/poster_reel_annecy_flat_design.jpg',
    hoverImageUrl: '/images/poster_reel_annecy.jpg',
  },
]

/**
 * Get a product by ID
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(product => product.id === id)
}
