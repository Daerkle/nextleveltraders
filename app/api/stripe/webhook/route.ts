import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

const relevantEvents = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
])

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const headerEntries = Array.from(headersList.entries())
  const signature = headerEntries.find(([key]) => key === 'stripe-signature')?.[1]
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  try {
    if (!signature || !webhookSecret) {
      return new NextResponse("Webhook Error: No signature or secret", { status: 400 })
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      const supabase = createClient(req as any)

      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription
          const customerId = subscription.customer as string

          // Hole den User aus den Metadaten des Kunden
          const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
          if (!customer || !customer.metadata?.user_id) {
            throw new Error("No customer found or missing user_id in metadata")
          }

          await supabase
            .from("subscriptions")
            .upsert({
              user_id: customer.metadata.user_id,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              price_id: subscription.items.data[0].price.id,
              trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
              trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
              canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
              ended_at: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : null,
            })
            .eq("stripe_subscription_id", subscription.id)

          console.log(`✅ Subscription ${event.type} erfolgreich verarbeitet`)
          break
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription
          
          await supabase
            .from("subscriptions")
            .update({
              status: "canceled",
              ended_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id)

          console.log("✅ Subscription deleted erfolgreich verarbeitet")
          break
        }
        case "customer.subscription.trial_will_end": {
          const subscription = event.data.object as Stripe.Subscription
          // Optional: Implementiere E-Mail-Benachrichtigung
          // await sendTrialEndingEmail(subscription)
          console.log("✅ Trial will end Benachrichtigung verarbeitet")
          break
        }
        default:
          throw new Error("Unhandled relevant event!")
      }
    } catch (error) {
      console.error("❌ Error:", error)
      return new NextResponse("Webhook error: Stripe handler failed", { status: 400 })
    }
  }

  return NextResponse.json({ received: true })
}