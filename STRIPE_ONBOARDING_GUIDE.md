# Stripe Integration & Onboarding - Komplet Vejledning

Dette dokument beskriver den komplette Stripe paywall og onboarding implementering til Digitalt Indflytningssyn.

## 📋 Indholdsfortegnelse

1. [Oversigt](#oversigt)
2. [Database Setup](#database-setup)
3. [Stripe Opsætning](#stripe-opsætning)
4. [Miljøvariabler](#miljøvariabler)
5. [Funktioner](#funktioner)
6. [Brugerflow](#brugerflow)
7. [Test Guide](#test-guide)

## 🎯 Oversigt

Systemet inkluderer:

- ✅ **Stripe Paywall** med 3 abonnementsplaner (Basis, Professionel, Virksomhed)
- ✅ **14 dages gratis prøveperiode**
- ✅ **Komplet onboarding flow** på dansk
- ✅ **Middleware beskyttelse** af routes baseret på abonnementsstatus
- ✅ **Stripe Customer Portal** til abonnementsstyring
- ✅ **Webhook håndtering** for automatisk synkronisering
- ✅ **Månedlig kvote** for Basis-planen (10 inspektioner)
- ✅ **Dashboard** med abonnementsinfo og statistik

## 🗄️ Database Setup

### 1. Kør SQL Schema

Åbn din Supabase SQL Editor og kør følgende:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Enable RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

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

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Trigger to update updated_at on profile changes
CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## 💳 Stripe Opsætning

### 1. Opret Stripe Konto

Gå til [https://dashboard.stripe.com](https://dashboard.stripe.com) og opret en konto.

### 2. Opret Produkter

Gå til **Products** → **Add Product** og opret følgende:

#### Basis Plan
- **Navn**: Basis
- **Pris**: 99 DKK
- **Fakturering**: Månedlig
- **Beskrivelse**: Op til 10 indflytningssyn pr. måned

#### Professionel Plan
- **Navn**: Professionel
- **Pris**: 249 DKK
- **Fakturering**: Månedlig
- **Beskrivelse**: Ubegrænsede indflytningssyn

#### Virksomhed Plan
- **Navn**: Virksomhed
- **Pris**: 499 DKK
- **Fakturering**: Månedlig
- **Beskrivelse**: Ubegrænsede inspektioner + multi-bruger

### 3. Aktiver Prøveperiode

For hvert produkt:
1. Klik på produktet
2. Under **Pricing** → **Free trial**
3. Sæt til **14 days**

### 4. Konfigurer Webhooks

1. Gå til **Developers** → **Webhooks**
2. Klik **Add endpoint**
3. URL: `https://dit-domæne.dk/api/stripe/webhook`
4. Vælg følgende events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Kopier **Signing secret**

### 5. Hent API Keys

Gå til **Developers** → **API keys**:
- Kopier **Publishable key** (pk_test_...)
- Kopier **Secret key** (sk_test_...)

## 🔐 Miljøvariabler

Opret `.env.local` fil:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_BASIC=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_xxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ✨ Funktioner

### Implementerede Sider

1. **`/priser`** - Prisoversigt med tre abonnementsplaner
2. **`/abonnement`** - Administrer abonnement og se statistik
3. **`/abonnement/succes`** - Bekræftelse efter betaling
4. **`/onboarding`** - 6-trins introduktion på dansk

### API Routes

1. **`/api/stripe/create-checkout-session`** - Opret betalingssession
2. **`/api/stripe/create-portal-session`** - Åbn kundeportal
3. **`/api/stripe/webhook`** - Håndter Stripe events

### Middleware

Beskytter routes baseret på:
- Autentificering
- Abonnementsstatus
- Månedlig kvote (Basis-plan)
- Onboarding gennemført

### Navigation

Responsiv navigation med:
- Abonnementsbadge
- Brugerinfo
- Mobile menu
- Advarselsbanner ved manglende abonnement

## 🔄 Brugerflow

### Ny Bruger

1. **Tilmelding** → `/auth/signup`
2. **Vælg Plan** → Automatisk redirect til `/priser`
3. **Stripe Checkout** → 14 dages gratis prøveperiode
4. **Succesbekræftelse** → `/abonnement/succes`
5. **Onboarding** → `/onboarding` (6 trin)
6. **Dashboard** → `/` med fuld adgang

### Eksisterende Bruger

1. **Login** → `/auth/login`
2. **Dashboard** → Direkte adgang hvis onboarding gennemført
3. **Opret Syn** → Hvis aktivt abonnement
4. **Administrer** → `/abonnement` for at ændre plan

### Subscription Status Flow

```
trialing (14 dage) → active → past_due/canceled
                                    ↓
                            Redirect til /priser
```

## 🧪 Test Guide

### Lokalt Test med Stripe CLI

1. Installer Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login:
```bash
stripe login
```

3. Forward webhooks:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Test betalinger med testkort:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`

### Test Scenarios

#### 1. Test Ny Tilmelding
- Opret ny bruger
- Vælg Basis-plan
- Brug testkort `4242 4242 4242 4242`
- Verificer onboarding starter
- Gennemfør alle 6 trin

#### 2. Test Månedlig Kvote (Basis)
- Opret 10 inspektioner
- Forsøg at oprette den 11.
- Verificer redirect til `/priser?reason=limit_reached`

#### 3. Test Plan Upgrade
- Login med bruger på Basis
- Gå til `/abonnement`
- Klik "Administrer abonnement"
- Skift til Professionel i Stripe Portal
- Verificer opdatering i dashboard

#### 4. Test Webhook
```bash
stripe trigger checkout.session.completed
```

## 📊 Planer Oversigt

| Feature | Basis | Professionel | Virksomhed |
|---------|-------|--------------|------------|
| Pris/måned | 99 kr | 249 kr | 499 kr |
| Inspektioner | 10 | Ubegrænsede | Ubegrænsede |
| PDF Export | ✅ | ✅ | ✅ |
| Billedupload | ✅ | ✅ | ✅ |
| Digital signatur | ✅ | ✅ | ✅ |
| Support | Email | Prioriteret | Dedikeret |
| Branding | ❌ | ✅ | ✅ |
| Multi-bruger | ❌ | ❌ | ✅ |
| API adgang | ❌ | ❌ | ✅ |

## 🚀 Deployment

### Før Produktion

1. **Stripe**:
   - Skift fra test mode til live mode
   - Opret nye produkter i live mode
   - Opdater environment variables

2. **Webhook URL**:
   - Opdater til production URL
   - Test webhook signing secret

3. **Environment**:
```env
NEXT_PUBLIC_APP_URL=https://dit-produktions-domæne.dk
```

## 📞 Support

Ved problemer:
1. Check Stripe webhook logs
2. Check Supabase logs
3. Verificer environment variables
4. Test med Stripe CLI

## 🔒 Sikkerhed

- Webhook signature verification aktiveret
- RLS policies på user_profiles
- Service role key kun brugt server-side
- Stripe secret keys aldrig exposed client-side

## 📝 Næste Skridt

- [ ] Test alle flows grundigt
- [ ] Tilpas branding i Stripe Dashboard
- [ ] Opsæt email notifikationer (Stripe)
- [ ] Konfigurer faktura settings
- [ ] Test produktion webhooks
- [ ] Opsæt monitoring og alerts
