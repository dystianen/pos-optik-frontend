'use client'
import Logo from '@/components/Layout/Header/Logo'
import { useAuth } from '@/hooks/useAuth'
import { Box, Button, Divider, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

const SignUp = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { mutate: submitRegister } = useAuth.register()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      customer_dob: '',
      customer_gender: '',
      customer_occupation: '',
      customer_preferences: {
        color: '',
        material: '',
        frame_style: ''
      },
      customer_eye_history: {
        left_eye: { axis: 0, sphere: 0, cylinder: 0 },
        right_eye: { axis: 0, sphere: 0, cylinder: 0 },
        condition: '',
        last_checkup: ''
      }
    }
  })

  const handleSubmit = (values: any) => {
    setLoading(true)

    submitRegister(values, {
      onSuccess: () => {
        toast.success('Successfully registered')
        setLoading(false)
        router.push('/signin')
      },
      onError: (err) => {
        toast.error(err.message || 'Registration failed')
        setLoading(false)
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
            {/* General Information */}
            <TextInput
              withAsterisk
              label="Name"
              placeholder="e.g., Rudi Amanah"
              key={form.key('customer_name')}
              {...form.getInputProps('customer_name')}
            />
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
            <TextInput
              withAsterisk
              label="Phone"
              placeholder="e.g., +62 813-4756-8723"
              key={form.key('customer_phone')}
              {...form.getInputProps('customer_phone')}
            />
            <DateInput
              withAsterisk
              label="Date of Birth"
              placeholder="12/03/2000"
              key={form.key('customer_dob')}
              {...form.getInputProps('customer_dob')}
            />
            <Select
              withAsterisk
              label="Gender"
              placeholder="Select gender"
              data={['Male', 'Female']}
              key={form.key('customer_gender')}
              {...form.getInputProps('customer_gender')}
            />
            <TextInput
              withAsterisk
              label="Occupation"
              placeholder="e.g., Researcher"
              key={form.key('customer_occupation')}
              {...form.getInputProps('customer_occupation')}
            />

            <Divider my="md" label="Preferences" />
            {/* Preferences */}
            <TextInput
              label="Color Preference"
              placeholder="e.g., Hijau Neon"
              key={form.key('customer_preferences.color')}
              {...form.getInputProps('customer_preferences.color')}
            />
            <TextInput
              label="Material Preference"
              placeholder="e.g., Acetate"
              key={form.key('customer_preferences.material')}
              {...form.getInputProps('customer_preferences.material')}
            />
            <TextInput
              label="Frame Style"
              placeholder="e.g., Half-rim"
              key={form.key('customer_preferences.frame_style')}
              {...form.getInputProps('customer_preferences.frame_style')}
            />

            <Divider my="md" label="Eye History" />
            {/* Eye History */}
            <TextInput
              label="Condition"
              placeholder="e.g., Hipermetropi"
              key={form.key('customer_eye_history.condition')}
              {...form.getInputProps('customer_eye_history.condition')}
            />
            <DateInput
              label="Last Checkup"
              placeholder="e.g., 11/03/2024"
              key={form.key('customer_eye_history.last_checkup')}
              {...form.getInputProps('customer_eye_history.last_checkup')}
            />
            {/* Left Eye */}
            <Box>
              <strong>Left Eye:</strong>
              <Group grow>
                <NumberInput
                  label="Axis"
                  key={form.key('customer_eye_history.left_eye.axis')}
                  {...form.getInputProps('customer_eye_history.left_eye.axis')}
                />
                <NumberInput
                  label="Sphere"
                  step={0.25}
                  key={form.key('customer_eye_history.left_eye.sphere')}
                  {...form.getInputProps('customer_eye_history.left_eye.sphere')}
                />
                <NumberInput
                  label="Cylinder"
                  step={0.25}
                  key={form.key('customer_eye_history.left_eye.cylinder')}
                  {...form.getInputProps('customer_eye_history.left_eye.cylinder')}
                />
              </Group>
            </Box>
            {/* Right Eye */}
            <Box>
              <strong>Right Eye:</strong>
              <Group grow>
                <NumberInput
                  label="Axis"
                  key={form.key('customer_eye_history.right_eye.axis')}
                  {...form.getInputProps('customer_eye_history.right_eye.axis')}
                />
                <NumberInput
                  label="Sphere"
                  step={0.25}
                  key={form.key('customer_eye_history.right_eye.sphere')}
                  {...form.getInputProps('customer_eye_history.right_eye.sphere')}
                />
                <NumberInput
                  label="Cylinder"
                  step={0.25}
                  key={form.key('customer_eye_history.right_eye.cylinder')}
                  {...form.getInputProps('customer_eye_history.right_eye.cylinder')}
                />
              </Group>
            </Box>

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
