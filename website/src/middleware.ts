import { type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // ۱) مسیریابی چندزبانه (next-intl)
  const response = intlMiddleware(request);

  // ۲) تازه‌سازی سشن Supabase و نوشتن کوکی‌ها روی همان پاسخ
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as never)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  // همه مسیرها به جز API، فایل‌های استاتیک و assetها
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
