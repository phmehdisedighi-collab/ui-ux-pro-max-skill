import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SectionHeading } from '@/components/SectionHeading';

export default function ServicesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('services');
  const soonItems = t.raw('soon.items') as string[];

  const soonColors = ['bg-orange/10 border-orange/20', 'bg-teal/10 border-teal/20', 'bg-surmei/10 border-surmei/20'];
  const soonTextColors = ['text-orange', 'text-teal', 'text-surmei'];

  return (
    <section className="section py-20">
      <SectionHeading title={t('title')} center />
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-ink/70">{t('lead')}</p>

      {/* خدمت اصلی: مشاوره */}
      <div className="mx-auto mt-14 max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border-2 border-orange/20 bg-white p-8 shadow-owj sm:p-10">
          {/* نوار رنگی بالا */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-owj-gradient rounded-t-3xl" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/10 px-3 py-1 text-xs font-black text-orange">
            ★ {t('consult.title')}
          </span>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">{t('consult.desc')}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Link href="/booking" className="btn-owj">{t('consult.cta')}</Link>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-black text-surmei">۶۰</span>
                <span className="text-ink/60"> دقیقه</span>
              </div>
              <div>
                <span className="font-black text-surmei">آنلاین</span>
                <span className="text-ink/60"> (ویدیوکال)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* خدمات آینده */}
      <div className="mx-auto mt-16 max-w-3xl">
        <h4 className="mb-2 text-center text-xs font-black uppercase tracking-widest text-ink/40">
          {t('soon.title')}
        </h4>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {soonItems.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border-2 border-dashed p-6 text-center ${soonColors[i]}`}
            >
              <span className={`text-sm font-bold ${soonTextColors[i]}`}>{item}</span>
              <div className="mt-2 text-xs text-ink/40">به‌زودی</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
