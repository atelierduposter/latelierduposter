/**
 * Poster Customizer Component
 * 
 * Main component for customizing posters.
 * Includes image selection (gallery or upload), text customization, and font selection.
 */

'use client'

import { useState, useEffect } from 'react'
import ImageUpload from '@/components/image/ImageUpload'
import { createSupabaseClient } from '@/lib/supabase/client'
import { calculatePrice, formatPrice, type PosterFormat, FRAME_ADDITION } from '@/lib/pricing'

interface PosterCustomizerProps {
  onCustomizationComplete: (customization: PosterCustomization) => void
  initialImageUrl?: string // Pre-selected image URL (e.g., from product selection)
  initialFormat?: PosterFormat // Pre-selected format
}

export interface PosterCustomization {
  imageUrl: string
  previewUrl?: string // Local preview (data URL) for cart display
  textContent?: string
  fontFamily: string
  isGalleryImage: boolean
  format: PosterFormat
  hasFrame: boolean
  price: number
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

export default function PosterCustomizer({ onCustomizationComplete, initialImageUrl, initialFormat }: PosterCustomizerProps) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(initialImageUrl || '')
  const [textContent, setTextContent] = useState('')
  const [fontFamily, setFontFamily] = useState('Arial')
  const [format, setFormat] = useState<PosterFormat>(initialFormat || 'A3')
  const [hasFrame, setHasFrame] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const supabase = createSupabaseClient()

  // Initialize customization if initial image is provided
  useEffect(() => {
    if (initialImageUrl && initialImageUrl !== selectedImageUrl) {
      const effectiveFormat = initialFormat || format
      setSelectedImageUrl(initialImageUrl)
      // Calculate price based on current options
      const price = calculatePrice({
        format: effectiveFormat,
        hasText: !!textContent,
        hasFrame,
      })
      onCustomizationComplete({
        imageUrl: initialImageUrl,
        previewUrl: initialImageUrl,
        textContent: textContent || undefined,
        fontFamily,
        isGalleryImage: false,
        format: effectiveFormat,
        hasFrame,
        price,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImageUrl, initialFormat])

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

  const handleUploadComplete = async (imageUrl: string, previewUrl?: string) => {
    setSelectedImageUrl(imageUrl)
    // Wait a bit to ensure previewUrl is ready
    await new Promise(resolve => setTimeout(resolve, 100))
    updateCustomization(imageUrl, previewUrl, textContent, fontFamily)
  }

  const handleTextChange = (text: string) => {
    setTextContent(text)
    // Get preview URL from current state if it exists
    const currentPreview = selectedImageUrl && !selectedImageUrl.startsWith('http') ? selectedImageUrl : undefined
    updateCustomization(selectedImageUrl, currentPreview, text, fontFamily)
  }

  const handleFontChange = (font: string) => {
    setFontFamily(font)
    // Get preview URL from current state if it exists
    const currentPreview = selectedImageUrl && !selectedImageUrl.startsWith('http') ? selectedImageUrl : undefined
    updateCustomization(selectedImageUrl, currentPreview, textContent, font)
  }

  const updateCustomization = (imageUrl: string, previewUrl: string | undefined, text: string, font: string) => {
    if (!imageUrl) return

    // Calculate price based on current options
    const price = calculatePrice({
      format,
      hasText: !!text,
      hasFrame,
    })

    onCustomizationComplete({
      imageUrl,
      previewUrl,
      textContent: text || undefined,
      fontFamily: font,
      isGalleryImage: false,
      format,
      hasFrame,
      price,
    })
  }

  return (
    <div className="space-y-8">
      {/* Image Upload */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">1. Choisir une image</h3>
        
        <ImageUpload
          onUploadComplete={handleUploadComplete}
          userId={userId || `temp_${Date.now()}`}
          initialImageUrl={initialImageUrl}
        />
      </div>

      {/* Format Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">2. Choisir le format</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['A5', 'A4', 'A3'] as PosterFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => {
                setFormat(fmt)
                // Trigger price update
                const currentPreview = selectedImageUrl && !selectedImageUrl.startsWith('http') ? selectedImageUrl : undefined
                updateCustomization(selectedImageUrl, currentPreview, textContent, fontFamily)
              }}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                format === fmt
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="font-bold text-lg mb-1">{fmt}</div>
              {fmt === 'A3' && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  Best seller
                </span>
              )}
              <div className="text-sm text-gray-600 mt-2">
                {formatPrice(calculatePrice({ format: fmt, hasText: !!textContent, hasFrame }))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Text Customization */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">3. Personnaliser le texte (optionnel)</h3>
        
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
            {!textContent && (
              <p className="text-xs text-primary-600 mt-1">
                💡 Avec texte : +2 €
              </p>
            )}
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

      {/* Frame Option */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">4. Option cadre</h3>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasFrame}
              onChange={(e) => {
                setHasFrame(e.target.checked)
                // Trigger price update
                const currentPreview = selectedImageUrl && !selectedImageUrl.startsWith('http') ? selectedImageUrl : undefined
                updateCustomization(selectedImageUrl, currentPreview, textContent, fontFamily)
              }}
              className="w-5 h-5 text-primary-600 rounded"
            />
            <div>
              <span className="font-medium">Avec cadre</span>
              <p className="text-sm text-gray-600">
                +{formatPrice(FRAME_ADDITION)} - Protection et présentation premium
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Price Summary */}
      {selectedImageUrl && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Prix total</p>
              <p className="text-3xl font-bold text-primary-600">
                {formatPrice(calculatePrice({ format, hasText: !!textContent, hasFrame }))}
              </p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Format : {format}</p>
              <p>Texte : {textContent ? 'Oui (+2 €)' : 'Non'}</p>
              <p>Cadre : {hasFrame ? 'Oui (+14 €)' : 'Non'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
