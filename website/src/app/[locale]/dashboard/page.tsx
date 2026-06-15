'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'
import { getMockUser, type MockUser } from '@/lib/mock-auth'
import { MOCK_BOOKINGS } from '@/lib/mock-data'

type Variant = 'gold' | 'success' | 'muted' | 'outline'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const router = useRouter()
  const [user, setUser] = useState<MockUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const u = getMockUser()
    if (!u) {
      router.replace(`/${locale}/auth/login`)
      return
    }
    setUser(u)
    setReady(true)
  }, [locale, router])

  if (!ready || !user) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const now = new Date()
  const upcoming = MOCK_BOOKINGS.filter((b) => b.status === 'confirmed' && b.date > now)
  const past = MOCK_BOOKINGS.filter((b) => b.status === 'completed' || b.date <= now)

  const statusBadge = (status: string): Variant => {
    const map: Record<string, Variant> = {
      confirmed: 'gold',
      completed: 'success',
      pending: 'outline',
      cancelled: 'muted',
    }
    return map[status] || 'muted'
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1
              className="text-3xl font-bold text-[#F7F3EE] mb-2"
              style={{ fontFamily: locale === 'fa' ? 'Vazirmatn' : 'Playfair Display, serif' }}
            >
              {t('title')}
            </h1>
            <p className="text-[#6B6560] text-sm">{user.email}</p>
          </div>

          {/* Upcoming */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-[#D6D0C8] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              {t('upcoming')}
            </h2>

            {upcoming.length === 0 ? (
              <div className="card-luxury gold-border rounded-lg p-10 text-center">
                <p className="text-[#9B9489] mb-6">{t('noBookings')}</p>
                <Link
                  href={`/${locale}/book`}
                  className="inline-flex items-center px-6 py-2.5 rounded-sm bg-[#C9A84C] text-[#0D0D0D] font-medium hover:bg-[#E8C97A] transition-colors text-sm"
                >
                  {t('bookNow')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} locale={locale} t={t} statusBadge={statusBadge} />
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-[#D6D0C8] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6B6560]" />
                {t('past')}
              </h2>
              <div className="space-y-4">
                {past.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} locale={locale} t={t} statusBadge={statusBadge} past />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface BookingCardProps {
  booking: (typeof MOCK_BOOKINGS)[number]
  locale: string
  t: (key: string) => string
  statusBadge: (s: string) => Variant
  past?: boolean
}

function BookingCard({ booking, locale, t, statusBadge, past = false }: BookingCardProps) {
  return (
    <div className={`card-luxury rounded-lg p-6 border transition-all ${past ? 'opacity-60' : 'gold-border hover:border-[rgba(201,168,76,0.4)]'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-[#F7F3EE]">
              {locale === 'fa' ? booking.service.name_fa : booking.service.name_en}
            </h3>
            <Badge variant={statusBadge(booking.status)}>
              {t(`status.${booking.status}`)}
            </Badge>
          </div>

          <p className="text-sm text-[#9B9489]">{formatDateTime(booking.date, locale)}</p>

          <p className="text-xs text-[#6B6560] mt-1">
            {booking.platform === 'google_meet' ? 'Google Meet' : 'Zoom'}
          </p>
        </div>

        {booking.meeting_link && !past && (
          <a
            href={booking.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 text-sm rounded-sm bg-[rgba(201,168,76,0.12)] text-[#C9A84C] border border-[rgba(201,168,76,0.25)] hover:bg-[rgba(201,168,76,0.2)] transition-colors"
          >
            {t('joinMeeting')}
          </a>
        )}
      </div>
    </div>
  )
}
