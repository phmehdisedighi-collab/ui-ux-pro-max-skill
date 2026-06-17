'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { SectionHeading } from '@/components/SectionHeading';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // اگر تأیید ایمیل غیرفعال باشد، سشن بلافاصله ساخته می‌شود
    if (data.session) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setDone(true);
    }
  }

  return (
    <section className="section grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-md card-owj">
        <SectionHeading title={t('registerTitle')} />
        {done ? (
          <p className="mt-8 rounded-owj bg-graylight p-5 text-center text-sm font-bold text-teal">
            {t('checkEmail')}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field label={t('fullName')} htmlFor="name">
              <input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-owj" />
            </Field>
            <Field label={t('phone')} htmlFor="phone">
              <input id="phone" type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-owj" />
            </Field>
            <Field label={t('email')} htmlFor="email">
              <input id="email" type="email" required dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="input-owj" />
            </Field>
            <Field label={t('password')} htmlFor="password">
              <input id="password" type="password" required minLength={6} dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} className="input-owj" />
            </Field>
            {error && <p className="text-sm font-bold text-orange">{error}</p>}
            <button type="submit" disabled={loading} className="btn-owj w-full disabled:opacity-60">
              {loading ? t('registering') : t('registerButton')}
            </button>
          </form>
        )}
        <Link href="/login" className="mt-5 block text-center text-sm font-bold text-surmei hover:text-orange">
          {t('haveAccount')}
        </Link>
      </div>
    </section>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-ink/80">
        {label}
      </label>
      {children}
    </div>
  );
}
