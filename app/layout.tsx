import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/react'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://truthhair.com'),
  title: 'Truth Hair - Premium Wigs & Hair Solutions',
  description: 'Discover luxury wigs and premium hair solutions at Truth Hair. Find your perfect style with our premium collection.',
  keywords: 'premium wigs, luxury hair, hair solutions, Truth Hair, luxury wigs',
  authors: [{ name: 'Truth Hair' }],
  openGraph: {
    title: 'Truth Hair - Premium Wigs & Hair Solutions',
    description: 'Discover luxury wigs and premium hair solutions at Truth Hair.',
    url: 'https://truthhair.com',
    siteName: 'Truth Hair',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Truth Hair - Premium Wigs & Hair Solutions',
    description: 'Discover luxury wigs and premium hair solutions at Truth Hair.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#2B2D5F',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${montserrat.variable} font-montserrat`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}