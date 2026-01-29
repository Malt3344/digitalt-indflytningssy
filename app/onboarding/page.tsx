'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  CheckCircle2, 
  Home, 
  FileText, 
  Camera, 
  PenTool,
  Download,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

const steps = [
  {
    title: 'Velkommen til Digitalt Indflytningssyn',
    description: 'Lad os guide dig gennem de grundlæggende funktioner, så du hurtigt kan komme i gang.',
    icon: Home,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Hvad er Digitalt Indflytningssyn?
        </h3>
        <p className="text-gray-700">
          Digitalt Indflytningssyn er en moderne løsning til at dokumentere boligens tilstand 
          ved ind- og fraflytning. Systemet gør det nemt at:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <span>Oprette professionelle indflytningssyn på få minutter</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <span>Dokumentere rum med fotos og beskrivelser</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <span>Indsamle digitale signaturer fra lejer og udlejer</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <span>Eksportere alt som PDF til arkivering</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Opret et nyt indflytningssyn',
    description: 'Start med at udfylde grundlæggende oplysninger om lejemålet og lejer.',
    icon: FileText,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Grundlæggende oplysninger
        </h3>
        <p className="text-gray-700">
          Når du opretter et nyt indflytningssyn, skal du indtaste:
        </p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <div className="font-semibold text-gray-900">Lejers navn</div>
            <div className="text-sm text-gray-600">Fulde navn på den person der flytter ind</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Adresse</div>
            <div className="text-sm text-gray-600">Fuldstændig adresse på lejemålet</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Indflytningsdato</div>
            <div className="text-sm text-gray-600">Dato for indflytning</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Målerstande</div>
            <div className="text-sm text-gray-600">El, vand og varme målernumre og stande</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Nøgler</div>
            <div className="text-sm text-gray-600">Antal udleverede nøgler og eventuelle noter</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Dokumentér hvert rum',
    description: 'Tilføj fotos og beskrivelser af hver enkelt rum i boligen.',
    icon: Camera,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Rum-for-rum gennemgang
        </h3>
        <p className="text-gray-700">
          For hvert rum i boligen kan du:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Camera className="text-sky-600" size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Tilføj fotos</div>
              <div className="text-sm text-gray-600">
                Tag fotos af rummet fra flere vinkler. Fokusér på eventuelle skader eller slitage.
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Vælg tilstand</div>
              <div className="text-sm text-gray-600">
                Marker rummet som: Perfekt, Brugsspor eller Mangel
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="text-purple-600" size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Tilføj beskrivelse</div>
              <div className="text-sm text-gray-600">
                Beskriv eventuelle skader, slitage eller særlige forhold
              </div>
            </div>
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Indhent signaturer',
    description: 'Få både lejer og udlejer til at underskrive digitalt.',
    icon: PenTool,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Digital signatur
        </h3>
        <p className="text-gray-700">
          Når gennemgangen er færdig, skal både udlejer og lejer underskrive:
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <PenTool className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <div className="font-semibold text-amber-900 mb-2">
                Vigtig information
              </div>
              <p className="text-sm text-amber-800">
                Begge parter skal være til stede og underskrive på samme enhed. 
                Først udlejer, derefter lejer. Når begge signaturer er indsamlet, 
                låses dokumentet og kan ikke længere redigeres.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p>📝 Brug fingeren eller en stylus til at underskrive</p>
          <p>🔒 Dokumentet låses automatisk efter begge signaturer</p>
          <p>💾 Data gemmes sikkert i skyen</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Eksportér som PDF',
    description: 'Download en professionel PDF-rapport til dine records.',
    icon: Download,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          PDF Eksport
        </h3>
        <p className="text-gray-700">
          Når indflytningssynet er underskrevet, kan du eksportere det som PDF:
        </p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Download className="text-sky-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <div className="font-semibold text-gray-900">
                Professionel rapport
              </div>
              <div className="text-sm text-gray-600">
                PDF'en inkluderer alle oplysninger, fotos, beskrivelser og signaturer 
                i et overskueligt format.
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Gem PDF'en både digitalt og send en kopi til lejer. 
            På den måde har begge parter dokumentation.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'Du er klar!',
    description: 'Nu kan du begynde at oprette dine første indflytningssyn.',
    icon: CheckCircle2,
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="text-green-600" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Fantastisk!
          </h3>
          <p className="text-gray-700">
            Du er nu klar til at oprette dit første professionelle indflytningssyn.
          </p>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Næste skridt
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <ArrowRight size={16} className="text-sky-600" />
              Klik på "Kom i gang" nedenfor
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={16} className="text-sky-600" />
              Opret dit første indflytningssyn
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={16} className="text-sky-600" />
              Udforsk alle funktioner
            </li>
          </ul>
        </div>

        <div className="text-center text-sm text-gray-600">
          Har du brug for hjælp? Kontakt vores support på{' '}
          <a href="mailto:support@indflytningssyn.dk" className="text-sky-600 hover:underline">
            support@indflytningssyn.dk
          </a>
        </div>
      </div>
    ),
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completing, setCompleting] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    try {
      setCompleting(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        await (supabase as any)
          .from('user_profiles')
          .update({ onboarding_completed: true })
          .eq('id', user.id)
      }

      router.push('/')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setCompleting(false)
    }
  }

  const step = steps[currentStep]
  const Icon = step.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Trin {currentStep + 1} af {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% gennemført
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-sky-500 w-8'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-sky-100 rounded-xl">
              <Icon className="text-sky-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{step.title}</h1>
              <p className="text-gray-600 mt-1">{step.description}</p>
            </div>
          </div>

          <div className="mt-8">{step.content}</div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={20} />
            Forrige
          </button>

          <button
            onClick={handleNext}
            disabled={completing}
            className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? (
              completing ? (
                'Gemmer...'
              ) : (
                <>
                  Kom i gang
                  <CheckCircle2 size={20} />
                </>
              )
            ) : (
              <>
                Næste
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Skip option */}
        {currentStep < steps.length - 1 && (
          <div className="text-center mt-6">
            <button
              onClick={completeOnboarding}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Spring introduktion over
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
