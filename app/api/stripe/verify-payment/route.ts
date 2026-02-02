import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase, createServerSupabase } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const serverSupabase = await createServerSupabase()
    const { data: { user }, error: authError } = await serverSupabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Ikke autentificeret' }, { status: 401 })
    }

    const { inspectionId } = await req.json()

    if (!inspectionId) {
      return NextResponse.json({ error: 'Inspection ID er påkrævet' }, { status: 400 })
    }

    const supabase = createAdminSupabase()

    // Check if already paid
    const { data: inspection } = await supabase
      .from('inspections')
      .select('is_paid, landlord_id')
      .eq('id', inspectionId)
      .single() as { data: { is_paid: boolean; landlord_id: string } | null }

    if (!inspection || inspection.landlord_id !== user.id) {
      return NextResponse.json({ error: 'Ikke autoriseret' }, { status: 403 })
    }

    if (inspection.is_paid) {
      return NextResponse.json({ verified: true, alreadyPaid: true })
    }

    // Look up recent checkout sessions for this user and inspection
    const sessions = await stripe.checkout.sessions.list({
      limit: 10,
    })

    // Find a completed session for this inspection
    const completedSession = sessions.data.find(session => 
      session.metadata?.inspection_id === inspectionId &&
      session.metadata?.supabase_user_id === user.id &&
      session.payment_status === 'paid'
    )

    if (completedSession) {
      // Update the inspection as paid
      await (supabase as any)
        .from('inspections')
        .update({
          is_paid: true,
          payment_intent_id: completedSession.payment_intent as string,
        })
        .eq('id', inspectionId)
        .eq('landlord_id', user.id)

      return NextResponse.json({ verified: true })
    }

    return NextResponse.json({ verified: false })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: 'Kunne ikke verificere betaling' }, { status: 500 })
  }
}
