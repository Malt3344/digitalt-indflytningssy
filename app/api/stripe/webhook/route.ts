import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Use service role key for webhook to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Webhook Error: ' + err.message },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const tier = session.metadata?.subscription_tier
        const inspectionId = session.metadata?.inspection_id

        // Handle subscription checkout
        if (userId && session.subscription) {
          await supabaseAdmin
            .from('user_profiles')
            .update({
              stripe_subscription_id: session.subscription as string,
              subscription_status: 'active',
              subscription_tier: tier,
            })
            .eq('id', userId)
        }

        // Handle one-time PDF payment
        if (userId && inspectionId && session.payment_intent) {
          await (supabaseAdmin as any)
            .from('inspections')
            .update({
              is_paid: true,
              payment_intent_id: session.payment_intent as string,
            })
            .eq('id', inspectionId)
            .eq('landlord_id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id
        const periodEnd = (subscription as any).current_period_end

        if (userId) {
          await supabaseAdmin
            .from('user_profiles')
            .update({
              subscription_status: subscription.status as any,
              subscription_current_period_end: periodEnd
                ? new Date(periodEnd * 1000).toISOString()
                : null,
            })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id

        if (userId) {
          await supabaseAdmin
            .from('user_profiles')
            .update({
              subscription_status: 'canceled',
              stripe_subscription_id: null,
              subscription_tier: null,
            })
            .eq('id', userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription
        
        if (subscriptionId && typeof subscriptionId === 'string') {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const userId = subscription.metadata?.supabase_user_id

          if (userId) {
            await supabaseAdmin
              .from('user_profiles')
              .update({
                subscription_status: 'past_due' as any,
              })
              .eq('id', userId)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
