'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { SectionHeading } from '@/components/SectionHeading';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tc = useTranslations('common');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <section className="section grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-md card-owj">
        <SectionHeading title={t('loginTitle')} />
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label={t('email')} htmlFor="email">
            <input
              id="email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-owj"
            />
          </Field>
          <Field label={t('password')} htmlFor="password">
            <input
              id="password"
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-owj"
            />
          </Field>
          {error && <p className="text-sm font-bold text-orange">{error}</p>}
          <button type="submit" disabled={loading} className="btn-owj w-full disabled:opacity-60">
            {loading ? t('loggingIn') : t('loginButton')}
          </button>
        </form>
        <Link href="/register" className="mt-5 block text-center text-sm font-bold text-surmei hover:text-orange">
          {t('noAccount')}
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
