'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MountainLogo } from './MountainLogo';

export function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const tb = useTranslations('brand');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-surmei text-white">
      <div className="section grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <MountainLogo className="h-9 w-9" />
            <span className="text-2xl font-black">{tb('name')}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-white/70">{tb('academy')}</p>
          <p className="mt-2 bg-owj-gradient bg-clip-text font-black text-transparent">
            {t('slogan')}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-black text-gold">{tn('services')}</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link href="/services" className="hover:text-gold">{tn('services')}</Link></li>
            <li><Link href="/booking" className="hover:text-gold">{tn('booking')}</Link></li>
            <li><Link href="/about" className="hover:text-gold">{tn('about')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-black text-gold">{tn('login')}</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link href="/login" className="hover:text-gold">{tn('login')}</Link></li>
            <li><Link href="/register" className="hover:text-gold">{tn('register')}</Link></li>
            <li><Link href="/dashboard" className="hover:text-gold">{tn('dashboard')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {year} {tb('name')} · {t('rights')}
      </div>
    </footer>
  );
}
