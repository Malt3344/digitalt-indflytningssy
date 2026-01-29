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
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gray-100 rounded-xl">
            <Key className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nøgler</h2>
            <p className="text-gray-500 text-sm">Dokumentér antal nøgler og deres typer</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Antal nøgler udleveret
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.keyCount}
              onChange={(e) => setFormData({ ...formData, keyCount: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors text-lg"
              placeholder="f.eks. 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Beskrivelse af nøgler
            </label>
            <textarea
              value={formData.keyNotes}
              onChange={(e) => setFormData({ ...formData, keyNotes: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors resize-none"
              placeholder="Beskriv nøglerne (f.eks. '2 stk. hoveddør, 1 stk. postkasse, 1 stk. kælder')"
            />
          </div>

          <div className="bg-yellow-50 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Specificér typen af nøgler (hoveddør, postkasse, 
              kælder, cykelrum, osv.) og noter eventuelle nøglebrikker eller chips.
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
