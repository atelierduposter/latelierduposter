/**
 * Custom App Component
 * 
 * Wraps all pages and provides global styles and configuration.
 */

import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { CartProvider } from '@/contexts/CartContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Prevent right-click on images
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('.protected-image')) {
        e.preventDefault()
        return false
      }
    }

    // Prevent drag and drop of images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('.protected-image')) {
        e.preventDefault()
        return false
      }
    }

    // Prevent image selection
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('.protected-image')) {
        e.preventDefault()
        return false
      }
    }

    // Prevent keyboard shortcuts (Ctrl+S, Ctrl+Shift+I, F12, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }
      // Disable Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }
      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'U') {
        e.preventDefault()
        return false
      }
      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  )
}
