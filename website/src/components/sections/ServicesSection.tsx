'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function ServiceCard({
  icon,
  title,
  description,
  badge,
  badgeVariant,
  cta,
  ctaHref,
  active,
}: {
  icon: React.ReactNode
  title: string
  description: string
  badge: string
  badgeVariant: 'gold' | 'muted'
  cta?: string
  ctaHref?: string
  active?: boolean
}) {
  return (
    <div
      className={`relative p-8 rounded-lg transition-all duration-300 group ${
        active
          ? 'card-luxury gold-border-glow hover:border-[rgba(201,168,76,0.5)]'
          : 'card-luxury gold-border hover:border-[rgba(201,168,76,0.3)]'
      }`}
    >
      {active && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[rgba(201,168,76,0.04)] to-transparent pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
          active ? 'bg-[rgba(201,168,76,0.15)]' : 'bg-[rgba(255,255,255,0.05)]'
        }`}>
          {icon}
        </div>

        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold text-[#F7F3EE]">{title}</h3>
          <Badge variant={badgeVariant} className="shrink-0">{badge}</Badge>
        </div>

        <p className="text-[#9B9489] leading-relaxed mb-6">{description}</p>

        {cta && ctaHref && active && (
          <Link href={ctaHref}>
            <Button variant="outline" size="sm" className="w-full mt-2">{cta}</Button>
          </Link>
        )}

        {!active && (
          <div className="text-xs text-[#6B6560] mt-2">{badge}</div>
        )}
      </div>
    </div>
  )
}

export function ServicesSection() {
  const t = useTranslations('services')
  const locale = useLocale()

  const services = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: t('consultation.title'),
      description: t('consultation.description'),
      badge: t('consultation.badge'),
      badgeVariant: 'gold' as const,
      cta: locale === 'fa' ? 'رزرو جلسه' : 'Book Session',
      ctaHref: `/${locale}/book`,
      active: true,
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#6B6560]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t('workshop.title'),
      description: t('workshop.description'),
      badge: t('workshop.badge'),
      badgeVariant: 'muted' as const,
      active: false,
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#6B6560]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.867V15.1a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: t('webinar.title'),
      description: t('webinar.description'),
      badge: t('webinar.badge'),
      badgeVariant: 'muted' as const,
      active: false,
    },
  ]

  return (
    <section id="services" className="py-24 px-6 section-divider">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] mb-4">{t('title')}</p>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#F7F3EE]"
            style={{ fontFamily: locale === 'fa' ? 'Vazirmatn' : 'Playfair Display, serif' }}
          >
            {t('subtitle')}
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}
