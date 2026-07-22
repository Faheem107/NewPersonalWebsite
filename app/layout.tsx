import type { Metadata, Viewport } from 'next'
import { Inter, Lexend } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { PointerProvider } from '@/lib/motion/pointer'
import CustomCursor from '@/components/custom-cursor'
import SmoothScroll from '@/components/smooth-scroll'
import SiteChrome from '@/components/site-chrome'
import SiteSearch from '@/components/search/site-search'
import { buildSearchIndex } from '@/lib/search'
import './globals.css'
import 'katex/dist/katex.min.css'

// Inter carries the name and nothing else: a Helvetica-class grotesque, but
// self-hosted by next/font so it renders identically on every platform rather
// than falling back to Arial off Apple devices, which real Helvetica does.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Lexend does all the rest. Both faces are variable, which the weight-on-hover
// interaction depends on; Lexend has no width axis, so captions get their
// condensed register from weight and tracking instead.
const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
})

const SITE = 'https://faheem.wiki'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Faheem · Physics at NYU Abu Dhabi',
    template: '%s · Faheem',
  },
  description:
    'Mohammed Faheem. Physics major, Film & New Media minor at NYU Abu Dhabi. Research notes, biophysics work, photography and film.',
  keywords: ['physics', 'biophysics', 'NYU Abu Dhabi', 'statistical mechanics', 'photography', 'film'],
  authors: [{ name: 'Mohammed Faheem' }],
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'Faheem',
    title: 'Faheem · Physics at NYU Abu Dhabi',
    description: 'Research notes, biophysics work, photography and film.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faheem · Physics at NYU Abu Dhabi',
    description: 'Research notes, biophysics work, photography and film.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f6f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0c0e' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Built once at build time and serialised into the page. Every source it
  // reads is static, so search needs no runtime data fetching.
  const searchIndex = buildSearchIndex()

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lexend.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PointerProvider>
            <SmoothScroll />
            <CustomCursor />
            <SiteChrome />
            <SiteSearch docs={searchIndex} />
            {children}
          </PointerProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
