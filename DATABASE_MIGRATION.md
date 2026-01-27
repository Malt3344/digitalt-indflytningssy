# Database Migration: Add Meter Readings, Keys, and Locked Status

Run this SQL in your Supabase SQL Editor to update your existing database:

```sql
-- Add new columns to inspections table
ALTER TABLE inspections
ADD COLUMN IF NOT EXISTS el_meter_no TEXT,
ADD COLUMN IF NOT EXISTS el_reading NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS water_reading NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS heat_reading NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS key_count INTEGER,
ADD COLUMN IF NOT EXISTS key_notes TEXT;

-- Update status constraint to include 'locked'
ALTER TABLE inspections 
DROP CONSTRAINT IF EXISTS inspections_status_check;

ALTER TABLE inspections 
ADD CONSTRAINT inspections_status_check 
CHECK (status IN ('draft', 'completed', 'signed', 'locked'));
```

## What's New?

### 1. Meter Readings (Måleraflæsning)
- **el_meter_no**: El-måler nummer
- **el_reading**: El-aflæsning i kWh
- **water_reading**: Vand-aflæsning i m³
- **heat_reading**: Varme-aflæsning i GJ eller MWh

### 2. Keys (Nøgler)
- **key_count**: Antal nøgler udleveret
- **key_notes**: Beskrivelse af nøglerne

### 3. Locked Status
- **locked**: En ny status der forhindrer fremtidige ændringer
- Når en inspektion er låst, kan den ikke redigeres

## After Running This Migration

Your app will now support:
✅ Mandatory meter readings (Lejeloven compliant)
✅ Key handover documentation
✅ Locking inspections to prevent tampering
✅ PDF with embedded photos (not just text)
✅ Multiple notes per room (no duplicate room names)
✅ Professional Danish layout

## Run This First!

Before using the updated app, execute the SQL above in:
**Supabase Dashboard → SQL Editor → New Query → Paste → Run**
