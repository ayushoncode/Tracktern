import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { DM_Sans, Syne } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

// ✅ Load fonts
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-heading',
})

export const metadata: Metadata = {
  title: 'Tracktern - AI-Powered Internship Tracker',
  description:
    'Your internship hunt, organized. Track applications, get AI-powered interview prep, and land your dream role.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
