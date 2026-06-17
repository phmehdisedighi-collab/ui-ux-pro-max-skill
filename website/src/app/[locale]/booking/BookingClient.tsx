'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Package, Slot } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';

export function BookingClient({
  packages,
  slots,
  authed,
}: {
  packages: Package[];
  slots: Slot[];
  authed: boolean;
}) {
  const t = useTranslations('booking');
  const tn = useTranslations('nav');
  const locale = useLocale();

  const [selectedPkg, setSelectedPkg] = useState<string | null>(packages[0]?.id ?? null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const pkg = packages.find((p) => p.id === selectedPkg);

  function fmtPrice(n: number) {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(n);
  }
  function fmtSlot(iso: string) {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  }

  async function onPay() {
    if (!selectedPkg || !selectedSlot) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: selectedPkg, slotId: selectedSlot, locale }),
      });
      const json = await res.json();
      if (json.ok && json.gatewayUrl) {
        window.location.href = json.gatewayUrl;
      } else {
        setError(json.error || 'error');
        setSubmitting(false);
      }
    } catch {
      setError('error');
      setSubmitting(false);
    }
  }

  if (!authed) {
    return (
      <section className="section grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <p className="text-lg font-bold text-surmei">{t('loginRequired')}</p>
          <Link href="/login" className="btn-owj mt-6">{tn('login')}</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section py-16">
      <SectionHeading title={t('title')} center />

      <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          {/* مرحله ۱ — پکیج */}
          <div>
            <h3 className="mb-4 text-lg font-black text-orange">{t('step1')}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {packages.map((p) => {
                const active = p.id === selectedPkg;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPkg(p.id)}
                    className={`rounded-owj border p-5 text-start transition ${
                      active
                        ? 'border-orange bg-orange/5 ring-2 ring-orange/30'
                        : 'border-black/10 bg-white hover:border-orange/50'
                    }`}
                  >
                    <div className="font-black text-surmei">
                      {locale === 'fa' ? p.title_fa : p.title_en}
                    </div>
                    <div className="mt-1 text-xs text-ink/60">
                      {p.duration_min} {t('minutes')} · {p.sessions_count} {t('sessions')}
                    </div>
                    <div className="mt-3 font-black text-orange">
                      {fmtPrice(p.price_toman)} {t('toman')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* مرحله ۲ — زمان */}
          <div>
            <h3 className="mb-4 text-lg font-black text-orange">{t('step2')}</h3>
            {slots.length === 0 ? (
              <p className="rounded-owj bg-graylight p-5 text-sm text-ink/60">{t('noSlots')}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {slots.map((s) => {
                  const active = s.id === selectedSlot;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSlot(s.id)}
                      className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        active
                          ? 'border-teal bg-teal/10 text-teal ring-2 ring-teal/30'
                          : 'border-black/10 bg-white text-ink/80 hover:border-teal/50'
                      }`}
                    >
                      {fmtSlot(s.start_at)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* خلاصه + پرداخت */}
        <aside className="h-fit rounded-owj border border-black/5 bg-surmei p-6 text-white shadow-owj lg:sticky lg:top-24">
          <h3 className="text-lg font-black text-gold">{t('summary')}</h3>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-white/60">{t('step1')}</dt>
              <dd className="font-bold">{pkg ? (locale === 'fa' ? pkg.title_fa : pkg.title_en) : '—'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-white/60">{t('step2')}</dt>
              <dd className="font-bold">
                {selectedSlot ? fmtSlot(slots.find((s) => s.id === selectedSlot)!.start_at) : '—'}
              </dd>
            </div>
            <div className="my-2 border-t border-white/10" />
            <div className="flex justify-between gap-3 text-base">
              <dt className="text-white/80">{t('step3')}</dt>
              <dd className="font-black text-gold">
                {pkg ? `${fmtPrice(pkg.price_toman)} ${t('toman')}` : '—'}
              </dd>
            </div>
          </dl>
          {error && <p className="mt-4 text-sm font-bold text-orange">{error}</p>}
          <button
            onClick={onPay}
            disabled={!selectedPkg || !selectedSlot || submitting}
            className="btn-owj mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? t('processing') : t('payButton')}
          </button>
        </aside>
      </div>
    </section>
  );
}
