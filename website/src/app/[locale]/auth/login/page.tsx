'use client'

import { useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(locale === 'fa' ? 'ایمیل یا رمز عبور اشتباه است' : 'Invalid email or password')
      } else {
        router.push(`/${locale}/dashboard`)
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6">
      {/* Background glow */}
      <div className="absolute inset-0 hero-radial pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href={`/${locale}`}>
            <span
              className="text-2xl font-bold text-gold-gradient"
              style={{ fontFamily: locale === 'fa' ? 'Vazirmatn' : 'Playfair Display, serif' }}
            >
              AI CONSULT
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-[#F7F3EE] mt-6 mb-2">{t('login')}</h1>
        </div>

        {/* Card */}
        <div className="card-luxury gold-border p-8 rounded-lg">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" variant="gold" className="w-full mt-2" loading={isPending}>
              {t('loginCta')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B6560]">
            {t('noAccount')}{' '}
            <Link href={`/${locale}/auth/register`} className="text-[#C9A84C] hover:text-[#E8C97A] transition-colors">
              {t('signUp')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
