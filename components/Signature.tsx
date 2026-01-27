'use client'

import { useEffect, useRef, useState } from 'react'
import SignaturePad from 'signature_pad'
import { Eraser } from 'lucide-react'

interface SignatureProps {
  data: {
    landlordSignature: string
    tenantSignature: string
  }
  onNext: (signatures: { landlordSignature: string; tenantSignature: string }) => void
  onBack: () => void
}

export default function Signature({ data, onNext, onBack }: SignatureProps) {
  const landlordCanvasRef = useRef<HTMLCanvasElement>(null)
  const tenantCanvasRef = useRef<HTMLCanvasElement>(null)
  const [landlordPad, setLandlordPad] = useState<SignaturePad | null>(null)
  const [tenantPad, setTenantPad] = useState<SignaturePad | null>(null)

  const resizeCanvas = (canvas: HTMLCanvasElement) => {
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(ratio, ratio)
    }
  }

  useEffect(() => {
    if (landlordCanvasRef.current) {
      resizeCanvas(landlordCanvasRef.current)
      const pad = new SignaturePad(landlordCanvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      })
      setLandlordPad(pad)
      if (data.landlordSignature) {
        pad.fromDataURL(data.landlordSignature)
      }
    }

    if (tenantCanvasRef.current) {
      resizeCanvas(tenantCanvasRef.current)
      const pad = new SignaturePad(tenantCanvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      })
      setTenantPad(pad)
      if (data.tenantSignature) {
        pad.fromDataURL(data.tenantSignature)
      }
    }

    const handleResize = () => {
      if (landlordCanvasRef.current && landlordPad) {
        const data = landlordPad.toDataURL()
        resizeCanvas(landlordCanvasRef.current)
        landlordPad.fromDataURL(data)
      }
      if (tenantCanvasRef.current && tenantPad) {
        const data = tenantPad.toDataURL()
        resizeCanvas(tenantCanvasRef.current)
        tenantPad.fromDataURL(data)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      landlordPad?.off()
      tenantPad?.off()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!landlordPad || !tenantPad) return

    if (landlordPad.isEmpty() || tenantPad.isEmpty()) {
      alert('Begge underskrifter skal udfyldes')
      return
    }

    onNext({
      landlordSignature: landlordPad.toDataURL(),
      tenantSignature: tenantPad.toDataURL(),
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Digitale Underskrifter</h2>
        <p className="text-gray-600 mb-8">
          Begge parter skal underskrive for at afslutte indflytningssynet.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Landlord Signature */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Udlejer Underskrift</h3>
              <button
                type="button"
                onClick={() => landlordPad?.clear()}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Eraser className="h-4 w-4" />
                Ryd
              </button>
            </div>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={landlordCanvasRef}
                className="w-full touch-none cursor-crosshair"
                style={{ height: '200px' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Tegn din underskrift med musen eller fingeren
            </p>
          </div>

          {/* Tenant Signature */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Lejer Underskrift</h3>
              <button
                type="button"
                onClick={() => tenantPad?.clear()}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <Eraser className="h-4 w-4" />
                Ryd
              </button>
            </div>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={tenantCanvasRef}
                className="w-full touch-none cursor-crosshair"
                style={{ height: '200px' }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Tegn din underskrift med musen eller fingeren
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Tilbage
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Fuldfør Inspektion
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
