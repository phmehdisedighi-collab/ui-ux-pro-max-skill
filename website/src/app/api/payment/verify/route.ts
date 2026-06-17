import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyPayment } from '@/lib/zarinpal';
import { createConsultationEvent } from '@/lib/google-calendar';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const bookingId = url.searchParams.get('b');
  const locale = url.searchParams.get('l') || 'fa';
  const authority = url.searchParams.get('Authority');
  const status = url.searchParams.get('Status');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  const successUrl = `${siteUrl}/${locale}/booking/success?booking=${bookingId}`;
  const failedUrl = `${siteUrl}/${locale}/booking/failed`;

  const admin = createAdminClient();

  async function releaseAndFail(bid: string | null) {
    if (!bid) return;
    const { data: bk } = await admin.from('bookings').select('slot_id').eq('id', bid).single();
    if (bk?.slot_id) {
      await admin.from('availability_slots').update({ status: 'open', held_until: null }).eq('id', bk.slot_id);
    }
    await admin.from('bookings').update({ status: 'cancelled' }).eq('id', bid);
    await admin.from('payments').update({ status: 'failed' }).eq('booking_id', bid);
  }

  try {
    if (!bookingId || !authority) {
      return NextResponse.redirect(failedUrl);
    }

    // کاربر پرداخت را لغو کرد
    if (status !== 'OK') {
      await releaseAndFail(bookingId);
      return NextResponse.redirect(failedUrl);
    }

    // مبلغ را از روی booking می‌خوانیم (منبع معتبر، نه ورودی کاربر)
    const { data: booking } = await admin
      .from('bookings')
      .select('*, consultation_packages(title_fa,title_en,duration_min), availability_slots(start_at,end_at)')
      .eq('id', bookingId)
      .single();

    if (!booking) {
      return NextResponse.redirect(failedUrl);
    }

    // اگر قبلاً تأیید شده، مستقیم به موفقیت
    if (booking.status === 'confirmed') {
      return NextResponse.redirect(successUrl);
    }

    const verify = await verifyPayment({
      authority,
      amountToman: booking.amount_toman,
    });

    if (!verify.ok) {
      await releaseAndFail(bookingId);
      return NextResponse.redirect(failedUrl);
    }

    // ساخت رویداد Google Calendar + Meet (در صورت تنظیم اعتبارنامه)
    let meetLink: string | null = null;
    let gcalEventId: string | null = null;
    const slot = (booking as any).availability_slots;
    const pkg = (booking as any).consultation_packages;
    if (slot?.start_at && slot?.end_at) {
      const { data: u } = await admin.auth.admin.getUserById(booking.user_id);
      const event = await createConsultationEvent({
        summary: `مشاوره اوج — ${pkg?.title_fa ?? ''}`,
        description: 'جلسه مشاوره رشد کلینیک با مهدی صدیقی (آکادمی اوج).',
        startAt: slot.start_at,
        endAt: slot.end_at,
        attendeeEmail: u?.user?.email ?? undefined,
      });
      meetLink = event?.meetLink ?? null;
      gcalEventId = event?.eventId ?? null;
    }

    await admin
      .from('payments')
      .update({ status: 'success', ref_id: verify.refId })
      .eq('booking_id', bookingId);

    await admin
      .from('bookings')
      .update({ status: 'confirmed', meet_link: meetLink, gcal_event_id: gcalEventId })
      .eq('id', bookingId);

    if (booking.slot_id) {
      await admin.from('availability_slots').update({ status: 'booked', held_until: null }).eq('id', booking.slot_id);
    }

    return NextResponse.redirect(successUrl);
  } catch (err) {
    console.error('[payment/verify]', err);
    await releaseAndFail(bookingId);
    return NextResponse.redirect(failedUrl);
  }
}
