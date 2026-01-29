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
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Digitale underskrifter</h2>
        <p className="text-gray-500 mb-6">
          Begge parter skal underskrive for at afslutte indflytningssynet.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Landlord Signature */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Udlejer underskrift</h3>
              <button
                type="button"
                onClick={() => landlordPad?.clear()}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Eraser className="h-4 w-4" />
                Ryd
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <canvas
                ref={landlordCanvasRef}
                className="w-full touch-none cursor-crosshair"
                style={{ height: '180px' }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Tegn din underskrift med musen eller fingeren
            </p>
          </div>

          {/* Tenant Signature */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Lejer underskrift</h3>
              <button
                type="button"
                onClick={() => tenantPad?.clear()}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Eraser className="h-4 w-4" />
                Ryd
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <canvas
                ref={tenantCanvasRef}
                className="w-full touch-none cursor-crosshair"
                style={{ height: '180px' }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Tegn din underskrift med musen eller fingeren
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Tilbage
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Fuldfør inspektion
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
