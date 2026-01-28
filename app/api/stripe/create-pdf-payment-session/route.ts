import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    console.log('=== CREATE PDF PAYMENT SESSION START ===')
    
    // Use admin client to bypass RLS
    const supabase = createAdminSupabase()

    const { inspectionId, userId } = await req.json()
    console.log('Request payload:', { inspectionId, userId })

    if (!inspectionId) {
      console.log('Missing inspection ID')
      return NextResponse.json(
        { error: 'Inspection ID er påkrævet' },
        { status: 400 }
      )
    }

    if (!userId) {
      console.log('Missing user ID')
      return NextResponse.json(
        { error: 'Ikke autentificeret' },
        { status: 401 }
      )
    }
    
    const actualUserId = userId

    // Verify the inspection belongs to the user and is not already paid
    interface InspectionResult {
      id: string
      landlord_id: string
      is_paid: boolean
      tenant_name: string
      address: string
    }
    
    console.log('Querying inspection with:', { inspectionId, actualUserId })
    
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .select('id, landlord_id, is_paid, tenant_name, address')
      .eq('id', inspectionId)
      .single() as { data: InspectionResult | null; error: any }

    console.log('Inspection query result:', { inspection, inspectionError })

    if (inspectionError || !inspection) {
      console.log('Inspection not found:', inspectionError)
      return NextResponse.json(
        { error: 'Indflytningssyn ikke fundet' },
        { status: 404 }
      )
    }

    // Verify the inspection belongs to the user
    if (inspection.landlord_id !== actualUserId) {
      console.log('Unauthorized: wrong landlord_id', { 
        inspectionLandlord: inspection.landlord_id, 
        requestUser: actualUserId 
      })
      return NextResponse.json(
        { error: 'Ikke autoriseret' },
        { status: 403 }
      )
    }

    if (inspection.landlord_id !== actualUserId) {
      console.log('Unauthorized: wrong landlord_id')
      return NextResponse.json(
        { error: 'Ikke autoriseret' },
        { status: 403 }
      )
    }

    if (inspection.is_paid) {
      console.log('Already paid')
      return NextResponse.json(
        { error: 'Dette syn er allerede betalt' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id, email')
      .eq('id', actualUserId)
      .single() as { data: { stripe_customer_id?: string; email: string } | null }

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      // Get user email from auth
      const { data: { user } } = await supabase.auth.admin.getUserById(actualUserId)
      const userEmail = user?.email || profile?.email || 'user@example.com'
      
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          supabase_user_id: actualUserId,
        },
      })
      customerId = customer.id

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', actualUserId)
    }

    // Create checkout session for one-time payment
    console.log('Creating Stripe session...')
    console.log('Price ID:', process.env.NEXT_PUBLIC_STRIPE_PRICE_PDF_DOWNLOAD)
    console.log('Customer ID:', customerId)
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_PDF_DOWNLOAD!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/inspection/${inspectionId}/download?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/inspection/${inspectionId}?payment=cancelled`,
      metadata: {
        supabase_user_id: actualUserId,
        inspection_id: inspectionId,
      },
      payment_intent_data: {
        metadata: {
          supabase_user_id: actualUserId,
          inspection_id: inspectionId,
        },
      },
    })

    console.log('Stripe session created:', session.id, session.url)
    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating PDF payment session:', error)
    return NextResponse.json(
      { error: 'Kunne ikke oprette betalingssession' },
      { status: 500 }
    )
  }
}
