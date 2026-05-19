'use client'
import Logo from '@/components/Layout/Header/Logo'
import { Button, Card, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useForgotPassword } from '../hooks'
import { TPayloadForgotPassword } from '../types'

const ForgotPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''
  const [loading, setLoading] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      customer_email: emailParam,
      customer_password: '',
      confirm_password: ''
    },
    validate: {
      customer_email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      customer_password: (value) =>
        value.length < 6 ? 'Password must be at least 6 characters' : null,
      confirm_password: (value, values) =>
        value !== values.customer_password ? 'Confirm password must match the new password' : null
    }
  })

  useEffect(() => {
    if (emailParam) {
      form.setFieldValue('customer_email', emailParam)
    }
  }, [emailParam])

  const { mutate: submitForgotPassword } = useForgotPassword()

  const handleSubmit = (values: TPayloadForgotPassword) => {
    setLoading(true)
    submitForgotPassword(values, {
      onSuccess: (res) => {
        setLoading(false)
        toast.success(res.message || 'Password updated successfully')
        router.replace('/signin')
      },
      onError: (err) => {
        setLoading(false)
        toast.error(err.message || 'Failed to reset customer password')
      }
    })
  }

  return (
    <div className="flex justify-center mb-10">
      <Card withBorder w={500} p={'xl'}>
        <div className="mb-8 text-center">
          <div className="mx-auto inline-block">
            <Logo />
          </div>
          <h2 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-400 mt-1">Reset your customer account password</p>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              withAsterisk
              label="Email Address"
              placeholder="your@email.com"
              key={form.key('customer_email')}
              {...form.getInputProps('customer_email')}
            />

            <TextInput
              withAsterisk
              type="password"
              label="New Password"
              placeholder="******"
              key={form.key('customer_password')}
              {...form.getInputProps('customer_password')}
            />

            <TextInput
              withAsterisk
              type="password"
              label="Confirm New Password"
              placeholder="******"
              key={form.key('confirm_password')}
              {...form.getInputProps('confirm_password')}
            />

            {/* Submit Button */}
            <Group justify="center" mt="md">
              <Button type="submit" w={'100%'} size="lg" loading={loading}>
                Reset Password
              </Button>
            </Group>

            <p className="text-sm text-gray-400 text-center mt-2">
              Remember your password?{' '}
              <Link href="/signin" className="pl-2 text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </Stack>
        </form>
      </Card>
    </div>
  )
}

export default ForgotPassword
