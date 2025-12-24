'use client'
import Logo from '@/components/Layout/Header/Logo'
import { useAuth } from '@/hooks/useAuth'
import { TReqLogin } from '@/types/auth'
import { setAccessToken, setRefreshToken, setUser } from '@/utils/auth-server'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import Link from 'next/link'
import { useRouter } from 'nextjs-toploader/app'
import { useState } from 'react'
import { toast } from 'react-toastify'

const SignUp = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      customer_email: '',
      customer_password: ''
    }
  })

  const { mutate: submitLogin } = useAuth.login()

  const handleSubmit = (values: TReqLogin) => {
    setLoading(true)
    submitLogin(values, {
      onSuccess: ({ data }) => {
        setAccessToken(data.access_token)
        setRefreshToken(data.refresh_token)
        setUser(JSON.stringify(data.user))
        setLoading(false)
        router.replace('/')
      },
      onError: (err) => {
        console.log(err)
        setLoading(false)
        toast.error(err.message)
      }
    })
  }

  return (
    <div className="flex justify-center mb-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
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

            {/* Submit Button */}
            <Group justify="center" mt="md">
              <Button type="submit" w={'100%'} radius={'xl'} size="lg" loading={loading}>
                Submit
              </Button>
            </Group>

            <p className="text-sm text-gray-400 mb-4 text-center">
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
              Don't have an account?
              <Link href="/signup" className="pl-2 text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </Stack>
        </form>
      </div>
    </div>
  )
}

export default SignUp
