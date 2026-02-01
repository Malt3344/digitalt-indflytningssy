import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Handelsbetingelser | Synsguiden',
  description: 'Læs vores handelsbetingelser og vilkår for brug af Synsguiden',
}

export default function VilkaarPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a href="/" className="text-gray-500 hover:text-black text-sm mb-6 inline-block">
          ← Tilbage til forsiden
        </a>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Handelsbetingelser</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Sidst opdateret: {new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Generelt</h2>
            <p className="text-gray-600 mb-4">
              Disse handelsbetingelser gælder for alle køb og brug af Synsguiden's tjenester. 
              Ved at oprette en konto eller købe en synsrapport accepterer du disse betingelser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Tjenesten</h2>
            <p className="text-gray-600 mb-4">
              Synsguiden er en digital platform til oprettelse af indflytningssyn. Tjenesten inkluderer:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Oprettelse af digitale indflytningssyn</li>
              <li>Foto-dokumentation af lejemål</li>
              <li>Digital underskrift fra udlejer og lejer</li>
              <li>Generering af PDF-synsrapporter</li>
              <li>Sikker opbevaring af synsdata</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Priser og betaling</h2>
            <p className="text-gray-600 mb-4">
              <strong>Gratis prøveperiode:</strong> Dit første indflytningssyn er gratis inklusiv PDF-download.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Efterfølgende syn:</strong> 149 DKK per synsrapport. Prisen er inklusiv moms.
            </p>
            <p className="text-gray-600 mb-4">
              Betaling sker via Stripe og understøtter alle gængse betalingskort. 
              Du betaler først når du vælger at downloade din synsrapport.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Fortrydelsesret</h2>
            <p className="text-gray-600 mb-4">
              Da synsrapporten leveres digitalt umiddelbart efter køb, og du aktivt anmoder om at 
              modtage den digitale vare, frafalder du din fortrydelsesret ved gennemførelse af købet, 
              jf. forbrugeraftalelovens § 18, stk. 2, nr. 13.
            </p>
            <p className="text-gray-600 mb-4">
              Før du gennemfører dit køb, vil du blive bedt om at bekræfte, at du er indforstået med 
              at levering påbegyndes straks, og at fortrydelsesretten dermed bortfalder.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Ansvarsbegrænsning</h2>
            <p className="text-gray-600 mb-4">
              Synsguiden leverer et værktøj til dokumentation af indflytningssyn. Vi garanterer ikke:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>At synsrapporten vil være juridisk bindende i alle tvister</li>
              <li>At tjenesten vil være tilgængelig uden afbrydelser</li>
              <li>At rapporterne vil være egnet til alle formål</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Vi anbefaler at konsultere en juridisk rådgiver ved væsentlige tvister.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Brugerens ansvar</h2>
            <p className="text-gray-600 mb-4">
              Som bruger af Synsguiden er du ansvarlig for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>At de oplysninger du indtaster er korrekte</li>
              <li>At du har ret til at fotografere lejemålet</li>
              <li>At indhente samtykke fra lejeren til behandling af deres personoplysninger</li>
              <li>At opbevare dine login-oplysninger sikkert</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Ophavsret</h2>
            <p className="text-gray-600 mb-4">
              Alt indhold på Synsguiden, herunder design, kode og tekst, er beskyttet af ophavsret. 
              Du må downloade og bruge dine egne synsrapporter til lovlige formål.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Opsigelse</h2>
            <p className="text-gray-600 mb-4">
              Du kan til enhver tid slette din konto ved at kontakte os. Ved sletning af konto:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Slettes dine personlige oplysninger</li>
              <li>Du mister adgang til tidligere syn</li>
              <li>Allerede betalte rapporter refunderes ikke</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Ændringer af betingelser</h2>
            <p className="text-gray-600 mb-4">
              Vi forbeholder os ret til at ændre disse betingelser. Ved væsentlige ændringer 
              vil du blive informeret via e-mail mindst 30 dage før ændringerne træder i kraft.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Lovvalg og værneting</h2>
            <p className="text-gray-600 mb-4">
              Disse betingelser er underlagt dansk ret. Eventuelle tvister skal afgøres ved de danske domstole.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Kontakt</h2>
            <p className="text-gray-600">
              Hvis du har spørgsmål til disse betingelser, kan du kontakte os på:{' '}
              <a href="mailto:support@synsguiden.com" className="text-black underline">support@synsguiden.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
