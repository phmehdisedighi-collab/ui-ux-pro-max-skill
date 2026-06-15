import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { verifyPayment } from '@/lib/zarinpal'
import Link from 'next/link'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ Authority?: string; Status?: string }>
}

export default async function VerifyPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { Authority, Status } = await searchParams
  const cookieStore = await cookies()
  const pendingRaw = cookieStore.get('pending_booking')?.value

  if (!Authority || Status !== 'OK' || !pendingRaw) {
    return <PaymentResult success={false} locale={locale} />
  }

  let refId: string | null = null
  try {
    const pending = JSON.parse(pendingRaw)
    const { refId: id } = await verifyPayment(Authority, pending.amount)
    refId = id

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createServerSupabaseClient() as any
    const { data: booking } = await supabase.from('bookings').insert({
      user_id: pending.userId || '00000000-0000-0000-0000-000000000000',
      service_id: pending.serviceId,
      slot_id: pending.slotId || '00000000-0000-0000-0000-000000000000',
      platform: pending.platform,
      notes: pending.notes,
      status: 'confirmed',
    }).select().single()

    if (booking) {
      await supabase.from('payments').insert({
        booking_id: booking.id,
        user_id: pending.userId || '00000000-0000-0000-0000-000000000000',
        amount: pending.amount,
        authority: Authority,
        ref_id: refId,
        status: 'success',
        gateway: 'zarinpal',
      })
    }
  } catch (err) {
    console.error('Verify error:', err)
    return <PaymentResult success={false} locale={locale} />
  }

  return <PaymentResult success={true} locale={locale} refId={refId ?? undefined} />
}

function PaymentResult({
  success,
  locale,
  refId,
}: {
  success: boolean
  locale: string
  refId?: string
}) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border ${
          success
            ? 'bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.3)]'
            : 'bg-red-500/10 border-red-500/20'
        }`}>
          {success ? (
            <svg className="w-10 h-10 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h1 className="text-2xl font-bold text-[#F7F3EE] mb-3">
          {success
            ? (locale === 'fa' ? 'رزرو تأیید شد!' : 'Booking Confirmed!')
            : (locale === 'fa' ? 'پرداخت ناموفق' : 'Payment Failed')}
        </h1>

        <p className="text-[#9B9489] mb-4">
          {success
            ? (locale === 'fa'
                ? 'لینک جلسه به ایمیل شما ارسال شد.'
                : 'The meeting link has been sent to your email.')
            : (locale === 'fa'
                ? 'پرداخت انجام نشد. لطفاً دوباره تلاش کنید.'
                : 'Payment was not completed. Please try again.')}
        </p>

        {success && refId && (
          <p className="text-sm text-[#6B6560] mb-6">
            {locale === 'fa' ? `کد پیگیری: ${refId}` : `Ref ID: ${refId}`}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}`}
            className="px-6 py-2.5 rounded-sm border border-[rgba(201,168,76,0.25)] text-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)] transition-colors text-sm"
          >
            {locale === 'fa' ? 'صفحه اصلی' : 'Home'}
          </Link>
          {!success && (
            <Link
              href={`/${locale}/book`}
              className="px-6 py-2.5 rounded-sm bg-[#C9A84C] text-[#0D0D0D] font-medium hover:bg-[#E8C97A] transition-colors text-sm"
            >
              {locale === 'fa' ? 'تلاش مجدد' : 'Try Again'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
