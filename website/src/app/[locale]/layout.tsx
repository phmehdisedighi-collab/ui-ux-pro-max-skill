import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Vazirmatn } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '../globals.css';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-vazir',
});

export const metadata: Metadata = {
  title: 'اوج | کلینیکت را به اوج برسان',
  description:
    'آکادمی رشد کلینیک اوج — مهدی صدیقی. کلینیکت را از وابستگی آزاد کن: سیستم، فروش، تیم.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={vazir.variable}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
