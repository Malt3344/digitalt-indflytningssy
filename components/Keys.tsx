'use client'

import { useState } from 'react'
import { Key } from 'lucide-react'

interface KeysProps {
  data: {
    keyCount: string
    keyNotes: string
  }
  onNext: (data: { keyCount: string; keyNotes: string }) => void
  onBack: () => void
}

export default function Keys({ data, onNext, onBack }: KeysProps) {
  const [formData, setFormData] = useState(data)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Key className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Nøgler</h2>
            <p className="text-gray-600">Dokumentér antal nøgler og deres typer</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antal Nøgler Udleveret
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.keyCount}
              onChange={(e) => setFormData({ ...formData, keyCount: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              placeholder="f.eks. 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beskrivelse af Nøgler
            </label>
            <textarea
              value={formData.keyNotes}
              onChange={(e) => setFormData({ ...formData, keyNotes: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Beskriv nøglerne (f.eks. '2 stk. hoveddør, 1 stk. postkasse, 1 stk. kælder')"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Specificér typen af nøgler (hoveddør, postkasse, 
              kælder, cykelrum, osv.) og noter eventuelle nøglebrikker eller chips.
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
              Næste
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
