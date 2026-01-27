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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Grundlæggende Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lejer Navn
            </label>
            <input
              type="text"
              required
              value={formData.tenantName}
              onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Indtast lejer navn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Vejnavn 123, 1234 København"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dato for Indflytningssyn
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={formData.inspectionDate}
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-3 h-6 w-6 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Næste
          </button>
        </form>
      </div>
    </div>
  )
}
