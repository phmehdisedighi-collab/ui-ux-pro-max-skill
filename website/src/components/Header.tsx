'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { MountainLogo } from './MountainLogo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { createClient } from '@/lib/supabase/client';

export function Header() {
  const t = useTranslations('nav');
  const tb = useTranslations('brand');
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const links = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('services') },
    { href: '/about', label: t('about') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surmei/95 backdrop-blur">
      <nav className="section flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <MountainLogo className="h-8 w-8" />
          <span className="text-xl font-black">{tb('name')}</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-bold transition hover:text-gold ${
                pathname === l.href ? 'text-gold' : 'text-white/80'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href={signedIn ? '/dashboard' : '/login'}
            className="hidden text-sm font-bold text-white/80 transition hover:text-gold sm:block"
          >
            {signedIn ? t('dashboard') : t('login')}
          </Link>
          <Link href="/booking" className="btn-owj px-5 py-2 text-sm">
            {t('freeConsult')}
          </Link>
          <button
            className="text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-surmei px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-bold text-white/85"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={signedIn ? '/dashboard' : '/login'}
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-gold"
            >
              {signedIn ? t('dashboard') : t('login')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
