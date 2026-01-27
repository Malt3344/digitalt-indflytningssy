# Digitalt Indflytningssyn - Setup Guide

A professional PWA for conducting legally compliant move-in inspections in Denmark.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `SUPABASE_SCHEMA.md`
3. Get your API credentials from Settings > API
4. Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📱 PWA Setup

The app is configured as a Progressive Web App. To install on mobile:

1. Open the app in your mobile browser
2. Tap "Add to Home Screen" (iOS Safari) or "Install" (Android Chrome)
3. The app will work offline and feel like a native app

## 🏗️ Project Structure

```
digitalt-indflytningssyn/
├── app/                          # Next.js 14 App Router
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── inspection/              # Inspection flow
│   │   └── new/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── BasicInfo.tsx            # Step 1: Basic information
│   ├── RoomInspection.tsx       # Step 2: Room-by-room
│   ├── PhotoUpload.tsx          # Step 3: Photo uploads
│   └── Signature.tsx            # Step 4: Digital signatures
├── lib/                         # Utilities
│   ├── supabase.ts             # Supabase client
│   ├── types.ts                # TypeScript types
│   └── pdf-generator.ts        # PDF export logic
├── public/                      # Static assets
│   └── manifest.json           # PWA manifest
└── SUPABASE_SCHEMA.md          # Database setup
```

## 🔑 Key Features

### Multi-Step Form
- **Step 1**: Basic info (tenant name, address, date)
- **Step 2**: Room-by-room inspection with condition ratings
- **Step 3**: Photo upload with Supabase Storage
- **Step 4**: Digital signatures for landlord and tenant

### Database (Supabase)
- `inspections`: Main inspection records
- `rooms`: Individual room assessments
- `photos`: Uploaded images
- Row Level Security (RLS) enabled

### PDF Generation
- Professional PDF reports with jsPDF
- Includes all inspection data and signatures
- Automatic filename generation

### Authentication
- Email/password with Supabase Auth
- Protected routes
- User-specific data

## 🎨 Design

- Built with Tailwind CSS
- Mobile-first responsive design
- Lucide React icons
- Clean Danish UI language
- Premium/professional aesthetic

## 📄 Database Schema

See `SUPABASE_SCHEMA.md` for complete SQL setup instructions.

## 🔒 Security

- Row Level Security (RLS) policies
- User authentication required
- Secure file uploads
- Environment variables for secrets

## 🛠️ Technologies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **PDF**: jsPDF
- **Icons**: Lucide React
- **Signatures**: signature_pad
- **Language**: TypeScript

## 📝 Usage Flow

1. User signs up/logs in
2. Creates new inspection
3. Fills in basic information
4. Inspects each room (condition + description)
5. Uploads photos for documentation
6. Both parties sign digitally
7. Downloads PDF report

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Other Platforms

Build the project:
```bash
npm run build
npm start
```

## 🌐 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📱 Icons for PWA

You'll need to create these icons in the `public` folder:
- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)
- `favicon.ico`

You can use tools like [Favicon Generator](https://realfavicongenerator.net/) to create these.

## 🤝 For Student Developers

This codebase is designed to be:
- **Modular**: Each component has a single responsibility
- **Type-safe**: Full TypeScript coverage
- **Well-commented**: Clear variable and function names
- **Extendable**: Easy to add new features

### Common Extensions
- Add inspection list/history page
- Export to other formats (Word, Excel)
- Email delivery of reports
- Template system for common issues
- Multi-language support
- Damage cost estimation

## 📞 Support

For Supabase issues: [supabase.com/docs](https://supabase.com/docs)
For Next.js help: [nextjs.org/docs](https://nextjs.org/docs)

## 📜 License

This project is for educational and commercial use.

---

Built with ❤️ for Danish landlords
