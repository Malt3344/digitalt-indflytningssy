'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AuthShell from '@/components/marketing/AuthShell'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.replace('/')
      } else {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to home page, middleware will handle routing
      router.push('/')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-line border-t-brand-600"></div>
      </div>
    )
  }

  return (
    <AuthShell>
      <div className="mb-7 text-center lg:text-left">
        <h1 className="font-display text-2xl font-bold tracking-tighter2 text-ink">Log ind</h1>
        <p className="mt-1.5 text-sm text-ink-soft">Lav indflytningssyn nemt og ordentligt</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="din@email.dk"
          />
        </div>

        <div>
          <label className="label">Adgangskode</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary btn-lg mt-2 w-full"
        >
          {loading ? 'Logger ind...' : 'Log ind'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Har du ikke en konto?{' '}
        <a href="/auth/signup" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900">
          Opret konto
        </a>
      </p>
    </AuthShell>
  )
}
