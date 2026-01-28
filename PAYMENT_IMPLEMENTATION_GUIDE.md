/**
 * IMPLEMENTERINGSGUIDE - "Første Syn Gratis" Model
 * 
 * Denne guide viser hvordan du implementerer betalingsfunktionaliteten i din app
 */

// ==========================================
// 1. OPDATER DIN INSPECTION SAVE HANDLER
// ==========================================

// I din inspection page (f.eks. app/inspection/new/page.tsx):

import { createInspectionWithPaymentCheck } from '@/lib/inspection-helpers'

const handleSave = async () => {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Ikke logget ind')
    }

    // Brug hjælpefunktionen til at oprette inspection med automatisk is_paid check
    const inspection = await createInspectionWithPaymentCheck(
      {
        tenant_name: tenantName,
        address: address,
        inspection_date: inspectionDate,
        status: 'draft',
        // ... andre felter
      },
      user.id
    )

    console.log('Inspection created:', inspection)
    console.log('Is paid:', inspection.is_paid) // true hvis første syn, false ellers
    
    // Redirect til inspection side eller vis success
    router.push(`/inspection/${inspection.id}`)
  } catch (error) {
    console.error('Error saving inspection:', error)
    alert('Der opstod en fejl. Prøv igen.')
  }
}

// ==========================================
// 2. BRUG DOWNLOAD PDF KOMPONENTEN
// ==========================================

// I din inspection detail page (f.eks. app/inspection/[id]/page.tsx):

import DownloadPDFButton from '@/components/DownloadPDFButton'
import { generatePDF } from '@/lib/pdf-generator'

export default function InspectionDetailPage({ params }: { params: { id: string } }) {
  const [inspection, setInspection] = useState(null)

  useEffect(() => {
    loadInspection()
  }, [])

  const loadInspection = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('inspections')
      .select('*')
      .eq('id', params.id)
      .single()
    
    setInspection(data)
  }

  const handleDownloadPDF = async () => {
    if (!inspection) return
    
    try {
      // Din eksisterende PDF generation logik
      const pdfBlob = await generatePDF(inspection)
      
      // Download filen
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `indflytningssyn-${inspection.address}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Der opstod en fejl ved generering af PDF')
    }
  }

  if (!inspection) return <div>Indlæser...</div>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Indflytningssyn</h1>
      
      {/* Vis inspection detaljer */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Detaljer</h2>
        <p><strong>Lejer:</strong> {inspection.tenant_name}</p>
        <p><strong>Adresse:</strong> {inspection.address}</p>
        {/* ... flere detaljer */}
      </div>

      {/* Download PDF Button med betalingslogik */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Download Rapport</h2>
        
        {inspection.is_paid ? (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✅ Dette syn er betalt - du kan downloade PDF rapporten gratis
            </p>
          </div>
        ) : null}

        <DownloadPDFButton
          inspectionId={inspection.id}
          isPaid={inspection.is_paid}
          onDownload={handleDownloadPDF}
        />
      </div>
    </div>
  )
}

// ==========================================
// 3. HÅNDTER BETALING SUCCESS
// ==========================================

// Opret en success page: app/inspection/[id]/download/page.tsx

export default function DownloadSuccessPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { payment: string }
}) {
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (searchParams.payment === 'success') {
      // Reload inspection data for at få opdateret is_paid status
      handleSuccessfulPayment()
    }
  }, [searchParams])

  const handleSuccessfulPayment = async () => {
    try {
      const supabase = createClient()
      
      // Hent opdateret inspection (is_paid skulle nu være true)
      const { data: inspection } = await supabase
        .from('inspections')
        .select('*')
        .eq('id', params.id)
        .single()

      if (inspection?.is_paid) {
        // Automatisk start PDF download
        setDownloading(true)
        const pdfBlob = await generatePDF(inspection)
        
        const url = URL.createObjectURL(pdfBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `indflytningssyn-${inspection.address}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        
        setDownloading(false)
        
        // Redirect tilbage til inspection page efter 2 sekunder
        setTimeout(() => {
          router.push(`/inspection/${params.id}`)
        }, 2000)
      }
    } catch (error) {
      console.error('Error:', error)
      setDownloading(false)
    }
  }

  if (searchParams.payment === 'cancelled') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-yellow-600 mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Betaling annulleret</h1>
          <p className="text-gray-600 mb-6">
            Din betaling blev annulleret. Du kan prøve igen når du er klar.
          </p>
          <button
            onClick={() => router.push(`/inspection/${params.id}`)}
            className="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600"
          >
            Tilbage til indflytningssyn
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-green-600 mb-4 text-5xl">✅</div>
        <h1 className="text-2xl font-bold mb-4">Betaling gennemført!</h1>
        <p className="text-gray-600 mb-6">
          {downloading 
            ? 'Din PDF rapport downloades nu...'
            : 'Tak for din betaling. Din PDF rapport er nu tilgængelig.'
          }
        </p>
        {downloading && (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-sky-500" size={40} />
          </div>
        )}
      </div>
    </div>
  )
}

// ==========================================
// 4. OPDATER .env.local
// ==========================================

/*
Tilføj til din .env.local:

# Stripe Price ID for PDF Download (one-time payment 149 DKK)
NEXT_PUBLIC_STRIPE_PRICE_PDF_DOWNLOAD=price_xxx

Opret produktet i Stripe Dashboard (LIVE MODE):
- Navn: PDF Rapport Download
- Pris: 149 DKK
- Type: One-time
*/
