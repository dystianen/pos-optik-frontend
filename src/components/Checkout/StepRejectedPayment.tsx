'use client'
import { useOrder } from '@/hooks/useOrder'
import { Button, Card, Image, Stack, Text, Title } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'

const StepRejectedPayment = () => {
  const [checkoutOrderRaw] = useLocalStorage({ key: 'checkout_order' })
  const checkoutOrder = checkoutOrderRaw ? JSON.parse(checkoutOrderRaw) : null

  const [, setActiveStep] = useLocalStorage({
    key: 'step',
    defaultValue: 0
  })

  const { mutate: retryPayment, isPending: isLoading } = useOrder.updateStatus()

  const handleRetryPayment = () => {
    const { order_id } = checkoutOrder
    retryPayment(
      {
        orderId: order_id,
        payload: {
          status_id: '2aa5c9be-906c-402c-a5fc-a16663125c3a' // PENDING
        }
      },
      {
        onSuccess: () => {
          setActiveStep(2)
        }
      }
    )
  }

  return (
    <Card shadow="md" radius="lg" p="xl">
      <Stack align="center" gap="lg">
        <Image
          src="/images/payment-rejected.png"
          h={150}
          w={150}
          fit="contain"
          alt="Payment Rejected"
        />

        <Title order={2} ta="center" c="red">
          Payment Rejected
        </Title>

        <Text ta="center" size="md" c="dimmed" maw={600}>
          Unfortunately, your payment could not be verified by our admin. This may be due to an
          invalid proof of payment, incorrect amount, or unclear transfer details.
        </Text>

        <Text ta="center" size="sm" c="dimmed">
          Please re-upload your payment proof or contact our support team if you believe this is a
          mistake.
        </Text>

        <Button color="red" radius="xl" onClick={handleRetryPayment} loading={isLoading}>
          Retry Payment
        </Button>
      </Stack>
    </Card>
  )
}

export default StepRejectedPayment
