'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, formatPrice } from '@/lib/utils'

// Placeholder service data — replace with Supabase query when configured
const SERVICES = [
  {
    id: 'session-30',
    duration: 30,
    price: 990000,
    nameKey: 'min30' as const,
    descKey: 'placeholder30' as const,
  },
  {
    id: 'session-60',
    duration: 60,
    price: 1790000,
    nameKey: 'min60' as const,
    descKey: 'placeholder60' as const,
  },
]

// Placeholder time slots
const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

// Next 14 days
function getAvailableDates() {
  const dates: Date[] = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (d.getDay() !== 5 && d.getDay() !== 6) dates.push(d) // skip Friday/Saturday
  }
  return dates
}

type Step = 'service' | 'datetime' | 'info' | 'pay' | 'success'

export default function BookPage() {
  const t = useTranslations('booking')
  const locale = useLocale()
  const isRtl = locale === 'fa'

  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [platform, setPlatform] = useState<'google_meet' | 'zoom'>('google_meet')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const dates = getAvailableDates()
  const service = SERVICES.find((s) => s.id === selectedService)

  const steps: { key: Step; label: string }[] = [
    { key: 'service', label: locale === 'fa' ? 'نوع جلسه' : 'Session' },
    { key: 'datetime', label: locale === 'fa' ? 'تاریخ و ساعت' : 'Date & Time' },
    { key: 'info', label: locale === 'fa' ? 'اطلاعات' : 'Info' },
    { key: 'pay', label: locale === 'fa' ? 'پرداخت' : 'Payment' },
  ]
  const stepIndex = steps.findIndex((s) => s.key === step)

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date)

  const handlePayment = async () => {
    if (!service || !selectedDate || !selectedTime) return
    setLoading(true)
    // Demo mode — simulate a payment gateway round-trip, then confirm.
    // Replace this with a real ZarinPal redirect once a merchant ID is set.
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLoading(false)
    setStep('success')
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-[#C9A84C] mb-3">{t('title')}</p>
            <h1
              className="text-3xl font-bold text-[#F7F3EE]"
              style={{ fontFamily: isRtl ? 'Vazirmatn' : 'Playfair Display, serif' }}
            >
              {t('subtitle')}
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center mb-10 gap-0">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all',
                  i < stepIndex
                    ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0D0D0D]'
                    : i === stepIndex
                    ? 'border-[#C9A84C] text-[#C9A84C]'
                    : 'border-[rgba(255,255,255,0.1)] text-[#6B6560]'
                )}>
                  {i < stepIndex ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="hidden sm:block mx-1 text-xs text-[#6B6560]">{s.label}</div>
                {i < steps.length - 1 && (
                  <div className={cn('w-8 h-px mx-1 transition-all', i < stepIndex ? 'bg-[#C9A84C]' : 'bg-[rgba(255,255,255,0.1)]')} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="card-luxury gold-border rounded-lg p-8">

            {/* Step 1: Select service */}
            {step === 'service' && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-[#F7F3EE] mb-2">{t('selectService')}</h2>
                {SERVICES.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className={cn(
                      'w-full text-start p-5 rounded-lg border transition-all cursor-pointer',
                      selectedService === svc.id
                        ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.06)]'
                        : 'border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)]'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {selectedService === svc.id && (
                            <div className="w-4 h-4 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0">
                              <div className="w-2 h-2 rounded-full bg-[#0D0D0D]" />
                            </div>
                          )}
                          <span className="font-semibold text-[#F7F3EE]">{t(svc.nameKey)}</span>
                          <span className="text-xs text-[#9B9489]">({svc.duration} {locale === 'fa' ? 'دقیقه' : 'min'})</span>
                        </div>
                        <p className="text-sm text-[#9B9489]">{t(svc.descKey)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[#C9A84C] font-bold">{formatPrice(svc.price, locale)}</div>
                      </div>
                    </div>
                  </button>
                ))}
                <Button
                  variant="gold"
                  className="w-full mt-4"
                  disabled={!selectedService}
                  onClick={() => setStep('datetime')}
                >
                  {locale === 'fa' ? 'ادامه' : 'Continue'}
                </Button>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 'datetime' && (
              <div>
                <h2 className="text-lg font-semibold text-[#F7F3EE] mb-6">{t('selectDate')}</h2>

                {/* Date picker */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
                  {dates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        'p-3 rounded-lg border text-center text-sm transition-all cursor-pointer',
                        selectedDate?.toDateString() === date.toDateString()
                          ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.08)] text-[#C9A84C]'
                          : 'border-[rgba(201,168,76,0.15)] text-[#9B9489] hover:border-[rgba(201,168,76,0.4)]'
                      )}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>

                {/* Time picker */}
                {selectedDate && (
                  <>
                    <h2 className="text-lg font-semibold text-[#F7F3EE] mb-4">{t('selectTime')}</h2>
                    <div className="grid grid-cols-4 gap-2 mb-8">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={cn(
                            'py-2.5 rounded-lg border text-sm transition-all cursor-pointer',
                            selectedTime === slot
                              ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.08)] text-[#C9A84C]'
                              : 'border-[rgba(201,168,76,0.15)] text-[#9B9489] hover:border-[rgba(201,168,76,0.4)]'
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Button variant="ghost" onClick={() => setStep('service')}>{locale === 'fa' ? 'بازگشت' : 'Back'}</Button>
                  <Button
                    variant="gold"
                    className="flex-1"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep('info')}
                  >
                    {locale === 'fa' ? 'ادامه' : 'Continue'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: User info */}
            {step === 'info' && (
              <div>
                <h2 className="text-lg font-semibold text-[#F7F3EE] mb-6">{t('yourInfo')}</h2>
                <div className="flex flex-col gap-4">
                  <Input label={t('name')} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
                  <Input label={t('email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                  <Input label={t('phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />

                  {/* Platform picker */}
                  <div>
                    <label className="text-sm font-medium text-[#D6D0C8] block mb-2">{t('platform')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['google_meet', 'zoom'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlatform(p)}
                          className={cn(
                            'py-3 rounded-lg border text-sm transition-all cursor-pointer',
                            platform === p
                              ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.08)] text-[#C9A84C]'
                              : 'border-[rgba(201,168,76,0.15)] text-[#9B9489] hover:border-[rgba(201,168,76,0.4)]'
                          )}
                        >
                          {p === 'google_meet' ? t('googleMeet') : t('zoom')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#D6D0C8] block mb-1.5">{t('notes')}</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-sm bg-[#141414] border border-[rgba(201,168,76,0.2)] text-[#F7F3EE] placeholder:text-[#6B6560] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none"
                      placeholder={locale === 'fa' ? 'هر چیزی که لازم است بدانم...' : 'Anything I should know...'}
                    />
                  </div>
                </div>

                <div className={`flex gap-3 mt-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Button variant="ghost" onClick={() => setStep('datetime')}>{locale === 'fa' ? 'بازگشت' : 'Back'}</Button>
                  <Button
                    variant="gold"
                    className="flex-1"
                    disabled={!name || !email}
                    onClick={() => setStep('pay')}
                  >
                    {locale === 'fa' ? 'ادامه' : 'Continue'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirm & Pay */}
            {step === 'pay' && service && selectedDate && selectedTime && (
              <div>
                <h2 className="text-lg font-semibold text-[#F7F3EE] mb-6">
                  {locale === 'fa' ? 'تأیید و پرداخت' : 'Review & Pay'}
                </h2>

                {/* Summary */}
                <div className="bg-[#111] rounded-lg p-5 mb-6 space-y-3 border border-[rgba(201,168,76,0.1)]">
                  {[
                    { label: locale === 'fa' ? 'نوع جلسه' : 'Session', value: t(service.nameKey) },
                    { label: locale === 'fa' ? 'تاریخ' : 'Date', value: formatDate(selectedDate) },
                    { label: locale === 'fa' ? 'ساعت' : 'Time', value: selectedTime },
                    { label: locale === 'fa' ? 'پلتفرم' : 'Platform', value: platform === 'google_meet' ? t('googleMeet') : t('zoom') },
                    { label: locale === 'fa' ? 'نام' : 'Name', value: name },
                    { label: locale === 'fa' ? 'ایمیل' : 'Email', value: email },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-[#6B6560]">{label}</span>
                      <span className="text-[#D6D0C8]">{value}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-[rgba(201,168,76,0.1)] flex justify-between font-bold">
                    <span className="text-[#D6D0C8]">{t('priceLabel')}</span>
                    <span className="text-[#C9A84C]">{formatPrice(service.price, locale)}</span>
                  </div>
                </div>

                <p className="text-xs text-[#6B6560] mb-6 text-center">
                  {locale === 'fa'
                    ? 'پس از پرداخت موفق، رزرو شما تأیید و لینک جلسه به ایمیلتان ارسال می‌شود.'
                    : 'After successful payment, your booking is confirmed and the meeting link will be emailed to you.'}
                </p>

                <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Button variant="ghost" onClick={() => setStep('info')}>{locale === 'fa' ? 'بازگشت' : 'Back'}</Button>
                  <Button variant="gold" className="flex-1" loading={loading} onClick={handlePayment}>
                    {t('pay')}
                  </Button>
                </div>

                <p className="text-[11px] text-[#6B6560] mt-4 text-center opacity-70">
                  {locale === 'fa'
                    ? 'نسخه نمایشی — پرداخت واقعی انجام نمی‌شود'
                    : 'Demo mode — no real payment is processed'}
                </p>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 'success' && service && selectedDate && selectedTime && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-[rgba(201,168,76,0.12)] flex items-center justify-center mx-auto mb-6 gold-border">
                  <svg className="w-8 h-8 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-[#F7F3EE] mb-3">{t('success')}</h2>
                <p className="text-[#9B9489] mb-8">{t('successMessage')}</p>

                {/* Summary */}
                <div className="bg-[#111] rounded-lg p-5 mb-8 space-y-3 border border-[rgba(201,168,76,0.1)] text-start">
                  {[
                    { label: locale === 'fa' ? 'نوع جلسه' : 'Session', value: t(service.nameKey) },
                    { label: locale === 'fa' ? 'تاریخ' : 'Date', value: formatDate(selectedDate) },
                    { label: locale === 'fa' ? 'ساعت' : 'Time', value: selectedTime },
                    { label: locale === 'fa' ? 'پلتفرم' : 'Platform', value: platform === 'google_meet' ? t('googleMeet') : t('zoom') },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-[#6B6560]">{label}</span>
                      <span className="text-[#D6D0C8]">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/${locale}/dashboard`}>
                    <Button variant="gold" className="w-full sm:w-auto">
                      {locale === 'fa' ? 'مشاهده داشبورد' : 'View Dashboard'}
                    </Button>
                  </Link>
                  <Link href={`/${locale}`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      {locale === 'fa' ? 'صفحه اصلی' : 'Home'}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
