'use client'

import CardCart from '@/components/Common/CardCart'
import CardCartSkeleton from '@/components/Common/Skeleton/CardCartSkeleton'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/format'
import { Button, Card, Container, Grid, Group, Stack, Text, Title } from '@mantine/core'
import { useRouter } from 'nextjs-toploader/app'
import { useCallback } from 'react'

const Cart = () => {
  const router = useRouter()
  const { data: cart, isLoading } = useCart.cart()

  const handleCheckout = useCallback(() => {
    router.push('/checkout')
  }, [])

  return (
    <Container size={'xl'} my={120}>
      <Title order={2} mb={32}>
        My Cart
      </Title>
      <Stack>
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
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <CardCartSkeleton key={i} />)
        ) : Number(cart?.items.length) > 0 ? (
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
            <Title order={5}>Total Price: {formatCurrency(cart?.total_price || '')}</Title>
            <Button radius="xl" onClick={handleCheckout}>
              Checkout
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  )
}

export default Cart
