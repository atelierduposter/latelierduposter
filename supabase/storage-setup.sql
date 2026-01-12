-- Storage Buckets Setup for Mon Petit Poster
-- Run this SQL in your Supabase SQL editor to create the necessary storage buckets

-- 1. Create uploaded-images bucket (private - users upload their photos here)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploaded-images',
  'uploaded-images',
  false,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760; -- Update existing bucket to 10MB limit

-- 2. Create final-images bucket (private - final transformed images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'final-images',
  'final-images',
  false,
  52428800, -- 50MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create gallery-images bucket (public - gallery images with watermark)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for uploaded-images bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own uploaded images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own uploaded images" ON storage.objects;

-- Users can upload files that start with their user ID
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploaded-images' AND
  (storage.foldername(name))[1] = auth.uid()::text OR
  name LIKE auth.uid()::text || '-%'
);

-- Users can view files that start with their user ID
CREATE POLICY "Users can view their own uploaded images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'uploaded-images' AND
  (
    (storage.foldername(name))[1] = auth.uid()::text OR
    name LIKE auth.uid()::text || '-%'
  )
);

-- Users can delete files that start with their user ID
CREATE POLICY "Users can delete their own uploaded images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploaded-images' AND
  (
    (storage.foldername(name))[1] = auth.uid()::text OR
    name LIKE auth.uid()::text || '-%'
  )
);

-- Storage Policies for final-images bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own final images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload final images" ON storage.objects;

-- Users can view their own final images
CREATE POLICY "Users can view their own final images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'final-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Service role can upload final images (for admin)
CREATE POLICY "Service role can upload final images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'final-images');

-- Storage Policies for gallery-images bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Gallery images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload gallery images" ON storage.objects;

-- Everyone can view gallery images (public bucket)
CREATE POLICY "Gallery images are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- Only service role can upload gallery images
CREATE POLICY "Service role can upload gallery images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'gallery-images');
