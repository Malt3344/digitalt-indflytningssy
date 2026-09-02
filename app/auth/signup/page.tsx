'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AuthShell from '@/components/marketing/AuthShell'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Adgangskoderne matcher ikke')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Adgangskoden skal være mindst 6 tegn')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (error: any) {
      // Handle Supabase error objects properly
      const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error))
      setError(errorMessage)
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

  if (success) {
    return (
      <AuthShell>
        <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-100">
            <svg className="h-7 w-7 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tighter2 text-ink">Konto oprettet</h2>
          <p className="mt-2 text-ink-soft">
            Tjek din email for at bekræfte din konto.
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Du bliver omdirigeret til login...
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div className="mb-7 text-center lg:text-left">
        <h1 className="font-display text-2xl font-bold tracking-tighter2 text-ink">Opret konto</h1>
        <p className="mt-1.5 text-sm text-ink-soft">Første indflytningssyn er gratis</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
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
            placeholder="Mindst 6 tegn"
          />
        </div>

        <div>
          <label className="label">Bekræft adgangskode</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            placeholder="Gentag adgangskode"
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
          {loading ? 'Opretter konto...' : 'Opret konto'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Har du allerede en konto?{' '}
        <a href="/auth/login" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900">
          Log ind
        </a>
      </p>
    </AuthShell>
  )
}
