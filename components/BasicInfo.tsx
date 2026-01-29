'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'

interface BasicInfoProps {
  data: {
    tenantName: string
    address: string
    inspectionDate: string
  }
  onNext: (data: { tenantName: string; address: string; inspectionDate: string }) => void
}

export default function BasicInfo({ data, onNext }: BasicInfoProps) {
  const [formData, setFormData] = useState(data)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Grundlæggende information</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lejer navn
            </label>
            <input
              type="text"
              required
              value={formData.tenantName}
              onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
              placeholder="Indtast lejer navn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Adresse
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
              placeholder="Vejnavn 123, 1234 København"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Dato for indflytningssyn
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={formData.inspectionDate}
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
              />
              <Calendar className="absolute right-3 top-3 h-6 w-6 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 active:bg-gray-900 transition-colors mt-2"
          >
            Næste
          </button>
        </form>
      </div>
    </div>
  )
}
