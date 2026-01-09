'use client'
import { Button, Card, Image, Stack, Text, Title } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { useRouter } from 'nextjs-toploader/app'

const StepSuccessPayment = () => {
  const router = useRouter()

  const [, , removeStep] = useLocalStorage({ key: 'step' })
  const [, , removeCsaId] = useLocalStorage({ key: 'csaId' })
  const [, , removeCheckoutOrder] = useLocalStorage({ key: 'checkout_order' })

  const handleViewMyOrder = () => {
    router.push('/my-orders')
    setTimeout(() => {
      removeStep()
      removeCsaId()
      removeCheckoutOrder()
    }, 300)
  }

  return (
    <Card shadow="md" radius="lg" p="xl">
      <Stack align="center" gap="lg">
        <Image
          src="/images/payment-success.png"
          h={150}
          w={150}
          fit="contain"
          alt="Order Confirmed"
        />
        <Title order={2} ta="center">
          Payment Confirmed
        </Title>
        <Text ta="center" size="md" c="dimmed" maw={600}>
          Your payment has been successfully confirmed by our admin. Your order is now being
          processed and will be shipped shortly. Thank you for your trust and purchase!
        </Text>
        <Button radius={'xl'} onClick={handleViewMyOrder}>
          View My Order
        </Button>
      </Stack>
    </Card>
  )
}

export default StepSuccessPayment
