'use client'

import { useState } from 'react'
import { Gauge, Droplets, Flame } from 'lucide-react'

interface MeterReadingsProps {
  data: {
    elMeterNo: string
    elReading: string
    waterReading: string
    heatReading: string
  }
  onNext: (data: {
    elMeterNo: string
    elReading: string
    waterReading: string
    heatReading: string
  }) => void
  onBack: () => void
}

export default function MeterReadings({ data, onNext, onBack }: MeterReadingsProps) {
  const [formData, setFormData] = useState(data)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Måleraflæsning</h2>
        <p className="text-gray-500 mb-6">
          Aflæs alle målere og noter værdierne. Dette er lovpligtigt ved indflytning.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* El Meter */}
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-50 rounded-xl">
                <Gauge className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">El-måler</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Målernummer
                </label>
                <input
                  type="text"
                  value={formData.elMeterNo}
                  onChange={(e) => setFormData({ ...formData, elMeterNo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  placeholder="f.eks. 571234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Aflæsning (kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.elReading}
                  onChange={(e) => setFormData({ ...formData, elReading: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                  placeholder="f.eks. 12345.67"
                />
              </div>
            </div>
          </div>

          {/* Water Meter */}
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Droplets className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Vandmåler</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Aflæsning (m³)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.waterReading}
                onChange={(e) => setFormData({ ...formData, waterReading: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                placeholder="f.eks. 456.78"
              />
            </div>
          </div>

          {/* Heat Meter */}
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-xl">
                <Flame className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Varmemåler</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Aflæsning (GJ eller MWh)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.heatReading}
                onChange={(e) => setFormData({ ...formData, heatReading: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                placeholder="f.eks. 89.12"
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Vigtigt:</strong> Måleraflæsning skal dokumenteres ved indflytning 
              iht. Lejeloven § 10. Tag gerne et billede af hver måler som ekstra dokumentation.
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
              Næste
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
