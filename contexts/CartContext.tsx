/**
 * Cart Context
 * 
 * Manages shopping cart state and operations.
 * Stores cart items in localStorage for persistence.
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PosterCustomization } from '@/components/poster/PosterCustomizer'

export interface CartItem {
  id: string
  customization: PosterCustomization
  price: number
  addedAt: number
  // previewUrl is stored separately in memory, not in localStorage
  _previewUrl?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (customization: PosterCustomization, price: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
  getPreviewUrl: (itemId: string) => string | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'monpetitposter_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Store preview URLs separately in memory (not in localStorage to avoid quota issues)
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (storedCart) {
      try {
        const parsedItems = JSON.parse(storedCart)
        // Remove previewUrl from stored items (they're too large for localStorage)
        const cleanedItems = parsedItems.map((item: any) => {
          const { _previewUrl, ...rest } = item
          return rest
        })
        setItems(cleanedItems)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change (without previewUrl)
  useEffect(() => {
    try {
      // Remove previewUrl before saving to avoid quota issues
      const itemsToSave = items.map(({ _previewUrl, ...rest }) => rest)
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itemsToSave))
    } catch (error: any) {
      // If quota exceeded, try to clear old data and retry
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing old cart data')
        try {
          localStorage.removeItem(CART_STORAGE_KEY)
          const itemsToSave = items.map(({ _previewUrl, ...rest }) => rest)
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itemsToSave))
        } catch (retryError) {
          console.error('Error saving cart after cleanup:', retryError)
        }
      } else {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [items])

  const addItem = (customization: PosterCustomization, price: number) => {
    const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Store previewUrl separately in memory if it's a base64 data URL
    if (customization.previewUrl && customization.previewUrl.startsWith('data:')) {
      setPreviewUrls((prev) => ({ ...prev, [itemId]: customization.previewUrl! }))
      // Remove previewUrl from customization before storing
      const { previewUrl, ...customizationWithoutPreview } = customization
      customization = customizationWithoutPreview
    }
    
    const newItem: CartItem = {
      id: itemId,
      customization,
      price,
      addedAt: Date.now(),
    }
    setItems((prevItems) => [...prevItems, newItem])
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    // Also remove previewUrl from memory
    setPreviewUrls((prev) => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }

  const clearCart = () => {
    setItems([])
    setPreviewUrls({})
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0)
  }

  const getItemCount = () => {
    return items.length
  }

  const getPreviewUrl = (itemId: string) => {
    return previewUrls[itemId]
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        getTotalPrice,
        getItemCount,
        getPreviewUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
