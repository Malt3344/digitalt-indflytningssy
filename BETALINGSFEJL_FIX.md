# 🚨 AKUT FIX: Betalingsknap Virker Ikke

## Problem
Betalingsknappen giver fejlene:
- `404 Not Found` på `user_profiles` tabellen  
- `500 Internal Server Error` ved betaling
- "Kunne ikke oprette betalingssession"

## Årsag
Der mangler database tabeller og kolonner der er nødvendige for betalingssystemet.

## ⚡ HURTIG LØSNING

### 1. Gå til Supabase Dashboard
1. Log ind på [supabase.com](https://supabase.com)
2. Vælg dit projekt
3. Gå til **SQL Editor** i venstre menu

### 2. Kør Database Fix Script
1. Åbn filen `DATABASE_FIX_COMPLETE.sql` i dit projekt
2. Kopier **hele** indholdet
3. Indsæt det i Supabase SQL Editor
4. Klik **"Run"**

### 3. Verificer at Alt Virker
Kør denne SQL for at tjekke:
```sql
-- Tjek user_profiles
SELECT 'user_profiles' as tabel, count(*) as rows FROM user_profiles;

-- Tjek inspections har is_paid
SELECT 'inspections_with_payment' as tabel, count(*) as rows FROM inspections WHERE is_paid IS NOT NULL;
```

Du skulle se:
- `user_profiles` tabel med mindst 1 række (din bruger)
- `inspections_with_payment` viser antal inspections med is_paid kolonne

### 4. Test Betalingsknappen
1. Gå til din app
2. Refresh siden (CMD+R / F5)
3. Prøv betalingsknappen igen

## 🔧 Hvad Fixet Gør

✅ **Opretter `user_profiles` tabel** - Løser 404 fejlen  
✅ **Tilføjer `is_paid` kolonne til `inspections`** - Aktiverer betalingslogik  
✅ **Opretter profil for eksisterende brugere** - Sørger for du har data  
✅ **Tilføjer Row Level Security (RLS) policies** - Sikrer korrekte tilladelser  
✅ **Opretter triggers og funktioner** - Automatisk profil oprettelse  

## 🆘 Hvis Det Stadig Ikke Virker

Tjek i browser console (F12) om der stadig er fejl og rapport dem.

## 📍 Teknisk Baggrund
- `user_profiles` tabel bruges til at gemme Stripe customer data
- `is_paid` kolonne på inspections bruges til "første syn gratis" logik
- RLS policies sikrer at brugere kun kan se deres egne data