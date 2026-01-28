# Database Schema Update - "Første Syn Gratis" Model

Kør dette SQL i din Supabase SQL Editor for at tilføje betalingsfunktionalitet:

```sql
-- Tilføj is_paid kolonne til inspections tabel
ALTER TABLE inspections 
ADD COLUMN is_paid BOOLEAN DEFAULT false;

-- Opdater alle eksisterende inspections til is_paid = true (valgfrit, hvis du vil give eksisterende brugere gratis adgang)
-- UPDATE inspections SET is_paid = true;

-- Tilføj payment_intent_id for at tracke Stripe betalinger
ALTER TABLE inspections 
ADD COLUMN payment_intent_id TEXT;

-- Index for hurtigere søgning
CREATE INDEX idx_inspections_landlord_paid ON inspections(landlord_id, is_paid);
```

## Stripe Produkt Setup for One-Time Payment

Opret et produkt i Stripe Dashboard (LIVE MODE):

1. Gå til **Products** → **Add Product**
2. **Navn**: PDF Rapport Download
3. **Pris**: 149 DKK
4. **Type**: One-time
5. Kopier **Price ID** (price_xxx)
6. Tilføj til `.env.local` som `NEXT_PUBLIC_STRIPE_PRICE_PDF_DOWNLOAD`
