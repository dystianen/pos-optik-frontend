import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Poppins } from 'next/font/google'

// Stylesheet
import queryClient from '@/lib/reactQueryClient'
import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import './globals.css'

dayjs.extend(customParseFormat)

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${font.className}`}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider
            theme={{
              primaryColor: 'violet',
              primaryShade: 7
            }}
          >
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
