'use client'

import CardCart from '@/components/Common/CardCart'
import { useCart } from '@/hooks/useCart'
import { useOrder } from '@/hooks/useOrder'
import { formatCurrency } from '@/utils/format'
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Textarea,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

const Checkout = () => {
  const router = useRouter()
  const { data: cart } = useCart.cart()
  const { mutate: checkout } = useOrder.checkout()

  const [loading, setLoading] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      shipping_address: ''
    }
  })

  const handleSubmit = useCallback((values: any) => {
    setLoading(true)
    checkout(values, {
      onSuccess: (res) => {
        setLoading(false)
        router.push('/orders/payment')
      },
      onError: (err) => {
        toast.error(err.message)
        setLoading(false)
      }
    })
  }, [])

  return (
    <Container size={'xl'} my={120}>
      <Title order={2} mb={32}>
        Checkout
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Textarea
            withAsterisk
            label="Shipping Address"
            placeholder="e.g. Jakarta"
            key={form.key('shipping_address')}
            {...form.getInputProps('shipping_address')}
          />

          <Card bg="primary.0">
            <Grid>
              <Grid.Col span={8}>
                <Title order={5}>Product</Title>
              </Grid.Col>
              <Grid.Col span={3}>
                <Title order={5}>Price</Title>
              </Grid.Col>
              <Grid.Col span={1}>
                <Title order={5}>Action</Title>
              </Grid.Col>
            </Grid>
          </Card>
          {Number(cart?.items.length) > 0 ? (
            cart?.items.map((item) => <CardCart key={item.order_item_id} item={item} />)
          ) : (
            <Card withBorder radius="md">
              <Stack>
                <Text>No Items Cart Found</Text>
              </Stack>
            </Card>
          )}
          <Card bg="primary.0">
            <Group justify="space-between" align="center">
              <Stack>
                <Box>
                  <Text>Shipping Costs: {formatCurrency(cart?.shipping_costs || '')}</Text>
                  <Text>Total Price: {formatCurrency(cart?.total_price || '')}</Text>
                </Box>

                <Title order={5}>Grand Total: {formatCurrency(cart?.grand_total || '')}</Title>
              </Stack>
              <Button radius="xl" size="xl" type="submit" loading={loading}>
                Payment
              </Button>
            </Group>
          </Card>
        </Stack>
      </form>
    </Container>
  )
}

export default Checkout
