import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import type { Package, Slot } from '@/lib/types';
import { BookingClient } from './BookingClient';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: pkgData }, { data: slotData }] = await Promise.all([
    supabase
      .from('consultation_packages')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('availability_slots')
      .select('*')
      .eq('status', 'open')
      .gte('start_at', new Date().toISOString())
      .order('start_at'),
  ]);

  return (
    <BookingClient
      packages={(pkgData as Package[]) ?? []}
      slots={(slotData as Slot[]) ?? []}
      authed={!!user}
    />
  );
}
