# Supabase Database Schema

⚠️ **IMPORTANT**: Use the complete database fix script `DATABASE_FIX_COMPLETE.sql` instead of running individual commands below.

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create inspections table
CREATE TABLE inspections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  landlord_id UUID REFERENCES auth.users NOT NULL,
  tenant_name TEXT NOT NULL,
  address TEXT NOT NULL,
  inspection_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'signed', 'locked')),
  landlord_signature TEXT,
  tenant_signature TEXT,
  -- Meter readings
  el_meter_no TEXT,
  el_reading NUMERIC(10, 2),
  water_reading NUMERIC(10, 2),
  heat_reading NUMERIC(10, 2),
  -- Keys
  key_count INTEGER,
  key_notes TEXT,
  -- Payment fields
  is_paid BOOLEAN DEFAULT false,
  payment_intent_id TEXT
);

-- Create user_profiles table with subscription information
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT,
  subscription_tier TEXT CHECK (subscription_tier IN ('basic', 'professional', 'enterprise')),
  subscription_current_period_end TIMESTAMP WITH TIME ZONE,
  inspections_count INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create rooms table
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
  room_name TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('Perfekt', 'Brugsspor', 'Skal udbedres')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create photos table
CREATE TABLE photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('inspection-photos', 'inspection-photos', true);

-- Set up Row Level Security (RLS)
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for inspections
CREATE POLICY "Users can view their own inspections"
  ON inspections FOR SELECT
  USING (auth.uid() = landlord_id);

CREATE POLICY "Users can create their own inspections"
  ON inspections FOR INSERT
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Users can update their own inspections"
  ON inspections FOR UPDATE
  USING (auth.uid() = landlord_id);

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policies for rooms
CREATE POLICY "Users can view rooms of their inspections"
  ON rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE inspections.id = rooms.inspection_id
      AND inspections.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rooms for their inspections"
  ON rooms FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE inspections.id = rooms.inspection_id
      AND inspections.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Users can update rooms of their inspections"
  ON rooms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE inspections.id = rooms.inspection_id
      AND inspections.landlord_id = auth.uid()
    )
  );

-- Policies for photos
CREATE POLICY "Users can view photos of their inspections"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      JOIN inspections ON inspections.id = rooms.inspection_id
      WHERE rooms.id = photos.room_id
      AND inspections.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Users can create photos for their inspections"
  ON photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms
      JOIN inspections ON inspections.id = rooms.inspection_id
      WHERE rooms.id = photos.room_id
      AND inspections.landlord_id = auth.uid()
    )
  );

-- Storage policies
CREATE POLICY "Users can upload inspection photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'inspection-photos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Public access to inspection photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'inspection-photos');
```

## Setup Instructions

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the above SQL
4. Run the script
5. Copy your project URL and anon key from Settings > API
6. Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
