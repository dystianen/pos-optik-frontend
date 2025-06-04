'use client'
import Logo from '@/components/Layout/Header/Logo'
import { useAuth } from '@/hooks/useAuth'
import { TReqLogin } from '@/types/auth'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
    // setLoading(true)

    console.log('form: ', values)
    submitLogin(values, {
      onSuccess: (res) => {
        console.log({ res })
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
              Already have an account?
              <Link href="/signin" className="pl-2 text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </Stack>
        </form>
      </div>
    </div>
  )
}

export default SignUp
