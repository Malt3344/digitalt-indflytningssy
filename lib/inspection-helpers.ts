// Hjælpefunktion til at tjekke og sætte is_paid status baseret på antal tidligere syn
// Brug denne når du gemmer et nyt indflytningssyn

import { createClient } from '@/lib/supabase'

export async function checkAndSetIsPaid(landlordId: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // Tæl antal eksisterende inspections for denne landlord
    const { count, error } = await supabase
      .from('inspections')
      .select('*', { count: 'exact', head: true })
      .eq('landlord_id', landlordId)

    if (error) {
      console.error('Error counting inspections:', error)
      return false
    }

    // Første syn (count === 0) er gratis (is_paid = true)
    // Efterfølgende syn kræver betaling for PDF (is_paid = false)
    return count === 0
  } catch (error) {
    console.error('Error in checkAndSetIsPaid:', error)
    return false
  }
}

// Eksempel på brug i din handleSave funktion:
export async function createInspectionWithPaymentCheck(
  inspectionData: any,
  landlordId: string
) {
  const supabase = createClient()
  
  // Tjek om dette er brugerens første syn
  const isPaid = await checkAndSetIsPaid(landlordId)
  
  // Opret inspection med korrekt is_paid status
  const { data, error } = await supabase
    .from('inspections')
    .insert({
      ...inspectionData,
      landlord_id: landlordId,
      is_paid: isPaid,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
