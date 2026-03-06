'use client'

import { getQueryClient } from '@/lib/reactQueryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { Alert, Badge, Button, Card, Input, MantineProvider, Paper, TextInput, createTheme } from '@mantine/core'
import { ToastContainer } from 'react-toastify'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'

const theme = createTheme({
  primaryColor: 'primary',
  primaryShade: 8,
  colors: {
    primary: [
      "#ecfdfc",
      "#dafaf7",
      "#b0f5ee",
      "#85f0e6",
      "#66ecdf",
      "#55eada",
      "#4be9d8",
      "#3dcfbf",
      "#2fb8aa",
      "#0d9488"
    ]
  },
  components: {
    Card: Card.extend({
      defaultProps: {
        radius: 'lg',
      },
    }),
    Button: Button.extend({
      defaultProps: {
        radius: 'xl',
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    Input: Input.extend({
      defaultProps: {
        radius: 'xl',
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    Alert: Alert.extend({
      defaultProps: {
        radius: 'lg',
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: 'lg',
      },
    }),
  }
})

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid instantiation at render time if possible, but getQueryClient 
  // already handles singleton pattern for browser.
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <NextTopLoader color="#6556FF" showSpinner={false} />
        {children}
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
      </MantineProvider>
    </QueryClientProvider>
  )
}
