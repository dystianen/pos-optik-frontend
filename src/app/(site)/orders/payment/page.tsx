'use client'

import { useOrder } from '@/hooks/useOrder'
import {
  ActionIcon,
  Button,
  Container,
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

const Payment = () => {
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
    <Container size="sm" my={80}>
      <Stack align="center" gap="lg">
        <Image src="/images/payment.svg" height={300} fit="contain" />

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
          <Stack gap="md" align="center" w="100%">
            <FileInput
              label="Upload Proof of Payment"
              placeholder="Select file"
              w="100%"
              radius="md"
              key={form.key('proof_of_payment')}
              {...form.getInputProps('proof_of_payment')}
            />
            <Button fullWidth radius="xl" type="submit" loading={loading}>
              Submit Payment
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
}

export default Payment
