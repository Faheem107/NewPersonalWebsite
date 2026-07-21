import type { Metadata, Viewport } from 'next'
import { Newsreader, Archivo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { PointerProvider } from '@/lib/motion/pointer'
import CustomCursor from '@/components/custom-cursor'
import SmoothScroll from '@/components/smooth-scroll'
import SiteChrome from '@/components/site-chrome'
import './globals.css'
import 'katex/dist/katex.min.css'

// Both faces are variable, which the weight-on-hover interaction depends on.
// opsz lets Newsreader tighten as it scales up; wdth gives Archivo a condensed
// cut for captions without loading a second family.
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  axes: ['opsz'],
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  axes: ['wdth'],
  display: 'swap',
})

const SITE = 'https://faheem.wiki'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Faheem — Physics at NYU Abu Dhabi',
    template: '%s — Faheem',
  },
  description:
    'Mohammed Faheem. Physics major, Film & New Media minor at NYU Abu Dhabi. Research notes, biophysics work, photography and film.',
  keywords: ['physics', 'biophysics', 'NYU Abu Dhabi', 'statistical mechanics', 'photography', 'film'],
  authors: [{ name: 'Mohammed Faheem' }],
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'Faheem',
    title: 'Faheem — Physics at NYU Abu Dhabi',
    description: 'Research notes, biophysics work, photography and film.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faheem — Physics at NYU Abu Dhabi',
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
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${archivo.variable}`}
    >
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PointerProvider>
            <SmoothScroll />
            <CustomCursor />
            <SiteChrome />
            {children}
          </PointerProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
