'use client'

import { useOrder } from '@/hooks/useOrder'
import { Button, Container, FileInput, Image, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

const Payment = () => {
  const router = useRouter()
  const form = useForm()

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

  return (
    <Container size={'xl'} my={120}>
      <Stack align="center">
        <Image src={'/images/payment.svg'} h={400} w={600} fit="contain" />
        <Text>Bca: 0901952680</Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md" align="center">
            <FileInput
              label="Proof of Payment"
              placeholder="Upload Proof of Payment"
              key={form.key('proof_of_payment')}
              {...form.getInputProps('proof_of_payment')}
            />
            <Button fullWidth radius="xl" type="submit" loading={loading}>
              Submit
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
}

export default Payment
