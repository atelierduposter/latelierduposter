/**
 * Image Gallery Component
 * 
 * Displays a grid of gallery images with watermarks.
 * Prevents right-click and image downloading.
 * Images are low-resolution and watermarked for security.
 */

'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { GalleryImage } from '@/lib/supabase/client'

interface ImageGalleryProps {
  onSelectImage: (imageUrl: string) => void
  selectedImageUrl?: string
}

export default function ImageGallery({ onSelectImage, selectedImageUrl }: ImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  // Disable right-click and image saving
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    return false
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
    return false
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chargement de la galerie...</p>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune image dans la galerie pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
            selectedImageUrl === image.low_res_url
              ? 'border-primary-500 ring-2 ring-primary-200'
              : 'border-gray-200 hover:border-primary-300'
          }`}
          onClick={() => onSelectImage(image.low_res_url)}
          onContextMenu={handleContextMenu}
        >
          {/* Watermarked Image */}
          <div className="watermarked-image gallery-image">
            <img
              src={image.low_res_url}
              alt={image.name}
              className="w-full h-48 object-cover"
              draggable={false}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
            />
          </div>
          
          {/* Overlay with watermark text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          
          {/* Image name */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 pointer-events-none">
            {image.name}
          </div>
          
          {/* Selected indicator */}
          {selectedImageUrl === image.low_res_url && (
            <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1.5">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
