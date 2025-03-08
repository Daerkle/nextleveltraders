import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

const relevantEvents = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.trial_will_end'
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return new NextResponse('No signature found', { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      return new NextResponse('Webhook secret not configured', { status: 500 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    ) as Stripe.Event

    if (!relevantEvents.has(event.type)) {
      return new NextResponse(null, { status: 200 })
    }

    const supabase = createClient() as any // Type assertion für Supabase Client

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.user_id

        if (!userId) {
          console.error('No user_id found in subscription metadata')
          return new NextResponse('No user_id found', { status: 400 })
        }

        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            trial_end: subscription.trial_end 
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
            trial_start: subscription.trial_start
              ? new Date(subscription.trial_start * 1000).toISOString()
              : null,
            cancel_at: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000).toISOString()
              : null,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null
          })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.user_id

        if (!userId) {
          console.error('No user_id found in subscription metadata')
          return new NextResponse('No user_id found', { status: 400 })
        }

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            ended_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription
        // Hier können Sie eine E-Mail senden oder eine Benachrichtigung 
        // erstellen, um den Benutzer über das bevorstehende Trial-Ende zu informieren
        break
      }

      default:
        console.warn(`Unhandled relevant event type: ${event.type}`)
    }

    return new NextResponse(null, { status: 200 })
  } catch (error: any) {
    console.error('Webhook handler failed:', error.message)
    return new NextResponse(
      `Webhook Error: ${error.message}`,
      { status: 400 }
    )
  }
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'