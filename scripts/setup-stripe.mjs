import dotenv from 'dotenv'
import Stripe from 'stripe'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

const MONTHLY_PRICE = 4900 // 49€ in Cents
const YEARLY_PRICE = Math.floor(MONTHLY_PRICE * 12 * 0.85) // 15% Rabatt

async function main() {
  try {
    console.log('🚀 Starte Stripe Setup...')

    // Pro Plan Produkt erstellen
    console.log('📦 Erstelle Pro Plan Produkt...')
    const product = await stripe.products.create({
      name: 'NextLevelTraders Pro',
      description: 'Zugang zu allen Premium-Features',
      active: true,
      metadata: {
        features: [
          'Unbegrenzte API Aufrufe',
          'Alle Trading Tools',
          'Premium Support',
          'Echtzeit-Marktdaten',
          'Erweiterte Analysetools',
          'Technische Indikatoren'
        ].join(',')
      }
    })

    console.log('✅ Produkt erstellt:', product.id)

    // Monatlicher Preis
    console.log('💰 Erstelle monatlichen Preis...')
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: MONTHLY_PRICE,
      currency: 'eur',
      recurring: {
        interval: 'month'
      },
      metadata: {
        type: 'monthly'
      }
    })

    console.log('✅ Monatlicher Preis erstellt:', monthlyPrice.id)

    // Jährlicher Preis
    console.log('💰 Erstelle jährlichen Preis...')
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: YEARLY_PRICE,
      currency: 'eur',
      recurring: {
        interval: 'year'
      },
      metadata: {
        type: 'yearly'
      }
    })

    console.log('✅ Jährlicher Preis erstellt:', yearlyPrice.id)
    console.log('\n✨ Stripe Setup abgeschlossen!')
    console.log('\nBitte fügen Sie die folgenden Werte zu Ihrer .env Datei hinzu:')
    console.log(`NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`)
    console.log(`NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=${yearlyPrice.id}`)
    console.log(`NEXT_PUBLIC_STRIPE_PRODUCT_ID=${product.id}`)

  } catch (error) {
    console.error('❌ Fehler beim Setup:', error)
    process.exit(1)
  }
}

main()