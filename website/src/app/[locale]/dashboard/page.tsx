import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/SectionHeading';
import { LogoutButton } from '@/components/LogoutButton';

type Row = {
  id: string;
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
  amount_toman: number;
  meet_link: string | null;
  created_at: string;
  consultation_packages: { title_fa: string; title_en: string } | null;
  availability_slots: { start_at: string } | null;
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dashboard');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/login', locale });

  const { data } = await supabase
    .from('bookings')
    .select('id,status,amount_toman,meet_link,created_at,consultation_packages(title_fa,title_en),availability_slots(start_at)')
    .order('created_at', { ascending: false });
  const rows = (data as unknown as Row[]) || [];

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(n);
  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));

  const statusClass: Record<Row['status'], string> = {
    pending: 'bg-graylight text-ink/60',
    paid: 'bg-gold/15 text-gold',
    confirmed: 'bg-teal/15 text-teal',
    cancelled: 'bg-orange/10 text-orange',
  };

  return (
    <section className="section py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading title={t('title')} />
        <LogoutButton />
      </div>
      <p className="mt-4 text-ink/70">
        {t('welcome')}, <span className="font-bold text-surmei">{user!.email}</span>
      </p>

      <div className="mt-10 flex items-center justify-between">
        <h3 className="text-lg font-black text-surmei">{t('myBookings')}</h3>
        <Link href="/booking" className="btn-owj px-5 py-2 text-sm">{t('bookNew')}</Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-owj bg-graylight p-6 text-center text-sm text-ink/60">
          {t('noBookings')}
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-4 rounded-owj border border-black/5 bg-white p-5 shadow-sm">
              <div>
                <div className="font-black text-surmei">
                  {r.consultation_packages
                    ? locale === 'fa'
                      ? r.consultation_packages.title_fa
                      : r.consultation_packages.title_en
                    : '—'}
                </div>
                <div className="mt-1 text-xs text-ink/55">
                  {r.availability_slots ? fmtDate(r.availability_slots.start_at) : fmtDate(r.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-ink/70">{fmtPrice(r.amount_toman)}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[r.status]}`}>
                  {t(`status.${r.status}`)}
                </span>
                {r.meet_link && (
                  <a href={r.meet_link} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-orange hover:underline">
                    Meet ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
