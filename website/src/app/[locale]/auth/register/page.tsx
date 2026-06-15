'use client'

import { useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      })
      if (authError) {
        setError(authError.message)
      } else {
        setSuccess(true)
      }
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[rgba(201,168,76,0.12)] flex items-center justify-center mx-auto mb-6 gold-border">
            <svg className="w-8 h-8 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#F7F3EE] mb-3">
            {locale === 'fa' ? 'حساب ایجاد شد!' : 'Account Created!'}
          </h2>
          <p className="text-[#9B9489] mb-8">
            {locale === 'fa'
              ? 'ایمیل تأیید به آدرس شما ارسال شد. بعد از تأیید وارد شوید.'
              : 'A confirmation email was sent. Please verify and then sign in.'}
          </p>
          <Link href={`/${locale}/auth/login`}>
            <Button variant="gold">{t('signIn')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6">
      <div className="absolute inset-0 hero-radial pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <Link href={`/${locale}`}>
            <span
              className="text-2xl font-bold text-gold-gradient"
              style={{ fontFamily: locale === 'fa' ? 'Vazirmatn' : 'Playfair Display, serif' }}
            >
              AI CONSULT
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-[#F7F3EE] mt-6">{t('register')}</h1>
        </div>

        <div className="card-luxury gold-border p-8 rounded-lg">
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <Input
              label={t('name')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={locale === 'fa' ? 'نام و نام‌خانوادگی' : 'Full Name'}
              required
              autoComplete="name"
            />
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
              autoComplete="new-password"
              helperText={locale === 'fa' ? 'حداقل ۸ کاراکتر' : 'Minimum 8 characters'}
            />

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" variant="gold" className="w-full mt-2" loading={isPending}>
              {t('registerCta')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B6560]">
            {t('hasAccount')}{' '}
            <Link href={`/${locale}/auth/login`} className="text-[#C9A84C] hover:text-[#E8C97A] transition-colors">
              {t('signIn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
