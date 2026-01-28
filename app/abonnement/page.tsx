'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

interface Stats {
  totalInspections: number
  paidInspections: number
  unpaidInspections: number
}

export default function KontoPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Get inspection stats
      const { data: inspections } = await supabase
        .from('inspections')
        .select('is_paid')
        .eq('landlord_id', user.id)

      if (inspections && Array.isArray(inspections)) {
        setStats({
          totalInspections: inspections.length,
          paidInspections: inspections.filter((i: { is_paid: boolean }) => i.is_paid).length,
          unpaidInspections: inspections.filter((i: { is_paid: boolean }) => !i.is_paid).length,
        })
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Konto</h1>

        {/* User info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Email
          </h2>
          <p className="text-gray-900 font-medium">{user?.email}</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalInspections}</p>
              <p className="text-sm text-gray-500">Syn i alt</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-700">{stats.paidInspections}</p>
              <p className="text-sm text-green-600">Downloadet</p>
            </div>
          </div>
        )}

        {/* Pricing info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Priser</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Første synsrapport</span>
              <span className="font-medium text-green-600">Gratis</span>
            </div>
            <div className="flex justify-between">
              <span>Efterfølgende synsrapporter</span>
              <span className="font-medium text-gray-900">149 kr/stk</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/inspection/new')}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold active:bg-gray-800"
          >
            + Nyt indflytningssyn
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium active:bg-gray-200"
          >
            Log ud
          </button>
        </div>
      </main>
    </div>
  )
}
