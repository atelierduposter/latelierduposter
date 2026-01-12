/**
 * Pricing Calculator
 * 
 * Calculates poster prices based on format, text, and frame options.
 */

export type PosterFormat = 'A4' | 'A3' | 'A5'
export type TextOption = 'with' | 'without'
export type FrameOption = 'with' | 'without'

export interface PricingOptions {
  format: PosterFormat
  hasText: boolean
  hasFrame: boolean
}

// Base prices (without frame, without text)
const BASE_PRICES: Record<PosterFormat, number> = {
  A5: 19, // Format compact
  A4: 29, // Prix de base
  A3: 33, // 35 - 2 (Best seller, avec texte = 35€)
}

// Price adjustments
export const TEXT_ADDITION = 2 // Additional cost when text is added
export const FRAME_ADDITION = 14 // Additional cost for frame

/**
 * Calculate the final price for a poster
 */
export function calculatePrice(options: PricingOptions): number {
  const { format, hasText, hasFrame } = options

  // Start with base price (without text)
  let price = BASE_PRICES[format]

  // Add text cost if text is selected
  if (hasText) {
    price += TEXT_ADDITION
  }

  // Add frame cost if frame is selected
  if (hasFrame) {
    price += FRAME_ADDITION
  }

  return price
}

/**
 * Get base price for a format (without text, without frame)
 */
export function getBasePrice(format: PosterFormat): number {
  return BASE_PRICES[format]
}

/**
 * Get all available formats
 */
export function getAvailableFormats(): PosterFormat[] {
  return ['A5', 'A4', 'A3']
}

/**
 * Format price as string with currency
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)} €`
}
