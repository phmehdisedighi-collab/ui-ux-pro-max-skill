import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/SectionHeading';
import { AdminPanel } from '@/components/AdminPanel';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/login', locale });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return (
      <section className="section grid min-h-[50vh] place-items-center py-16">
        <p className="text-lg font-bold text-orange">{t('noAccess')}</p>
      </section>
    );
  }

  return (
    <section className="section py-16">
      <SectionHeading title={t('title')} />
      <div className="mt-10">
        <AdminPanel locale={locale} />
      </div>
    </section>
  );
}
