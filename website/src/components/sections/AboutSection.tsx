'use client'

import { useTranslations, useLocale } from 'next-intl'

export function AboutSection() {
  const t = useTranslations('about')
  const locale = useLocale()
  const isRtl = locale === 'fa'

  return (
    <section id="about" className="py-24 px-6 section-divider">
      <div className="max-w-6xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRtl ? 'lg:flex lg:flex-row-reverse' : ''}`}>
          {/* Photo placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] max-w-sm mx-auto lg:mx-0 rounded-lg bg-[#141414] gold-border overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-[rgba(201,168,76,0.1)] flex items-center justify-center mx-auto mb-4 gold-border">
                  <svg className="w-10 h-10 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-xs text-[#6B6560]">
                  {locale === 'fa' ? 'عکس به‌زودی اضافه می‌شود' : 'Photo coming soon'}
                </p>
              </div>
            </div>
            {/* Decorative gold line */}
            <div className={`absolute top-8 ${isRtl ? 'right-0' : 'left-0'} w-1 h-24 bg-gradient-to-b from-[#C9A84C] to-transparent rounded-full`} />
          </div>

          {/* Content */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C9A84C] mb-4">{t('title')}</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#F7F3EE] mb-6"
              style={{ fontFamily: isRtl ? 'Vazirmatn' : 'Playfair Display, serif' }}
            >
              {t('subtitle')}
            </h2>
            <div className="w-12 h-px bg-[rgba(201,168,76,0.5)] mb-6" />
            <p className="text-[#9B9489] leading-relaxed text-base md:text-lg mb-10">
              {t('placeholder')}
            </p>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-6 pt-8 border-t border-[rgba(201,168,76,0.1)]`}>
              {[
                { value: '۵۰+', label: t('stats.clients'), en: '50+' },
                { value: '۲۰۰+', label: t('stats.sessions'), en: '200+' },
                { value: '۱۰+', label: t('stats.industries'), en: '10+' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gold-gradient">
                    {locale === 'fa' ? stat.value : stat.en}
                  </div>
                  <div className="text-xs text-[#6B6560] mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
