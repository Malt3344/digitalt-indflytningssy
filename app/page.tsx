'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FileCheck, ArrowRight, Shield, Smartphone, FileText } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/inspection/new')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <FileCheck className="h-20 w-20 text-primary-600 mx-auto" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Digitalt Indflytningssyn
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Den professionelle og lovlige løsning til indflytningssyn i Danmark. 
            Nemt, hurtigt og dokumenteret.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center gap-2 text-lg"
            >
              Kom I Gang
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/auth/login"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200 text-lg"
            >
              Log Ind
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Lovligt & Sikkert</h3>
            <p className="text-gray-600">
              Opfylder alle danske krav til indflytningssyn med digital signatur.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Smartphone className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Mobil-venlig</h3>
            <p className="text-gray-600">
              Udfør inspektionen direkte fra din telefon eller tablet.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FileText className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">PDF Rapport</h3>
            <p className="text-gray-600">
              Download en professionel PDF-rapport med alle detaljer.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Sådan Fungerer Det
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Grundlæggende Information</h4>
                <p className="text-gray-600">Indtast lejer navn, adresse og dato.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Rum-for-Rum Inspektion</h4>
                <p className="text-gray-600">
                  Vurder hvert rum og noter stand og eventuelle skader.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Upload Billeder</h4>
                <p className="text-gray-600">
                  Tag billeder som dokumentation for hver rum.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Digital Underskrift</h4>
                <p className="text-gray-600">
                  Både udlejer og lejer underskriver digitalt.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Download PDF</h4>
                <p className="text-gray-600">
                  Download en professionel rapport til dine filer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
