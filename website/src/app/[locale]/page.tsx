import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { MountainLogo } from '@/components/MountainLogo';
import { SectionHeading } from '@/components/SectionHeading';
import { HeroWave } from '@/components/HeroWave';
import { ProgramsCarousel } from '@/components/ProgramsCarousel';

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('home');

  const painPoints = t.raw('pain.points') as string[];
  const solutionItems = t.raw('solution.items') as { title: string; desc: string }[];
  const stats = t.raw('credibility.stats') as { value: string; label: string }[];
  const results = t.raw('results.items') as string[];

  const statColors = [
    'bg-orange/10 text-orange border-orange/20',
    'bg-teal/10 text-teal border-teal/20',
    'bg-gold/10 text-gold border-gold/20',
  ];
  const solutionColors = [
    { bg: 'bg-orange', text: 'text-white' },
    { bg: 'bg-teal', text: 'text-white' },
    { bg: 'bg-surmei', text: 'text-white' },
  ];

  return (
    <>
      {/* ── هیرو — پس‌زمینه روشن + جزئیات رنگی ── */}
      <section className="relative overflow-hidden bg-white">
        {/* دایره گرادیان تزئینی */}
        <div className="pointer-events-none absolute -top-32 ltr:-right-32 rtl:-left-32 h-[28rem] w-[28rem] rounded-full bg-owj-gradient opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 ltr:left-0 rtl:right-0 h-64 w-64 rounded-full bg-teal/10 blur-3xl" />

        <div className="section relative grid gap-10 py-16 sm:py-24 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-4 py-1.5 text-sm font-bold text-orange">
              <MountainLogo className="h-5 w-5" />
              {t('hero.badge')}
            </span>
            <h1 className="mt-5 text-4xl leading-tight text-surmei sm:text-5xl md:text-6xl">
              <span className="bg-owj-gradient bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
              {t('hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/booking" className="btn-owj">{t('hero.ctaPrimary')}</Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-surmei/20 px-7 py-3.5 font-bold text-surmei transition hover:border-orange hover:text-orange"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* تصویر/المان هیرو */}
          <div className="relative flex justify-center">
            <div className="relative flex h-72 w-72 flex-col items-center justify-center gap-4 rounded-3xl border border-black/5 bg-gradient-to-br from-graylight to-white shadow-owj sm:h-80 sm:w-80">
              <MountainLogo className="h-32 w-32" />
              <div className="rounded-full bg-owj-gradient px-5 py-2 text-sm font-black text-surmei shadow-owj-gold">
                سیستم · فروش · تیم
              </div>
            </div>
            {/* کارت شناور آمار */}
            <div className="absolute ltr:-left-6 rtl:-right-6 bottom-10 rounded-2xl bg-white px-4 py-3 shadow-owj">
              <div className="text-lg font-black text-orange">+۲۰۰</div>
              <div className="text-xs text-ink/60">کلینیک موفق</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── نوار آمار سریع ── */}
      <section className="border-y border-black/5 bg-graylight py-8">
        <div className="section grid gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div key={i} className={`flex items-center gap-4 rounded-2xl border p-5 ${statColors[i]}`}>
              <div className="text-3xl font-black">{s.value}</div>
              <div className="text-sm font-bold leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── اسلایدر برنامه‌ها ── */}
      <ProgramsCarousel />

      {/* ── درد مخاطب ── */}
      <section className="section py-20">
        <SectionHeading kicker={t('pain.kicker')} title={t('pain.title')} />
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">{t('pain.body')}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {painPoints.map((p, i) => (
            <div key={i} className="rounded-2xl border border-orange/15 bg-orange/5 p-5">
              <div className="mb-2 h-8 w-8 rounded-full bg-orange/15 text-center text-sm font-black leading-8 text-orange">
                {i + 1}
              </div>
              <span className="text-sm font-bold text-ink/85">{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── راه‌حل: سه‌ضلعی سیستم/فروش/تیم ── */}
      <section className="bg-graylight py-20">
        <div className="section">
          <SectionHeading kicker={t('solution.kicker')} title={t('solution.title')} center />
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-ink/70">
            {t('solution.body')}
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {solutionItems.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white p-7 shadow-owj">
                <div className={`grid h-12 w-12 place-items-center rounded-xl text-xl font-black ${solutionColors[i].bg} ${solutionColors[i].text}`}>
                  {i + 1}
                </div>
                <h3 className="mt-5 text-xl text-surmei">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── اعتبار دکتر صدیقی — روشن ── */}
      <section className="section py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading kicker={t('credibility.kicker')} title={t('credibility.title')} />
            <p className="mt-6 text-lg leading-relaxed text-ink/75">{t('credibility.body')}</p>
            <Link href="/about" className="btn-owj mt-8 inline-flex">{t('hero.ctaSecondary')}</Link>
          </div>
          <div className="rounded-3xl bg-surmei p-8 text-white">
            <div className="mb-6 flex items-center gap-3">
              <MountainLogo className="h-10 w-10" />
              <div>
                <div className="font-black text-white">مهدی صدیقی</div>
                <div className="text-sm text-white/60">بنیان‌گذار آکادمی اوج</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="rounded-xl bg-white/10 p-4 text-center">
                  <div className="bg-owj-gradient bg-clip-text text-2xl font-black text-transparent">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-white/65">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── نتیجه‌ها ── */}
      <section className="bg-graylight py-20">
        <div className="section">
          <SectionHeading kicker={t('results.kicker')} title={t('results.title')} center />
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal text-xs font-black text-white">
                  ✓
                </span>
                <span className="text-sm font-medium leading-relaxed text-ink/85">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── دعوت به اقدام ── */}
      <section className="section pb-24 pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-surmei px-8 py-16 text-center text-white shadow-owj">
          <HeroWave />
          <div className="pointer-events-none absolute -top-16 ltr:-right-16 rtl:-left-16 h-64 w-64 rounded-full bg-owj-gradient opacity-20 blur-3xl" />
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-bold text-gold">
            همین الان شروع کن
          </span>
          <h2 className="mt-5 text-3xl font-black sm:text-4xl">{t('cta.title')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">{t('cta.body')}</p>
          <Link href="/booking" className="btn-owj mt-8 inline-flex">
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </>
  );
}
