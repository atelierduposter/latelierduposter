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
}

interface CartContextType {
  items: CartItem[]
  addItem: (customization: PosterCustomization, price: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'monpetitposter_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (customization: PosterCustomization, price: number) => {
    const newItem: CartItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customization,
      price,
      addedAt: Date.now(),
    }
    setItems((prevItems) => [...prevItems, newItem])
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0)
  }

  const getItemCount = () => {
    return items.length
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
