'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Home, LogOut, User } from 'lucide-react'
import Logo from '@/components/marketing/Logo'
import type { UserProfile } from '@/lib/types'

export default function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  // Don't show nav on auth pages or onboarding
  if (pathname?.startsWith('/auth') || pathname === '/onboarding') {
    return null
  }

  if (!user) {
    return null
  }

  const navItems = [
    { href: '/', label: 'Hjem', icon: Home },
    { href: '/abonnement', label: 'Konto', icon: User },
  ]

  const hasActiveSubscription = 
    profile?.subscription_status === 'active' || 
    profile?.subscription_status === 'trialing'

  return (
    <>
      {/* Mobile Top Header - Brand */}
      <header className="md:hidden sticky top-0 bg-white border-b border-line z-40">
        <div className="flex items-center justify-center h-14">
          <Logo />
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-line z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? 'text-brand-700' : 'text-ink-muted'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-4 py-2 text-ink-muted"
          >
            <LogOut size={22} />
            <span className="text-xs font-medium">Log ud</span>
          </button>
        </div>
      </nav>

      {/* Desktop Top Navigation */}
      <nav className="hidden md:block bg-white border-b border-line sticky top-0 z-50">
        <div className="container-page">
          <div className="flex justify-between items-center h-16">
            <Logo />

            <div className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
              >
                Log ud
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
