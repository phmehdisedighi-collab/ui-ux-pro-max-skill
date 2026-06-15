import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Consultant',
  description: 'Strategic AI consulting for executives and businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
