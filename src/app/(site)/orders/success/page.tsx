'use client'
import { Button, Container, Image, Stack, Text, Title } from '@mantine/core'
import { useRouter } from 'nextjs-toploader/app'

const OrderSuccess = () => {
  const router = useRouter()

  return (
    <Container size="xl" my={120}>
      <Stack align="center" gap="lg">
        <Image
          src="/images/payment-success.png"
          h={200}
          w={200}
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
        <Button radius={'xl'} onClick={() => router.push('/orders')}>
          View My Order
        </Button>
      </Stack>
    </Container>
  )
}

export default OrderSuccess
