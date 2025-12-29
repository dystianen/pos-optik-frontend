'use client'
import { useOrder } from '@/hooks/useOrder'
import { Card, Image, Stack, Text, Title } from '@mantine/core'
import { readLocalStorageValue } from '@mantine/hooks'
import { useRouter } from 'nextjs-toploader/app'
import { useEffect } from 'react'

type CheckoutOrder = {
  order_id: string
  grand_total: number
}

const StepPaymentConfirmation = ({ nextStep }: { nextStep: () => void }) => {
  const router = useRouter()
  const checkoutOrderRaw = readLocalStorageValue<string>({ key: 'checkout_order' })
  const checkoutOrder = checkoutOrderRaw ? JSON.parse(checkoutOrderRaw) : null
  console.log('🚀 ~ StepPaymentConfirmation ~ checkoutOrder:', checkoutOrder)

  const { data, refetch } = useOrder.checkStatus(checkoutOrder?.order_id || '')

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5000)

    return () => clearInterval(interval)
  }, [refetch])

  useEffect(() => {
    if (data?.is_paid === true) {
      nextStep()
    }
  }, [data, router])

  return (
    <Card shadow="md" radius="lg" p="xl">
      <Stack align="center" gap="lg">
        <Image src="/images/waiting.svg" h={300} w={400} fit="contain" alt="Waiting Confirmation" />
        <Title order={2} ta="center">
          Payment Received. Waiting for Admin Confirmation.
        </Title>
        <Text ta="center" size="md" c="dimmed" maw={600}>
          Thank you for uploading your proof of payment. Your transaction is now under review. Once
          approved by our admin, the status will automatically update to <strong>Success</strong>.
          Please wait a moment.
        </Text>
      </Stack>
    </Card>
  )
}

export default StepPaymentConfirmation
