# NextLevelTraders

Eine fortschrittliche Trading-Plattform mit Premium-Features und Subscription-Management.

## Features

- Echtzeit-Marktdaten
- Technische Analyse-Tools
- Premium Trading-Indikatoren
- Watchlist-Management
- Subscription-System mit Trial-Periode

## Subscription Plans

- **Trial**: 4 Tage kostenlos mit vollem Zugriff auf alle Features
- **Pro Monatlich**: 49€/Monat
- **Pro Jährlich**: 499,80€/Jahr (15% Rabatt)

## Technischer Stack

- Next.js 14 mit App Router
- TypeScript
- Supabase für Datenbank und Auth
- Stripe für Payments
- TailwindCSS für Styling
- Clerk für User Management

## Erste Schritte

1. Repository klonen:
```bash
git clone https://github.com/yourusername/nextleveltraders.git
cd nextleveltraders
```

2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen einrichten:
```bash
cp .env.example .env.local
```

4. Umgebungsvariablen in `.env.local` konfigurieren:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=
NEXT_PUBLIC_STRIPE_PRODUCT_ID=

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

5. Stripe Produkte und Preise einrichten:
```bash
npm run setup:stripe
```

6. Entwicklungsserver starten:
```bash
npm run dev
```

## Stripe Webhook Setup

1. Stripe CLI installieren
2. Webhook-Forwarding starten:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Datenbank-Setup

1. Supabase-Projekt erstellen
2. SQL-Migrations ausführen:
```bash
cd supabase/migrations
```

## Deployment

1. Vercel-Projekt einrichten
2. Umgebungsvariablen in Vercel konfigurieren
3. Deployment starten:
```bash
vercel deploy
```

## Entwicklung

- TypeScript für Type Safety
- ESLint & Prettier für Code-Formatierung
- Husky für Git Hooks
- Jest für Tests

## Lizenz

MIT
