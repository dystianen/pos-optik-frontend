import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header'
import ScrollToTop from '@/components/ScrollToTop'
import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Poppins } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

// Stylesheet
import queryClient from '@/lib/reactQueryClient'
import { getUser } from '@/utils/auth-server'
import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { ToastContainer } from 'react-toastify'
import './globals.css'

dayjs.extend(customParseFormat)

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const theme = createTheme({
  primaryColor: 'primary',
  primaryShade: 8,
  colors: {
    primary: [
      '#ecedff',
      '#d5d7f9',
      '#a8abf0',
      '#797de9',
      '#5155e2',
      '#393ddf',
      '#2c30de',
      '#1f24c5',
      '#1a21bc',
      '#0d1a9c'
    ]
  }
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
        <NextTopLoader color="#6556FF" showSpinner={false} />
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <Header user={user} />
            {children}
            <Footer />
            <ScrollToTop />
          </MantineProvider>
        </QueryClientProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  )
}
