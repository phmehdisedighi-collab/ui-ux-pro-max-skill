import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createPayment } from '@/lib/zarinpal'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { serviceId, date, time, platform, name, email, phone, notes, locale } = body

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get service price from DB (or use hardcoded fallback for now)
    const prices: Record<string, number> = {
      'session-30': 990000,
      'session-60': 1790000,
    }
    const amount = prices[serviceId]
    if (!amount) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/book/verify`
    const description = locale === 'fa'
      ? `رزرو مشاوره هوش مصنوعی — ${name}`
      : `AI Consultation Booking — ${name}`

    const { authority, url } = await createPayment(
      amount,
      description,
      callbackUrl,
      email,
      phone
    )

    // Store pending payment in session/cookie for verification
    const response = NextResponse.json({ paymentUrl: url })
    response.cookies.set('pending_booking', JSON.stringify({
      authority,
      serviceId,
      date,
      time,
      platform,
      name,
      email,
      phone,
      notes,
      amount,
      userId: user?.id,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 30, // 30 minutes
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Payment create error:', err)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
