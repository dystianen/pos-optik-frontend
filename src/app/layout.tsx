import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header'
import ScrollToTop from '@/components/ScrollToTop'
import Providers from '@/components/Providers'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Funnel_Display } from 'next/font/google'
import { getUser } from '@/utils/auth-server'

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
      <body className={`${font.className}`}>
        <Providers>
          <Header user={user} />
          {children}
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
