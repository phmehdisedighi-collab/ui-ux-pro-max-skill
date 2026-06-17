'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const t = useTranslations('nav');
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <button onClick={logout} className="text-sm font-bold text-orange hover:underline">
      {t('logout')}
    </button>
  );
}
