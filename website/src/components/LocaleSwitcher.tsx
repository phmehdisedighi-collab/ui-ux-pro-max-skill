'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    if (next === locale) return;
    router.replace(pathname, { locale: next as any });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/20 p-0.5 text-sm">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`rounded-full px-2.5 py-1 font-bold transition ${
            l === locale ? 'bg-gold text-surmei' : 'text-white/70 hover:text-white'
          }`}
          aria-current={l === locale}
        >
          {l === 'fa' ? 'فا' : 'EN'}
        </button>
      ))}
    </div>
  );
}
