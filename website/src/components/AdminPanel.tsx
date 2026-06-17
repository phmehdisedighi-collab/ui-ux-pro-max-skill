'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { Slot, Package } from '@/lib/types';

type Tab = 'slots' | 'bookings' | 'packages';

type BookingRow = {
  id: string;
  status: string;
  amount_toman: number;
  created_at: string;
  consultation_packages: { title_fa: string } | null;
  availability_slots: { start_at: string } | null;
};

export function AdminPanel({ locale }: { locale: string }) {
  const t = useTranslations('admin');
  const supabase = useMemo(() => createClient(), []);
  const [tab, setTab] = useState<Tab>('slots');

  const [slots, setSlots] = useState<Slot[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [busy, setBusy] = useState(false);

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));

  async function loadSlots() {
    const { data } = await supabase.from('availability_slots').select('*').order('start_at');
    setSlots((data as Slot[]) || []);
  }
  async function loadPackages() {
    const { data } = await supabase.from('consultation_packages').select('*').order('sort_order');
    setPackages((data as Package[]) || []);
  }
  async function loadBookings() {
    const { data } = await supabase
      .from('bookings')
      .select('id,status,amount_toman,created_at,consultation_packages(title_fa),availability_slots(start_at)')
      .order('created_at', { ascending: false });
    setBookings((data as unknown as BookingRow[]) || []);
  }

  useEffect(() => {
    loadSlots();
    loadPackages();
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addSlot() {
    if (!start || !end) return;
    setBusy(true);
    await supabase.from('availability_slots').insert({
      start_at: new Date(start).toISOString(),
      end_at: new Date(end).toISOString(),
      status: 'open',
    });
    setStart('');
    setEnd('');
    await loadSlots();
    setBusy(false);
  }

  async function deleteSlot(id: string) {
    await supabase.from('availability_slots').delete().eq('id', id);
    await loadSlots();
  }

  const tabs: Tab[] = ['slots', 'bookings', 'packages'];

  return (
    <div>
      <div className="flex gap-2 border-b border-black/10">
        {tabs.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-bold transition ${
              tab === tb ? 'border-orange text-orange' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            {t(`tabs.${tb}`)}
          </button>
        ))}
      </div>

      {tab === 'slots' && (
        <div className="mt-6">
          <div className="flex flex-wrap items-end gap-3 rounded-owj bg-graylight p-4">
            <label className="text-sm">
              <span className="mb-1 block font-bold text-ink/70">{t('slotStart')}</span>
              <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="input-owj" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-bold text-ink/70">{t('slotEnd')}</span>
              <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="input-owj" />
            </label>
            <button onClick={addSlot} disabled={busy} className="btn-owj px-5 py-3 disabled:opacity-60">
              {t('addSlot')}
            </button>
          </div>
          <div className="mt-5 space-y-2">
            {slots.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3 text-sm">
                <span className="font-bold text-surmei">{fmt(s.start_at)}</span>
                <span className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    s.status === 'open' ? 'bg-teal/15 text-teal' : s.status === 'booked' ? 'bg-orange/10 text-orange' : 'bg-graylight text-ink/50'
                  }`}>{s.status}</span>
                  {s.status !== 'booked' && (
                    <button onClick={() => deleteSlot(s.id)} className="text-xs font-bold text-orange hover:underline">
                      {t('delete')}
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="mt-6 space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3 text-sm">
              <span className="font-bold text-surmei">{b.consultation_packages?.title_fa || '—'}</span>
              <span className="text-ink/60">{b.availability_slots ? fmt(b.availability_slots.start_at) : fmt(b.created_at)}</span>
              <span className="font-bold">{b.amount_toman.toLocaleString('fa-IR')}</span>
              <span className="rounded-full bg-graylight px-2.5 py-0.5 text-xs font-bold text-ink/60">{b.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'packages' && (
        <div className="mt-6 space-y-2">
          {packages.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3 text-sm">
              <span className="font-bold text-surmei">{p.title_fa}</span>
              <span className="text-ink/60">{p.duration_min} min · {p.sessions_count}x</span>
              <span className="font-bold text-orange">{p.price_toman.toLocaleString('fa-IR')}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${p.is_active ? 'bg-teal/15 text-teal' : 'bg-graylight text-ink/50'}`}>
                {p.is_active ? 'active' : 'off'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
