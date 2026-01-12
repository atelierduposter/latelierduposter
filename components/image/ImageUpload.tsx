/**
 * Image Upload Component
 * 
 * Handles image file uploads using Supabase Storage.
 * Validates file types and sizes before upload.
 * Uploads to the 'uploaded-images' bucket.
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { createSupabaseClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  onUploadComplete: (imageUrl: string, previewUrl?: string) => void
  userId: string // Can be temporary ID for non-authenticated users
  initialImageUrl?: string // Pre-selected image URL (e.g., from product selection)
}

export default function ImageUpload({ onUploadComplete, userId, initialImageUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null)
  const supabase = createSupabaseClient()

  // Handle initial image URL
  useEffect(() => {
    if (initialImageUrl && initialImageUrl !== preview) {
      setPreview(initialImageUrl)
      // Call onUploadComplete with the initial image
      onUploadComplete(initialImageUrl, initialImageUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImageUrl])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setError(null)
      setUploading(true)

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image valide')
        setUploading(false)
        return
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setError('L\'image est trop volumineuse. Taille maximale : 10MB')
        setUploading(false)
        return
      }

      // Create preview (data URL for local display) - wait for it to be ready
      const previewDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          setPreview(result)
          resolve(result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        const isAuthenticated = !!user && !userId.startsWith('temp_')

        let imageUrl = ''

        if (isAuthenticated && user) {
          // User is authenticated - upload to Supabase Storage
          const fileExt = file.name.split('.').pop()
          const fileName = `${user.id}-${Date.now()}.${fileExt}`
          const filePath = `${fileName}`

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('uploaded-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            })

          if (uploadError) throw uploadError

          // Get public URL (or signed URL if bucket is private)
          try {
            const { data: publicData } = supabase.storage
              .from('uploaded-images')
              .getPublicUrl(filePath)
            imageUrl = publicData.publicUrl
          } catch (e) {
            // If public URL fails, try to get signed URL
            const { data: signedData, error: signedError } = await supabase.storage
              .from('uploaded-images')
              .createSignedUrl(filePath, 3600) // 1 hour expiry
            
            if (signedError) throw signedError
            imageUrl = signedData.signedUrl
          }
        } else {
          // User is not authenticated - use base64 data URL as temporary storage
          // The image will be uploaded after user signs up/logs in
          imageUrl = previewDataUrl
        }

        // Pass both URLs
        onUploadComplete(imageUrl, previewDataUrl)
      } catch (error: any) {
        console.error('Upload error:', error)
        setError(error.message || 'Erreur lors du téléchargement de l\'image')
        setPreview(null)
      } finally {
        setUploading(false)
      }
    },
    [userId, supabase, onUploadComplete]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
            {!uploading && (
              <p className="text-sm text-gray-600">
                Cliquez pour sélectionner une autre image
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 text-gray-400">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              {isDragActive ? (
                <p className="text-primary-600 font-medium">
                  Déposez l'image ici...
                </p>
              ) : (
                <>
                  <p className="text-gray-700 font-medium">
                    Cliquez pour sélectionner une image ou glissez-déposez
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, JPEG jusqu'à 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-600">Téléchargement en cours...</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
