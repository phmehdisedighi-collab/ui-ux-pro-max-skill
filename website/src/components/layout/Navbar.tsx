'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getMockUser, clearMockUser, type MockUser } from '@/lib/mock-auth'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<MockUser | null>(null)
  const locale = useLocale()
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const isRtl = locale === 'fa'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setUser(getMockUser())
  }, [pathname])

  const handleLogout = () => {
    clearMockUser()
    setUser(null)
    router.push(`/${locale}`)
  }

  const otherLocale = locale === 'fa' ? 'en' : 'fa'
  const switchLocale = () => {
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`)
    router.push(newPath)
  }

  const navLinks = [
    { href: `/${locale}#services`, label: t('services') },
    { href: `/${locale}#about`, label: t('about') },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(13,13,13,0.95)] backdrop-blur-md border-b border-[rgba(201,168,76,0.12)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Wordmark */}
        <Link
          href={`/${locale}`}
          className="text-lg font-bold tracking-wide text-gold-gradient"
          style={{ fontFamily: isRtl ? 'Vazirmatn' : 'Playfair Display, serif' }}
        >
          AI CONSULT
        </Link>

        {/* Desktop Nav */}
        <div className={`hidden md:flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#9B9489] hover:text-[#F7F3EE] transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}

          {/* Language toggle */}
          <button
            onClick={switchLocale}
            className="text-xs border border-[rgba(201,168,76,0.25)] text-[#C9A84C] px-2.5 py-1 rounded-full hover:bg-[rgba(201,168,76,0.08)] transition-colors cursor-pointer"
            aria-label="Switch language"
          >
            {otherLocale === 'fa' ? 'فا' : 'EN'}
          </button>

          {user ? (
            <>
              <Link href={`/${locale}/dashboard`}>
                <Button variant="ghost" size="sm">{t('dashboard')}</Button>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-[#9B9489] hover:text-[#F7F3EE] transition-colors cursor-pointer"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <Link href={`/${locale}/auth/login`}>
              <Button variant="ghost" size="sm">{t('login')}</Button>
            </Link>
          )}
          <Link href={`/${locale}/book`}>
            <Button variant="gold" size="sm">{t('book')}</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#D6D0C8] p-2 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[rgba(13,13,13,0.98)] backdrop-blur-md border-b border-[rgba(201,168,76,0.12)] px-6 pb-6 pt-2">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[#D6D0C8] hover:text-[#F7F3EE] py-2 border-b border-[rgba(255,255,255,0.05)]"
              >
                {link.label}
              </a>
            ))}
            <button onClick={switchLocale} className="text-[#C9A84C] text-sm text-start py-2">
              {otherLocale === 'fa' ? 'فارسی' : 'English'}
            </button>
            {user ? (
              <>
                <Link href={`/${locale}/dashboard`} onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">{t('dashboard')}</Button>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="text-[#9B9489] hover:text-[#F7F3EE] text-start py-2"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <Link href={`/${locale}/auth/login`} onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">{t('login')}</Button>
              </Link>
            )}
            <Link href={`/${locale}/book`} onClick={() => setMobileOpen(false)}>
              <Button variant="gold" className="w-full">{t('book')}</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
