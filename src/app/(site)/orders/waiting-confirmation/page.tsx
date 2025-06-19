'use client'
import { useOrder } from '@/hooks/useOrder'
import { Container, Image, Stack, Text, Title } from '@mantine/core'
import { useRouter } from 'nextjs-toploader/app'
import { useEffect } from 'react'

const WaitingConfirmation = () => {
  const router = useRouter()

  const { data, refetch } = useOrder.checkStatus()

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5000)

    return () => clearInterval(interval)
  }, [refetch])

  useEffect(() => {
    if (data?.data?.isShipped === true) {
      router.push('/orders/success')
    }
  }, [data, router])

  return (
    <Container size="xl" my={120}>
      <Stack align="center" gap="lg">
        <Image src="/images/waiting.svg" h={400} w={600} fit="contain" alt="Waiting Confirmation" />
        <Title order={2} ta="center">
          Payment Received. Waiting for Admin Confirmation.
        </Title>
        <Text ta="center" size="md" c="dimmed" maw={600}>
          Thank you for uploading your proof of payment. Your transaction is now under review. Once
          approved by our admin, the status will automatically update to <strong>Success</strong>.
          Please wait a moment.
        </Text>
      </Stack>
    </Container>
  )
}

export default WaitingConfirmation
