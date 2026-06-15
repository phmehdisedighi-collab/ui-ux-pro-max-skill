'use client'

import { useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockRegister } from '@/lib/mock-auth'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(() => {
      // Demo mode — stores user in localStorage
      const user = mockRegister(name, email, password)
      if (!user) {
        setError(locale === 'fa'
          ? 'لطفاً همه فیلدها را پر کنید (رمز حداقل ۶ کاراکتر)'
          : 'Please fill all fields (password min 6 chars)')
      } else {
        router.push(`/${locale}/dashboard`)
      }
    })
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
              helperText={locale === 'fa' ? 'حداقل ۶ کاراکتر' : 'Minimum 6 characters'}
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

        <p className="text-center text-xs text-[#6B6560] mt-6">
          {locale === 'fa'
            ? 'نسخه نمایشی — اطلاعات فقط در مرورگر شما ذخیره می‌شود'
            : 'Demo mode — data is stored only in your browser'}
        </p>
      </div>
    </div>
  )
}
