# Quick Start Guide - Stripe Paywall & Onboarding

## ⚡ Hurtig Opsætning (15 minutter)

### Trin 1: Database Setup (3 min)

1. Åbn din Supabase dashboard
2. Gå til SQL Editor
3. Kopier og kør scriptet fra `STRIPE_SETUP.md`
4. Verificer at `user_profiles` tabel er oprettet

### Trin 2: Stripe Setup (7 min)

1. **Opret konto**: Gå til [stripe.com/register](https://dashboard.stripe.com/register)

2. **Opret produkter** i Stripe Dashboard → Products:
   
   **Produkt 1: Basis**
   - Pris: 99 DKK/måned
   - Free trial: 14 dage
   
   **Produkt 2: Professionel**
   - Pris: 249 DKK/måned
   - Free trial: 14 dage
   
   **Produkt 3: Virksomhed**
   - Pris: 499 DKK/måned
   - Free trial: 14 dage

3. **Kopier Price IDs** fra hvert produkt (starter med `price_`)

4. **Hent API Keys**: Developers → API keys
   - Publishable key (pk_test_...)
   - Secret key (sk_test_...)

5. **Opsæt Webhook**: Developers → Webhooks → Add endpoint
   - URL: `http://localhost:3000/api/stripe/webhook` (lokalt)
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Kopier Signing secret (whsec_...)

### Trin 3: Environment Setup (2 min)

1. Opret `.env.local` fil i projektets rod
2. Kopier indhold fra `.env.local.example`
3. Udfyld med dine værdier:

```env
# Supabase (fra Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe (fra Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe Price IDs (fra dine produkter)
NEXT_PUBLIC_STRIPE_PRICE_BASIC=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_xxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Trin 4: Test Lokalt (3 min)

```bash
# Start udviklings server
npm run dev

# I ny terminal: Start Stripe webhook listener
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Åbn [http://localhost:3000](http://localhost:3000)

### Trin 5: Test Flow

1. **Opret bruger**: Klik "Kom i gang" → Tilmeld dig
2. **Vælg plan**: Vælg "Basis" planen
3. **Betal**: Brug testkort `4242 4242 4242 4242`
   - Udløb: Fremtidig dato (12/34)
   - CVC: 123
   - ZIP: 12345
4. **Onboarding**: Gennemfør de 6 trin
5. **Dashboard**: Du har nu adgang!

---

## 🎯 Test Checklist

- [ ] Bruger kan tilmelde sig
- [ ] Redirect til /priser efter signup
- [ ] Stripe checkout åbner korrekt
- [ ] Betaling gennemføres (test mode)
- [ ] Redirect til /abonnement/succes
- [ ] Onboarding starter automatisk
- [ ] Navigation viser abonnementsbadge
- [ ] Dashboard viser korrekt data
- [ ] Kan oprette indflytningssyn
- [ ] Basis plan blokerer efter 10 syn

---

## 🔍 Hvor finder jeg hvad?

### Supabase Dashboard
- **URL & Keys**: Settings → API
- **Database**: Database → Tables → user_profiles
- **Auth Users**: Authentication → Users

### Stripe Dashboard
- **Products**: Products
- **Customers**: Customers (efter første betaling)
- **Subscriptions**: Subscriptions
- **API Keys**: Developers → API keys
- **Webhooks**: Developers → Webhooks
- **Test Cards**: [stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## 🚨 Fejlfinding

### "Invalid Price ID"
→ Verificer NEXT_PUBLIC_STRIPE_PRICE_* i .env.local

### Webhook virker ikke
```bash
# Test webhook secret
stripe listen --print-secret
```

### Kan ikke se abonnement efter betaling
→ Check webhook er configured og fungerer

### Middleware redirecter mig hele tiden
→ Check user_profiles i Supabase har korrekt data

---

## 📚 Næste Læsning

1. **IMPLEMENTATION_SUMMARY.md** - Komplet oversigt
2. **STRIPE_ONBOARDING_GUIDE.md** - Detaljeret vejledning
3. **STRIPE_SETUP.md** - Database schema

---

## 🎉 Done!

Når alt virker lokalt:
1. Deploy til production
2. Skift Stripe til live mode
3. Opdater webhook URL
4. Opdater environment variables i hosting

**Held og lykke! 🚀**
