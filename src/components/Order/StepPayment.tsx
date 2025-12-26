'use client'

import { useOrder } from '@/hooks/useOrder'
import {
  ActionIcon,
  Button,
  Card,
  FileInput,
  Group,
  Image,
  Stack,
  Text,
  Tooltip
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClipboard } from '@mantine/hooks'
import { IconCheck, IconClipboard } from '@tabler/icons-react'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

const StepPayment = ({ prevStep }: { prevStep: () => void }) => {
  const router = useRouter()
  const form = useForm()
  const clipboard = useClipboard({ timeout: 1500 })

  const [loading, setLoading] = useState(false)

  const { mutate: payment } = useOrder.payment()

  const handleSubmit = useCallback((values: any) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('proof_of_payment', values.proof_of_payment)

    payment(values, {
      onSuccess: () => {
        router.push('/orders/waiting-confirmation')
        setLoading(false)
      },
      onError: (err) => {
        setLoading(false)
        toast.error(err.message)
      }
    })
  }, [])

  const accountNumber = '0901952680'
  const bankLabel = 'BCA'

  return (
    <Card shadow="md" radius="lg" p="xl">
      <Stack align="center" gap="lg">
        <Image src="/images/payment.svg" h={400} fit="contain" />

        <Group gap="xs" align="center">
          <Text fw={500} size="lg">
            {bankLabel}: {accountNumber}
          </Text>
          <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy'} withArrow position="top">
            <ActionIcon
              variant="light"
              color={clipboard.copied ? 'teal' : 'blue'}
              onClick={() => clipboard.copy(accountNumber)}
            >
              {clipboard.copied ? <IconCheck size={18} /> : <IconClipboard size={18} />}
            </ActionIcon>
          </Tooltip>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)} style={{ width: '100%' }}>
          <Stack gap="md" w="100%">
            <FileInput
              label="Upload Proof of Payment"
              placeholder="Select file"
              w="100%"
              radius="md"
              key={form.key('proof_of_payment')}
              {...form.getInputProps('proof_of_payment')}
            />
            <Group grow justify="center" mt="xl">
              <Button variant="default" radius="xl" size="lg" onClick={prevStep}>
                Back
              </Button>
              <Button radius="xl" size="lg" loading={loading} onClick={handleSubmit}>
                Submit Payment
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Card>
  )
}

export default StepPayment
