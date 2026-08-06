'use client'
import Logo from '@/components/Layout/Header/Logo'
import { setAccessToken, setRefreshToken, setUser } from '@/utils/auth-server'
import { Button, Card, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useLogin, useGoogleLogin } from '../hooks'
import { TPayloadLogin } from '../types'
import { useReCaptcha } from '@/hooks/useReCaptcha'

declare global {
  interface Window {
    google?: any
  }
}

const SignIn = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'
  const [loading, setLoading] = useState(false)
  const { executeRecaptcha } = useReCaptcha()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      customer_email: '',
      customer_password: ''
    }
  })

  const { mutate: submitLogin } = useLogin()
  const { mutate: submitGoogleLogin } = useGoogleLogin()

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const handleGoogleLoginSuccess = async (response: any) => {
    setLoading(true)
    try {
      const captchaToken = await executeRecaptcha('google_login')
      submitGoogleLogin(
        {
          id_token: response.credential,
          captcha_token: captchaToken
        },
        {
          onSuccess: ({ access_token, refresh_token, user }) => {
            setAccessToken(access_token)
            setRefreshToken(refresh_token)
            setUser(JSON.stringify(user))
            setLoading(false)
            router.replace(redirectTo)
          },
          onError: (err) => {
            setLoading(false)
            toast.error(err.message || 'Google login failed')
          }
        }
      )
    } catch (error) {
      setLoading(false)
      toast.error('Verification failed. Please try again.')
    }
  }

  useEffect(() => {
    if (!googleClientId) return

    // Load Google script if not already present
    const existingScript = document.getElementById('google-gsi-script')
    if (!existingScript) {
      const script = document.createElement('script')
      script.id = 'google-gsi-script'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }

    const checkGoogleAndRender = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLoginSuccess
        })

        const btnElement = document.getElementById('google-signin-btn')
        if (btnElement) {
          window.google.accounts.id.renderButton(btnElement, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: btnElement.clientWidth || 300
          })
        }
      } else {
        setTimeout(checkGoogleAndRender, 100)
      }
    }

    checkGoogleAndRender()
  }, [googleClientId])

  const handleSubmit = async (values: TPayloadLogin) => {
    setLoading(true)
    try {
      const captchaToken = await executeRecaptcha('login')
      submitLogin(
        {
          ...values,
          captcha_token: captchaToken
        },
        {
          onSuccess: ({ access_token, refresh_token, user }) => {
            setAccessToken(access_token)
            setRefreshToken(refresh_token)
            setUser(JSON.stringify(user))
            setLoading(false)
            router.replace(redirectTo)
          },
          onError: (err) => {
            setLoading(false)
            if (err.errors) {
              form.setErrors(err.errors)
            } else {
              toast.error(err.message || 'Login failed')
            }
          }
        }
      )
    } catch (error) {
      setLoading(false)
      toast.error('Verification failed. Please try again.')
    }
  }

  return (
    <div className="flex justify-center mb-10">
      <Card withBorder w={500} p={'xl'}>
        <div className="mb-8 text-center">
          <div className="mx-auto inline-block">
            <Logo />
          </div>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              key={form.key('customer_email')}
              {...form.getInputProps('customer_email')}
            />

            <TextInput
              withAsterisk
              type="password"
              label="Password"
              placeholder="******"
              key={form.key('customer_password')}
              {...form.getInputProps('customer_password')}
            />

            <div className="flex justify-end -mt-2">
              <span
                onClick={() => {
                  const email = form.getValues().customer_email
                  const redirectQuery = redirectTo !== '/' ? `&redirectTo=${encodeURIComponent(redirectTo)}` : ''
                  router.push(`/forgot-password?email=${encodeURIComponent(email || '')}${redirectQuery}`)
                }}
                className="text-xs text-primary hover:underline font-medium cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <Group justify="center" mt="md">
              <Button type="submit" w={'100%'} size="lg" loading={loading}>
                Submit
              </Button>
            </Group>

            {googleClientId && (
              <>
                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs text-gray-400 uppercase">
                    <span className="bg-white px-2">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-in Button */}
                <div className="flex justify-center w-full">
                  <div id="google-signin-btn" className="w-full flex justify-center" style={{ minHeight: '40px' }} />
                </div>
              </>
            )}

            <p className="text-sm text-gray-400 mb-4 text-center mt-2">
              By creating an account you agree to our{' '}
              <a href="/#" className="text-primary hover:underline">
                Privacy
              </a>{' '}
              and{' '}
              <a href="/#" className="text-primary hover:underline">
                Policy
              </a>
              .
            </p>

            <p className="text-sm text-gray-400 text-center">
              Don't have an account?{' '}
              <Link
                href={redirectTo !== '/' ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}` : "/signup"}
                className="pl-2 text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </Stack>
        </form>
      </Card>
    </div>
  )
}

export default SignIn
