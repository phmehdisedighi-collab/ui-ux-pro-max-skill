'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function HeroSection() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const isRtl = locale === 'fa'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Radial glow background */}
      <div className="absolute inset-0 hero-radial pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gold orb top */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[rgba(201,168,76,0.04)] rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="animate-fade-in">
          <Badge className="mb-8 text-xs uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] me-2 animate-pulse" />
            {t('badge')}
          </Badge>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in animate-delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: isRtl ? 'Vazirmatn' : 'Playfair Display, serif' }}
        >
          {t('title')}
          <br />
          <span className="text-gold-gradient">{t('titleHighlight')}</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in animate-delay-200 text-lg md:text-xl text-[#9B9489] max-w-2xl mx-auto leading-relaxed mb-10">
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div className={`animate-fade-in animate-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
          <Link href={`/${locale}/book`}>
            <Button variant="gold" size="lg" className="min-w-[180px]">
              {t('cta')}
            </Button>
          </Link>
          <a href={`#services`}>
            <Button variant="outline" size="lg" className="min-w-[180px]">
              {t('ctaSecondary')}
            </Button>
          </a>
        </div>

        {/* Trust bar */}
        <div className="animate-fade-in animate-delay-400 mt-16 flex flex-wrap items-center justify-center gap-8">
          {[
            { value: '۵۰+', label: locale === 'fa' ? 'مشتری' : '50+ Clients' },
            { value: '۲۰۰+', label: locale === 'fa' ? 'جلسه' : '200+ Sessions' },
            { value: '۱۰+', label: locale === 'fa' ? 'صنعت' : '10+ Industries' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-gold-gradient">{stat.value}</div>
              <div className="text-xs text-[#6B6560] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in animate-delay-500 mt-16 flex justify-center">
          <a href="#services" aria-label="Scroll down">
            <div className="flex flex-col items-center gap-2 text-[#6B6560] hover:text-[#C9A84C] transition-colors">
              <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
