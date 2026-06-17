import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { MountainLogo } from '@/components/MountainLogo';
import { SectionHeading } from '@/components/SectionHeading';

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('home');

  const painPoints = t.raw('pain.points') as string[];
  const solutionItems = t.raw('solution.items') as { title: string; desc: string }[];
  const stats = t.raw('credibility.stats') as { value: string; label: string }[];
  const results = t.raw('results.items') as string[];

  return (
    <>
      {/* ── هیرو با گرادیان امضای اوج ── */}
      <section className="relative overflow-hidden bg-surmei text-white">
        <div className="pointer-events-none absolute -top-24 ltr:-right-24 rtl:-left-24 h-96 w-96 rounded-full bg-owj-gradient opacity-20 blur-3xl" />
        <div className="section relative grid gap-10 py-20 sm:py-28 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-bold text-gold">
              <MountainLogo className="h-5 w-5" />
              {t('hero.badge')}
            </span>
            <h1 className="mt-6 text-4xl leading-tight sm:text-5xl md:text-6xl">
              <span className="bg-owj-gradient bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">{t('hero.subtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking" className="btn-owj">{t('hero.ctaPrimary')}</Link>
              <Link href="/about" className="btn-ghost">{t('hero.ctaSecondary')}</Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative grid h-72 w-72 place-items-center rounded-owj border border-white/10 bg-white/5 sm:h-80 sm:w-80">
              <MountainLogo className="h-40 w-40" />
              <div className="absolute -bottom-4 ltr:-left-4 rtl:-right-4 rounded-owj bg-owj-gradient px-5 py-3 font-black text-surmei shadow-owj-gold">
                سیستم · فروش · تیم
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── درد مخاطب ── */}
      <section className="section py-20">
        <SectionHeading kicker={t('pain.kicker')} title={t('pain.title')} />
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/80">{t('pain.body')}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {painPoints.map((p, i) => (
            <div key={i} className="rounded-owj border-s-4 border-orange bg-graylight p-5">
              <span className="text-sm font-bold text-ink/85">{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── راه‌حل: سه‌ضلعی سیستم/فروش/تیم ── */}
      <section className="bg-graylight py-20">
        <div className="section">
          <SectionHeading kicker={t('solution.kicker')} title={t('solution.title')} center />
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-ink/80">
            {t('solution.body')}
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {solutionItems.map((item, i) => (
              <div key={i} className="card-owj text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-owj-gradient text-2xl font-black text-surmei">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-xl text-surmei">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── اعتبار دکتر صدیقی ── */}
      <section className="bg-surmei py-20 text-white">
        <div className="section grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading kicker={t('credibility.kicker')} title={t('credibility.title')} light />
            <p className="mt-6 text-lg leading-relaxed text-white/80">{t('credibility.body')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-owj border border-white/10 bg-white/5 p-5 text-center">
                <div className="bg-owj-gradient bg-clip-text text-2xl font-black text-transparent">
                  {s.value}
                </div>
                <div className="mt-2 text-xs text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── نتیجه‌ها ── */}
      <section className="section py-20">
        <SectionHeading kicker={t('results.kicker')} title={t('results.title')} center />
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {results.map((r, i) => (
            <div key={i} className="flex items-start gap-3 rounded-owj bg-graylight p-5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal text-xs font-black text-white">
                ✓
              </span>
              <span className="text-sm font-medium text-ink/85">{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── دعوت به اقدام ── */}
      <section className="section pb-24">
        <div className="relative overflow-hidden rounded-owj bg-owj-gradient px-8 py-14 text-center text-surmei shadow-owj-gold">
          <h2 className="text-3xl font-black sm:text-4xl">{t('cta.title')}</h2>
          <p className="mx-auto mt-4 max-w-xl font-medium">{t('cta.body')}</p>
          <Link
            href="/booking"
            className="mt-8 inline-flex rounded-full bg-surmei px-8 py-4 font-black text-white transition hover:-translate-y-0.5 hover:brightness-110"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </>
  );
}
