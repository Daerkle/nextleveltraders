import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions"

const relevantEvents = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
])

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
  } catch (error) {
    console.error("Error verifying webhook signature:", error)
    return new NextResponse("Webhook signature verification failed", {
      status: 400,
    })
  }

  if (!relevantEvents.has(event.type)) {
    return new NextResponse(`Unhandled event type: ${event.type}`, {
      status: 200,
    })
  }

  try {
    const supabase = createClient()

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object
        const userId = subscription.metadata.user_id

        // Subscription Status bestimmen
        const status = subscription.status
        const isTrialing = status === "trialing"
        const trialEnd = subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null

        // Subscription in der Datenbank aktualisieren
        await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            status,
            plan: SUBSCRIPTION_PLANS.PRO,
            trial_end: trialEnd,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("user_id", userId)

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const userId = subscription.metadata.user_id

        // Subscription in der Datenbank löschen
        await supabase
          .from("subscriptions")
          .delete()
          .eq("stripe_subscription_id", subscription.id)

        break
      }

      case "customer.subscription.trial_will_end": {
        const subscription = event.data.object
        const userId = subscription.metadata.user_id

        // Optional: Hier können wir den Benutzer über das Ende der Trial-Phase informieren
        console.log(
          `Trial period for subscription ${subscription.id} will end soon.`
        )

        break
      }

      default:
        throw new Error("Unhandled relevant event!")
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("Error handling webhook event:", error)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }
}
