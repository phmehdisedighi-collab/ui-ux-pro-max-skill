import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SectionHeading } from '@/components/SectionHeading';

export default function ServicesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('services');
  const soonItems = t.raw('soon.items') as string[];

  return (
    <section className="section py-20">
      <SectionHeading title={t('title')} center />
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-ink/80">{t('lead')}</p>

      {/* خدمت اصلی: مشاوره */}
      <div className="mx-auto mt-12 max-w-3xl">
        <div className="relative overflow-hidden rounded-owj bg-surmei p-8 text-white shadow-owj sm:p-10">
          <span className="absolute top-0 ltr:right-0 rtl:left-0 rounded-bl-owj bg-owj-gradient px-4 py-1.5 text-xs font-black text-surmei">
            ★
          </span>
          <h3 className="text-2xl font-black text-gold">{t('consult.title')}</h3>
          <p className="mt-4 leading-relaxed text-white/80">{t('consult.desc')}</p>
          <Link href="/booking" className="btn-owj mt-7">{t('consult.cta')}</Link>
        </div>
      </div>

      {/* خدمات آینده */}
      <div className="mx-auto mt-14 max-w-3xl">
        <h4 className="text-center text-sm font-black uppercase tracking-wider text-orange">
          {t('soon.title')}
        </h4>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {soonItems.map((item, i) => (
            <div
              key={i}
              className="rounded-owj border border-dashed border-black/15 bg-graylight p-6 text-center text-sm font-bold text-ink/60"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
