import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    // Use server client to properly authenticate via cookies
    const supabase = await createServerSupabase()
    
    // Get the authenticated user from server session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Ikke autentificeret' },
        { status: 401 }
      )
    }

    // Get user's Stripe customer ID
    interface ProfileResult {
      stripe_customer_id: string | null
    }
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single() as { data: ProfileResult | null }

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Ingen Stripe kunde fundet' },
        { status: 404 }
      )
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_URL}/abonnement`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Kunne ikke oprette portal session' },
      { status: 500 }
    )
  }
}
