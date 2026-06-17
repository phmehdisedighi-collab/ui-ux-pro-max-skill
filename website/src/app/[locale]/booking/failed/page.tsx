import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function BookingFailedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('booking');

  return (
    <section className="section grid min-h-[60vh] place-items-center py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange text-3xl text-white">
          ✕
        </div>
        <h1 className="mt-6 text-3xl font-black text-surmei">{t('failedTitle')}</h1>
        <p className="mt-4 text-ink/75">{t('failedBody')}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/booking" className="btn-owj">{t('title')}</Link>
          <Link href="/" className="text-sm font-bold text-surmei hover:text-orange">
            {t('backHome')}
          </Link>
        </div>
      </div>
    </section>
  );
}
