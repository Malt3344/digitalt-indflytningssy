# Push til GitHub og Deploy

## Step 1: Push til GitHub

Efter du har oprettet repository på GitHub, kør:

```bash
# Skift branch navn til 'main' (GitHub standard)
git branch -M main

# Tilføj dit GitHub repository (ERSTAT 'dinbruger' med dit GitHub brugernavn)
git remote add origin https://github.com/dinbruger/digitalt-indflytningssyn.git

# Push koden
git push -u origin main
```

## Step 2: Deploy til Vercel (ANBEFALET)

Vercel er lavet af Next.js teamet - bedst til Next.js apps:

### A. Opret Vercel konto
1. Gå til https://vercel.com/signup
2. Log ind med din GitHub konto

### B. Deploy projektet
1. Klik "Add New..." → "Project"
2. Importer dit `digitalt-indflytningssyn` repository
3. **Vigtigt**: Tilføj environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Din Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Din Supabase anon key
4. Klik "Deploy"

### C. Efter deploy
- Du får en URL som: `https://digitalt-indflytningssyn.vercel.app`
- Hver gang du pusher til GitHub deployes appen automatisk! 🚀

---

## Alternative: Deploy til Netlify

Hvis du foretrækker Netlify:

1. Gå til https://netlify.com
2. Klik "Add new site" → "Import from Git"
3. Vælg dit GitHub repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Tilføj environment variables (samme som ovenfor)
6. Deploy!

---

## Supabase Konfiguration Efter Deploy

Når din app er live, skal du opdatere Supabase:

### Tillad din live URL i Supabase:
1. Gå til Supabase Dashboard
2. Settings → Authentication → URL Configuration
3. Tilføj din Vercel URL til **Redirect URLs**:
   ```
   https://digitalt-indflytningssyn.vercel.app/auth/callback
   ```
4. Tilføj til **Site URL**:
   ```
   https://digitalt-indflytningssyn.vercel.app
   ```

---

## Custom Domain (Valgfrit)

### Hvis du vil have dit eget domæne:

**På Vercel:**
1. Gå til dit projekt → Settings → Domains
2. Tilføj dit domæne (f.eks. `indflytningssyn.dk`)
3. Følg DNS instruktionerne

**Køb domæne:**
- DK Hostmaster (danske .dk domæner)
- Namecheap
- CloudFlare

---

## Tjekliste Efter Deploy ✅

- [ ] App er live på Vercel
- [ ] Environment variables er sat korrekt
- [ ] Supabase redirect URLs opdateret
- [ ] Kan logge ind på live site
- [ ] Kan oprette inspektion
- [ ] PDF genereres korrekt
- [ ] Billeder uploades til Supabase Storage
- [ ] PWA manifest virker (kan tilføjes til homescreen på mobil)

---

## Gratis Ressourcer

- **Vercel**: Gratis for hobby projekter
- **Supabase**: Gratis tier (50,000 monthly active users)
- **GitHub**: Gratis private repositories

---

## Opdatering Efter Første Deploy

Hver gang du laver ændringer:

```bash
git add .
git commit -m "Beskrivelse af ændringer"
git push
```

**Vercel deployer automatisk!** 🎉

---

## Troubleshooting

**Problem**: Build fejler på Vercel
**Løsning**: Tjek at alle dependencies er i `package.json` (kør `npm install` lokalt først)

**Problem**: Database forbindelse fejler
**Løsning**: Tjek at environment variables er sat korrekt i Vercel

**Problem**: Login virker ikke
**Løsning**: Tjek Supabase redirect URLs matcher din live URL

---

## For Dit Datamatiker Projekt

**Dokumentér i din rapport:**
- CI/CD pipeline (GitHub → Vercel auto-deploy)
- Environment variable management
- Database hosting (Supabase)
- PWA deployment
- Custom domain setup (hvis relevant)
