import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Poppins } from 'next/font/google'
import { cookies } from 'next/headers'
import NextTopLoader from 'nextjs-toploader'

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

const theme = createTheme({
  primaryColor: 'primary',
  primaryShade: 3,
  colors: {
    primary: [
      '#eceaff',
      '#d4cfff',
      '#a49bff',
      '#6556ff',
      '#4836fe',
      '#2e19fe',
      '#1f09ff',
      '#1100e4',
      '#0800cc',
      '#0000b4'
    ]
  }
})

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')
  const user = userCookie && userCookie.value ? JSON.parse(userCookie.value) : null

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${font.className}`}>
        <NextTopLoader color="#6556FF" showSpinner={false} />
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <Header user={user} />
            {children}
            <Footer />
            <ScrollToTop />
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
