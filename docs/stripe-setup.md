# Stripe Setup Guide

## Übersicht
NextLevelTraders verwendet Stripe für die Abwicklung von Zahlungen und Abonnements. Das Preismodell besteht aus:
- 4 Tage kostenloses Trial mit allen Features
- Monatlicher Pro-Plan für 49€
- Jährlicher Pro-Plan mit 15% Rabatt (499,80€ statt 588€)

## Initial Setup

1. Erstellen Sie einen Stripe Account und holen Sie sich Ihre API Keys
2. Fügen Sie die folgenden Umgebungsvariablen zu Ihrer `.env` Datei hinzu:
   ```
   STRIPE_SECRET_KEY=sk_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

3. Führen Sie das Setup-Script aus:
   ```bash
   npm run setup:stripe
   ```

4. Fügen Sie die generierten IDs zu Ihrer `.env` Datei hinzu:
   ```
   NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_xxx
   NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_xxx
   NEXT_PUBLIC_STRIPE_PRODUCT_ID=prod_xxx
   ```

## Webhook Setup

1. Installieren Sie das Stripe CLI Tool
2. Führen Sie den folgenden Befehl aus, um Webhooks lokal zu testen:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Kopieren Sie den Webhook Signing Secret in Ihre `.env` Datei:
   ```
   STRIPE_WEBHOOK_SIGNING_SECRET=whsec_xxx
   ```

## Features
- Automatische Trial-Periode von 4 Tagen
- Nahtlose Integration mit der Supabase Datenbank
- Automatische Webhook-Verarbeitung für Subscription Updates
- Kundenportal für Subscription Management

## Testing
- Verwenden Sie die [Stripe Testkarten](https://stripe.com/docs/testing#cards)
- Standard-Testkarte: `4242 4242 4242 4242`
- Trial endet nach 4 Tagen: `4000000000000077`

## Preisänderungen
Um die Preise zu ändern:
1. Aktualisieren Sie die Konstanten in `scripts/setup-stripe.mjs`
2. Führen Sie das Setup-Script erneut aus
3. Aktualisieren Sie die Umgebungsvariablen mit den neuen Preis-IDs

## Fehlerbehandlung
- Überprüfen Sie die Stripe Dashboard Logs für Details zu fehlgeschlagenen Zahlungen
- Webhook-Ereignisse werden in den Server-Logs protokolliert
- Bei Trial-Problemen überprüfen Sie die Subscription-Metadaten in Stripe