import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { AboutSection } from '@/components/sections/AboutSection'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  return {
    title: t('title') + ' | AI Consultant',
    description: t('subtitle'),
  }
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <Footer />
    </main>
  )
}
