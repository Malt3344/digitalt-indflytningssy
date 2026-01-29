-- =====================================================
-- SAFE DATABASE SCHEMA UPDATE - Only adds missing parts
-- Kør dette i din Supabase SQL Editor for at rette betalingsproblemer
-- =====================================================

-- 1. OPDATER INSPECTIONS TABEL - Tilføj manglende kolonner
-- Tjek og tilføj is_paid kolonne hvis den ikke eksisterer
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inspections' AND column_name = 'is_paid') THEN
        ALTER TABLE inspections ADD COLUMN is_paid BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_paid column to inspections table';
    ELSE
        RAISE NOTICE 'is_paid column already exists in inspections table';
    END IF;
END $$;

-- Tjek og tilføj payment_intent_id kolonne hvis den ikke eksisterer  
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inspections' AND column_name = 'payment_intent_id') THEN
        ALTER TABLE inspections ADD COLUMN payment_intent_id TEXT;
        RAISE NOTICE 'Added payment_intent_id column to inspections table';
    ELSE
        RAISE NOTICE 'payment_intent_id column already exists in inspections table';
    END IF;
END $$;

-- Index for hurtigere søgning
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_inspections_landlord_paid') THEN
        CREATE INDEX idx_inspections_landlord_paid ON inspections(landlord_id, is_paid);
        RAISE NOTICE 'Created index idx_inspections_landlord_paid';
    ELSE
        RAISE NOTICE 'Index idx_inspections_landlord_paid already exists';
    END IF;
END $$;

-- 2. OPRET USER_PROFILES TABEL - Kun hvis den ikke eksisterer
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
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
        RAISE NOTICE 'Created user_profiles table';
    ELSE
        RAISE NOTICE 'user_profiles table already exists';
    END IF;
END $$;

-- 3. ENABLE RLS FOR USER_PROFILES - Kun hvis tabellen blev oprettet
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS for user_profiles';
    END IF;
END $$;

-- 4. CREATE POLICIES FOR USER_PROFILES
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5. FUNCTIONS AND TRIGGERS
-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update inspections_count
CREATE OR REPLACE FUNCTION public.increment_inspections_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET inspections_count = inspections_count + 1
  WHERE id = NEW.landlord_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_inspection_created ON inspections;

-- Trigger to increment count when inspection is created
CREATE TRIGGER on_inspection_created
  AFTER INSERT ON inspections
  FOR EACH ROW EXECUTE FUNCTION public.increment_inspections_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_user_profile_updated ON user_profiles;

-- Trigger to update updated_at on profile changes
CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. CREATE USER_PROFILES FOR EXISTING USERS
-- Indsæt user_profiles for alle eksisterende users der ikke har en profil
INSERT INTO user_profiles (id, email)
SELECT id, email FROM auth.users 
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;

-- 7. OPDATER EXISTING INSPECTIONS (VALGFRIT)
-- Marker alle eksisterende inspections som betalt (første syn gratis model)
-- Uncomment næste linje hvis du vil give eksisterende brugere gratis adgang
-- UPDATE inspections SET is_paid = true WHERE is_paid = false;

-- =====================================================
-- VERIFICATION QUERIES
-- Kør disse for at verificere at alt er oprettet korrekt
-- =====================================================

-- Tjek at user_profiles tabel eksisterer og har data
SELECT 'user_profiles tabel' as tabel, count(*) as antal_rows FROM user_profiles;

-- Tjek at inspections har is_paid kolonne
SELECT 'inspections med is_paid' as tabel, count(*) as antal_rows FROM inspections WHERE is_paid IS NOT NULL;

-- Tjek policies på user_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';