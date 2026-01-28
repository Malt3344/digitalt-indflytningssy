import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privatlivspolitik | SynsApp',
  description: 'Læs om hvordan SynsApp behandler dine persondata',
}

export default function PrivatlivspolitikPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a href="/" className="text-gray-500 hover:text-black text-sm mb-6 inline-block">
          ← Tilbage til forsiden
        </a>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privatlivspolitik</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Sidst opdateret: {new Date().toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Dataansvarlig</h2>
            <p className="text-gray-600 mb-4">
              SynsApp er dataansvarlig for behandlingen af de personoplysninger, som vi modtager om dig. 
              Du kan kontakte os på: <a href="mailto:support@synsapp.dk" className="text-black underline">support@synsapp.dk</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Hvilke oplysninger indsamler vi?</h2>
            <p className="text-gray-600 mb-4">Vi indsamler og behandler følgende typer personoplysninger:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Kontooplysninger:</strong> E-mail, navn (valgfrit)</li>
              <li><strong>Synsdata:</strong> Adresse på lejemål, lejeroplysninger, fotos af lejemål, målerstande, digitale underskrifter</li>
              <li><strong>Betalingsoplysninger:</strong> Håndteres sikkert af Stripe. Vi gemmer ikke kortnumre.</li>
              <li><strong>Tekniske data:</strong> IP-adresse, browsertype, besøgstidspunkter</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Formål med behandlingen</h2>
            <p className="text-gray-600 mb-4">Vi behandler dine oplysninger til følgende formål:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>At levere vores tjeneste (oprettelse af indflytningssyn og PDF-rapporter)</li>
              <li>At administrere din konto</li>
              <li>At behandle betalinger</li>
              <li>At kommunikere med dig om din konto og vores tjenester</li>
              <li>At overholde lovmæssige forpligtelser</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Retsgrundlag</h2>
            <p className="text-gray-600 mb-4">
              Vi behandler dine personoplysninger baseret på følgende retsgrundlag:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Kontraktopfyldelse:</strong> For at levere den tjeneste, du har tilmeldt dig</li>
              <li><strong>Samtykke:</strong> Til cookies og markedsføring (hvor relevant)</li>
              <li><strong>Legitime interesser:</strong> Til at forbedre vores tjenester og sikkerhed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Deling af data</h2>
            <p className="text-gray-600 mb-4">
              Vi deler dine data med følgende tredjeparter:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Supabase:</strong> Database og autentifikation (EU-baseret)</li>
              <li><strong>Stripe:</strong> Betalingsbehandling (PCI DSS-certificeret)</li>
              <li><strong>Vercel:</strong> Hosting af hjemmesiden</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Vi sælger aldrig dine personoplysninger til tredjeparter.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Opbevaring</h2>
            <p className="text-gray-600 mb-4">
              Vi opbevarer dine personoplysninger, så længe det er nødvendigt for at opfylde de formål, 
              de blev indsamlet til. Synsrapporter opbevares i op til 5 år efter oprettelse, 
              da de kan være relevante ved fraflytning eller tvister.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Dine rettigheder</h2>
            <p className="text-gray-600 mb-4">Du har følgende rettigheder:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Indsigt:</strong> Du kan få adgang til dine personoplysninger</li>
              <li><strong>Berigtigelse:</strong> Du kan få rettet urigtige oplysninger</li>
              <li><strong>Sletning:</strong> Du kan bede om at få slettet dine oplysninger</li>
              <li><strong>Dataportabilitet:</strong> Du kan få udleveret dine data i et struktureret format</li>
              <li><strong>Indsigelse:</strong> Du kan gøre indsigelse mod visse former for behandling</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Kontakt os på <a href="mailto:support@synsapp.dk" className="text-black underline">support@synsapp.dk</a> for at udøve dine rettigheder.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Cookies</h2>
            <p className="text-gray-600 mb-4">
              Vi bruger cookies til at:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Nødvendige cookies:</strong> For at huske din login-session</li>
              <li><strong>Funktionelle cookies:</strong> For at huske dine præferencer</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Vi bruger ikke tracking eller markedsføringscookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Klageadgang</h2>
            <p className="text-gray-600 mb-4">
              Hvis du er utilfreds med vores behandling af dine personoplysninger, 
              kan du klage til Datatilsynet: <a href="https://www.datatilsynet.dk" className="text-black underline" target="_blank" rel="noopener noreferrer">www.datatilsynet.dk</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Ændringer</h2>
            <p className="text-gray-600">
              Vi kan opdatere denne privatlivspolitik fra tid til anden. 
              Ved væsentlige ændringer vil vi informere dig via e-mail eller en meddelelse på hjemmesiden.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
