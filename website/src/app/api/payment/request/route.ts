import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requestPayment } from '@/lib/zarinpal';

const HOLD_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    const { packageId, slotId, locale = 'fa' } = await req.json();
    if (!packageId || !slotId) {
      return NextResponse.json({ ok: false, error: 'missing_params' }, { status: 400 });
    }

    // کاربر باید وارد شده باشد
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // پکیج فعال؟
    const { data: pkg } = await admin
      .from('consultation_packages')
      .select('*')
      .eq('id', packageId)
      .eq('is_active', true)
      .single();
    if (!pkg) {
      return NextResponse.json({ ok: false, error: 'invalid_package' }, { status: 400 });
    }

    // نگه‌داشتن اسلات فقط اگر باز (یا hold منقضی‌شده) باشد — جلوگیری از رزرو هم‌زمان
    const holdUntil = new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString();
    const nowIso = new Date().toISOString();
    const { data: heldSlot, error: holdErr } = await admin
      .from('availability_slots')
      .update({ status: 'held', held_until: holdUntil })
      .eq('id', slotId)
      .or(`status.eq.open,and(status.eq.held,held_until.lt.${nowIso})`)
      .select()
      .single();

    if (holdErr || !heldSlot) {
      return NextResponse.json({ ok: false, error: 'slot_unavailable' }, { status: 409 });
    }

    // ساخت رکورد booking + payment
    const { data: booking, error: bErr } = await admin
      .from('bookings')
      .insert({
        user_id: user.id,
        package_id: pkg.id,
        slot_id: slotId,
        meeting_type: 'online',
        status: 'pending',
        amount_toman: pkg.price_toman,
      })
      .select()
      .single();

    if (bErr || !booking) {
      // آزادسازی اسلات در صورت خطا
      await admin.from('availability_slots').update({ status: 'open', held_until: null }).eq('id', slotId);
      return NextResponse.json({ ok: false, error: 'booking_failed' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const callbackUrl = `${siteUrl}/api/payment/verify?b=${booking.id}&l=${locale}`;

    const result = await requestPayment({
      amountToman: pkg.price_toman,
      description: `مشاوره اوج — ${pkg.title_fa}`,
      callbackUrl,
      email: user.email ?? undefined,
    });

    if (!result.ok) {
      await admin.from('availability_slots').update({ status: 'open', held_until: null }).eq('id', slotId);
      await admin.from('bookings').update({ status: 'cancelled' }).eq('id', booking.id);
      return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
    }

    await admin.from('payments').insert({
      booking_id: booking.id,
      gateway: 'zarinpal',
      authority: result.authority,
      amount_toman: pkg.price_toman,
      status: 'pending',
    });

    return NextResponse.json({ ok: true, gatewayUrl: result.gatewayUrl });
  } catch (err) {
    console.error('[payment/request]', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
