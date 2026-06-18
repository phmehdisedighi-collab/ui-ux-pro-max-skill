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
    <footer className="mt-20 bg-graylight text-ink">
      <div className="section grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5 text-surmei">
            <MountainLogo className="h-9 w-9" />
            <span className="text-2xl font-black">{tb('name')}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-ink/60">{tb('academy')}</p>
          <p className="mt-2 bg-owj-gradient bg-clip-text font-black text-transparent">
            {t('slogan')}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-black text-surmei">{tn('services')}</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><Link href="/services" className="hover:text-orange transition">{tn('services')}</Link></li>
            <li><Link href="/booking" className="hover:text-orange transition">{tn('booking')}</Link></li>
            <li><Link href="/about" className="hover:text-orange transition">{tn('about')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-black text-surmei">{tn('login')}</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><Link href="/login" className="hover:text-orange transition">{tn('login')}</Link></li>
            <li><Link href="/register" className="hover:text-orange transition">{tn('register')}</Link></li>
            <li><Link href="/dashboard" className="hover:text-orange transition">{tn('dashboard')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/10 py-5 text-center text-xs text-ink/50">
        © {year} {tb('name')} · {t('rights')}
      </div>
    </footer>
  );
}
