-- Database Schema for IA Poster Shop
-- Run this SQL in your Supabase SQL editor to create the necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Gallery Images Table
-- Stores low-resolution, watermarked images for the gallery
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  thumbnail_url TEXT NOT NULL,
  low_res_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
-- Stores all customer orders with status tracking
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- Original uploaded/selected image
  final_image_url TEXT, -- Final transformed image (sent by admin)
  text_content TEXT, -- Custom text added by user
  font_family VARCHAR(100), -- Selected font
  status VARCHAR(50) NOT NULL DEFAULT 'pending_transformation',
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_intent_id VARCHAR(255), -- Stripe payment intent ID
  payment_provider VARCHAR(50), -- 'stripe' or 'paypal'
  shipping_address JSONB, -- Shipping information
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (
    status IN (
      'pending_transformation',
      'in_progress',
      'sent_for_validation',
      'validated',
      'printing',
      'shipped',
      'delivered'
    )
  )
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery_images (public read access)
CREATE POLICY "Gallery images are viewable by everyone"
  ON gallery_images FOR SELECT
  USING (true);

-- RLS Policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_gallery_images_updated_at 
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Storage buckets (to be created via Supabase dashboard or API)
-- Run these via Supabase dashboard > Storage or via SQL:
-- 
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('uploaded-images', 'uploaded-images', false);
-- 
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('final-images', 'final-images', false);
-- 
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('gallery-images', 'gallery-images', true);
