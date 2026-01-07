/**
 * Poster Customizer Component
 * 
 * Main component for customizing posters.
 * Includes image selection (gallery or upload), text customization, and font selection.
 */

'use client'

import { useState, useEffect } from 'react'
import ImageGallery from '@/components/image/ImageGallery'
import ImageUpload from '@/components/image/ImageUpload'
import { createSupabaseClient } from '@/lib/supabase/client'

interface PosterCustomizerProps {
  onCustomizationComplete: (customization: PosterCustomization) => void
}

export interface PosterCustomization {
  imageUrl: string
  textContent?: string
  fontFamily: string
  isGalleryImage: boolean
}

// Available fonts for customization
const AVAILABLE_FONTS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Palatino', label: 'Palatino' },
]

export default function PosterCustomizer({ onCustomizationComplete }: PosterCustomizerProps) {
  const [imageSource, setImageSource] = useState<'gallery' | 'upload'>('gallery')
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('')
  const [textContent, setTextContent] = useState('')
  const [fontFamily, setFontFamily] = useState('Arial')
  const [userId, setUserId] = useState<string>('')
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Get current user ID for uploads
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase])

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl)
    updateCustomization(imageUrl, textContent, fontFamily)
  }

  const handleUploadComplete = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl)
    updateCustomization(imageUrl, textContent, fontFamily)
  }

  const handleTextChange = (text: string) => {
    setTextContent(text)
    updateCustomization(selectedImageUrl, text, fontFamily)
  }

  const handleFontChange = (font: string) => {
    setFontFamily(font)
    updateCustomization(selectedImageUrl, textContent, font)
  }

  const updateCustomization = (imageUrl: string, text: string, font: string) => {
    if (!imageUrl) return

    onCustomizationComplete({
      imageUrl,
      textContent: text || undefined,
      fontFamily: font,
      isGalleryImage: imageSource === 'gallery',
    })
  }

  return (
    <div className="space-y-8">
      {/* Image Source Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">1. Choisir une image</h3>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => {
              setImageSource('gallery')
              setSelectedImageUrl('')
            }}
            className={`btn ${
              imageSource === 'gallery' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Galerie
          </button>
          <button
            onClick={() => {
              setImageSource('upload')
              setSelectedImageUrl('')
            }}
            className={`btn ${
              imageSource === 'upload' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Uploader ma photo
          </button>
        </div>

        {/* Gallery or Upload */}
        {imageSource === 'gallery' ? (
          <ImageGallery
            onSelectImage={handleImageSelect}
            selectedImageUrl={selectedImageUrl}
          />
        ) : (
          <div>
            {userId ? (
              <ImageUpload
                onUploadComplete={handleUploadComplete}
                userId={userId}
              />
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Vous devez être connecté pour uploader une image
                </p>
                <a href="/auth/login" className="btn btn-primary">
                  Se connecter
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Text Customization */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">2. Personnaliser le texte (optionnel)</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="textContent" className="block text-sm font-medium text-gray-700 mb-2">
              Texte à ajouter
            </label>
            <textarea
              id="textContent"
              value={textContent}
              onChange={(e) => handleTextChange(e.target.value)}
              className="input min-h-[100px]"
              placeholder="Entrez votre texte personnalisé..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {textContent.length}/200 caractères
            </p>
          </div>

          <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-2">
              Police de caractères
            </label>
            <select
              id="fontFamily"
              value={fontFamily}
              onChange={(e) => handleFontChange(e.target.value)}
              className="input"
              style={{ fontFamily }}
            >
              {AVAILABLE_FONTS.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
