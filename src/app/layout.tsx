import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header'
import BottomNavigation from '@/components/Layout/BottomNavigation'
import ScrollToTop from '@/components/ScrollToTop'
import Providers from '@/components/Providers'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Funnel_Display, Kaushan_Script } from 'next/font/google'
import type { Metadata } from 'next'
import { getUser } from '@/utils/auth-server'

export const metadata: Metadata = {
  title: {
    template: '%s | Optikers',
    default: 'Optikers - Kacamata & Lensa'
  },
  description: 'Temukan koleksi kacamata dan lensa terbaik di Optikers.'
}

// Stylesheet
import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import './globals.css'

dayjs.extend(customParseFormat)

const font = Funnel_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const logoFont = Kaushan_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-logo'
})

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${font.className} ${logoFont.variable}`}>
        <Providers>
          <Header user={user} />
          <main className="pb-24 lg:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNavigation />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
