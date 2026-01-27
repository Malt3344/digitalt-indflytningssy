# 🏠 Digitalt Indflytningssyn - Legally Compliant PWA

A professional, mobile-first Progressive Web App for conducting **legally compliant** move-in inspections (indflytningssyn) in Denmark, built by a Datamatiker student in Aarhus.

**Lejeloven 2026 Compliant** ✅

---

## 🎯 Key Features

### Legally Required Elements
- ✅ **Måleraflæsning** (Meter readings): El, Vand, Varme
- ✅ **Nøgleoversigt** (Keys): Count and description
- ✅ **Rum-for-Rum Inspektion** with condition assessment
- ✅ **Foto Dokumentation** embedded in PDF
- ✅ **Digital Underskrifter** for both parties
- ✅ **Låsning** (Locking) to prevent tampering

### Technical Features
- 📱 Mobile-first design for on-site inspections
- 🔒 Complete & Lock feature (prevents editing)
- 📄 Professional PDF with **embedded photos**
- 🏷️ Each room listed once with multiple notes
- 🎨 Clean Danish UI (Aarhus C tested)
- 🔐 Supabase Auth & Row Level Security

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
Create account at [supabase.com](https://supabase.com)

#### Run Database Schema
1. Go to **SQL Editor**
2. Copy SQL from [SUPABASE_SCHEMA.md](SUPABASE_SCHEMA.md)
3. Run the script

#### Migrate Existing Database (If You Already Had Tables)
1. Copy SQL from [DATABASE_MIGRATION.md](DATABASE_MIGRATION.md)
2. Run in SQL Editor to add new fields

#### Create Storage Bucket
1. Go to **Storage**
2. Create bucket: `inspection-photos`
3. Make it **public** ✓

#### Get Credentials
1. Go to **Settings → API**
2. Copy Project URL and anon key
3. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📋 Inspection Flow (6 Steps)

### Step 1: Grundlæggende Information
- Lejer navn
- Adresse
- Dato

### Step 2: Rum-for-Rum Inspektion
- List each room **once** (e.g., "Køkken")
- Add multiple notes per room
- Condition: Perfekt | Brugsspor | Skal udbedres
- Description for each note

### Step 3: Billeder
- Upload photos per room
- Photos are **embedded in PDF** (not just counted!)

### Step 4: Måleraflæsning ⚡💧🔥
- **El-måler**: Nummer + Aflæsning (kWh)
- **Vandmåler**: Aflæsning (m³)
- **Varmemåler**: Aflæsning (GJ/MWh)
- *Lovpligtigt iht. Lejeloven § 10*

### Step 5: Nøgler 🔑
- Antal nøgler
- Beskrivelse (hoveddør, postkasse, kælder, etc.)

### Step 6: Underskrifter ✍️
- Digital signature for landlord
- Digital signature for tenant
- Tenant name displayed for clarity

---

## 📄 PDF Generation

The PDF now includes:
- ✅ **Embedded photos** (not just text!)
- ✅ Tenant name matches signature
- ✅ Color-coded room conditions
- ✅ Meter readings in highlighted box
- ✅ Keys section
- ✅ Professional Danish layout
- ✅ Lejeloven § 10 compliance notice
- ✅ Page numbers and timestamps

**Technology**: `jspdf` + `html2canvas` for image embedding

---

## 🔐 Complete & Lock Feature

After signing, you can **lock the inspection**:
- Status changes to `locked`
- No further edits allowed
- Prevents tampering
- Ensures legal integrity

---

## 🏗️ Project Structure

```
digitalt-indflytningssyn/
├── app/
│   ├── auth/                    # Login/Signup
│   ├── inspection/new/          # Main inspection flow
│   ├── layout.tsx               # Root layout + PWA meta
│   └── page.tsx                 # Landing page
├── components/
│   ├── BasicInfo.tsx            # Step 1
│   ├── RoomInspection.tsx       # Step 2 (refactored)
│   ├── PhotoUpload.tsx          # Step 3
│   ├── MeterReadings.tsx        # Step 4 (NEW)
│   ├── Keys.tsx                 # Step 5 (NEW)
│   └── Signature.tsx            # Step 6
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── types.ts                # TypeScript types
│   └── pdf-generator.ts        # PDF with embedded photos
├── SUPABASE_SCHEMA.md          # Full database schema
├── DATABASE_MIGRATION.md       # Migration SQL for existing DBs
└── README.md                   # This file
```

---

## 🗄️ Database Schema

### Tables
- **inspections**: Main record with meter readings & keys
- **rooms**: Each note for each room (no duplicates in room_name)
- **photos**: Images linked to room entries

### New Fields in `inspections`
```sql
el_meter_no       TEXT
el_reading        NUMERIC(10, 2)
water_reading     NUMERIC(10, 2)
heat_reading      NUMERIC(10, 2)
key_count         INTEGER
key_notes         TEXT
status            'draft' | 'completed' | 'signed' | 'locked'
```

---

## 💡 For Student Developers

### Why This Architecture?

**Room Logic**: Each room appears once, but can have multiple assessment notes. This prevents duplicates like "Køkken (1)", "Køkken (2)" in the UI/PDF.

**PDF Images**: Uses `html2canvas` to convert images to base64, then embeds them in jsPDF. This is more reliable than URL-based images due to CORS.

**Locking**: Ensures legal compliance by preventing post-signature edits.

### Common Extensions
- [ ] Inspection history/list page
- [ ] Email PDF automatically
- [ ] Damage cost calculator
- [ ] Export to Word/Excel
- [ ] Multi-language support
- [ ] Admin dashboard

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **PDF**: jsPDF + html2canvas
- **Icons**: Lucide React
- **Signatures**: signature_pad

---

## ⚖️ Legal Compliance

This app follows **Lejeloven (Danish Rental Act)** requirements:

✅ **§ 10**: Meter readings at move-in
✅ Documentation of property condition
✅ Signatures from both parties
✅ Immutable record (via locking)
✅ Photo documentation

**Not Legal Advice**: Consult a lawyer for specific cases.

---

## 🐛 Troubleshooting

### Photos not loading in PDF
- Ensure Supabase Storage bucket is **public**
- Check CORS settings in Supabase
- Verify image URLs are accessible

### Cannot save inspection
- Check `.env.local` credentials
- Verify database schema is up to date
- Run [DATABASE_MIGRATION.md](DATABASE_MIGRATION.md) if needed

### Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

---

## 📝 License

Educational and commercial use permitted.

---

## 🙏 Credits

Built by a Datamatiker student in Aarhus, Denmark.
Designed for real-world use by private landlords.

**Tech Stack**: Next.js, Tailwind, Supabase, jsPDF
**Legal Framework**: Lejeloven 2026

---

## 📞 Support

For issues, check:
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [jsPDF Docs](https://github.com/parallax/jsPDF)

---

**Last Updated**: Januar 2026
**Version**: 2.0.0 (Legal Compliance Update)
