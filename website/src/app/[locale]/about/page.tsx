import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SectionHeading } from '@/components/SectionHeading';
import { MountainLogo } from '@/components/MountainLogo';

export default function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('about');
  const tn = useTranslations('nav');

  return (
    <section className="section py-20">
      <div className="grid gap-12 md:grid-cols-2 md:items-start">
        <div>
          <SectionHeading title={t('title')} />
          <p className="mt-6 text-xl font-bold text-surmei">{t('lead')}</p>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">{t('body')}</p>
          <p className="mt-6 rounded-owj border-s-4 border-gold bg-graylight p-4 text-sm text-ink/70">
            {t('resumeSoon')}
          </p>
          <Link href="/booking" className="btn-owj mt-8">{tn('freeConsult')}</Link>
        </div>

        {/* جای عکس — placeholder تا عکس واقعی اضافه شود */}
        <div className="relative">
          <div className="grid aspect-[4/5] place-items-center rounded-owj border border-black/5 bg-surmei text-white shadow-owj">
            <div className="text-center">
              <MountainLogo className="mx-auto h-24 w-24" />
              <p className="mt-4 text-sm text-white/60">{t('photoPlaceholder')}</p>
            </div>
          </div>
          <div className="absolute -bottom-4 ltr:-right-4 rtl:-left-4 rounded-owj bg-owj-gradient px-5 py-3 font-black text-surmei shadow-owj-gold">
            مهدی صدیقی
          </div>
        </div>
      </div>
    </section>
  );
}
