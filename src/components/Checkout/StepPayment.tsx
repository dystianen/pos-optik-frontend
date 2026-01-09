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
import { useClipboard, useLocalStorage } from '@mantine/hooks'
import { IconCheck, IconClipboard } from '@tabler/icons-react'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

type FormValues = {
  proof: File | null
}

const StepPayment = ({ nextStep }: { nextStep: () => void }) => {
  const clipboard = useClipboard({ timeout: 1500 })
  const [checkoutOrderRaw] = useLocalStorage({ key: 'checkout_order' })
  const checkoutOrder = checkoutOrderRaw ? JSON.parse(checkoutOrderRaw) : null

  const { mutate: payment, isPending: isLoadingSubmit } = useOrder.payment()

  const form = useForm<FormValues>({
    initialValues: {
      proof: null
    },
    validate: {
      proof: (value) => (!value ? 'Payment proof is required' : null)
    }
  })

  const handleSubmit = useCallback(
    (values: FormValues) => {
      if (!values.proof) return

      if (!checkoutOrder) {
        toast.error('Order expired, please checkout again')
        return
      }

      const { order_id, grand_total } = checkoutOrder

      const formData = new FormData()
      formData.append('order_id', order_id)
      formData.append('payment_method_id', 'e2914263-7e0f-4e3c-9425-0958c9581215') // MANUAL TRANSFER
      formData.append('amount', String(grand_total))
      formData.append('proof', values.proof)

      payment(formData, {
        onSuccess: () => {
          toast.success('Payment submitted')
          nextStep()
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Upload failed')
        }
      })
    },
    [checkoutOrder, payment, nextStep]
  )

  const accountNumber = '0901952680'
  const bankLabel = 'BCA'

  return (
    <Card shadow="md" radius="lg" p="xl">
      <Stack align="center" gap="lg">
        <Image src="/images/payment.svg" h={360} fit="contain" />

        <Group gap="xs">
          <Text fw={500} size="lg">
            {bankLabel}: {accountNumber}
          </Text>
          <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy'}>
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
          <Stack>
            <FileInput
              label="Upload Proof of Payment"
              placeholder="Select image"
              accept="image/png,image/jpeg,image/webp"
              radius="md"
              {...form.getInputProps('proof')}
            />

            <Group grow mt="xl">
              <Button type="submit" radius="xl" size="xl" loading={isLoadingSubmit}>
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
