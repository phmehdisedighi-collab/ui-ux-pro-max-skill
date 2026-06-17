import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import type { Booking } from '@/lib/types';

export default async function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ booking?: string }>;
}) {
  const { locale } = await params;
  const { booking: bookingId } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('booking');

  let booking: Booking | null = null;
  if (bookingId) {
    const supabase = await createClient();
    const { data } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
    booking = (data as Booking) || null;
  }

  return (
    <section className="section grid min-h-[60vh] place-items-center py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal text-3xl text-white">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-black text-surmei">{t('successTitle')}</h1>
        <p className="mt-4 text-ink/75">{t('successBody')}</p>

        {booking?.meet_link && (
          <a
            href={booking.meet_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient mt-7"
          >
            {t('meetLink')}
          </a>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/dashboard" className="btn-owj">{t('goDashboard')}</Link>
          <Link href="/" className="text-sm font-bold text-surmei hover:text-orange">
            {t('backHome')}
          </Link>
        </div>
      </div>
    </section>
  );
}
