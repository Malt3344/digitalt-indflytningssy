'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  Home, 
  FileText, 
  CreditCard, 
  LogOut, 
  Menu, 
  X,
  User 
} from 'lucide-react'
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
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 ${
                  isActive ? 'text-black' : 'text-gray-500'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500"
          >
            <LogOut size={22} />
            <span className="text-xs font-medium">Ud</span>
          </button>
        </div>
      </nav>

      {/* Desktop Top Navigation */}
      <nav className="hidden md:block bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl text-gray-900">
                Indflytningssyn
              </span>
            </Link>

            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium ${
                      isActive ? 'text-black' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-black"
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
